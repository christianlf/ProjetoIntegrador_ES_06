"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SacarFundos = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const Obtercarteira_1 = require("../financial/Obtercarteira");
dotenv_1.default.config();
var SacarFundos;
(function (SacarFundos) {
    async function sacarFundos(ownerEmail, saque) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const result = await connection.execute('SELECT email FROM CONTAS WHERE email = :ownerEmail', [ownerEmail]);
        if (result.rows && result.rows.length > 0) {
            await connection.execute(`UPDATE CONTAS SET saldo = saldo - :saque WHERE email = :ownerEmail`, { saque, ownerEmail }, { autoCommit: true });
            await connection.close();
            return true;
        }
        else {
            return false;
        }
    }
    SacarFundos.gerenciadorSacarFundos = async (req, res) => {
        const pEmail = req.get('email');
        const pSaque = req.get('saque');
        if (pEmail && pSaque) {
            var saque = parseFloat(pSaque);
            const saldo = await Obtercarteira_1.Obtercarteira.obterCarteira(pEmail);
            if (saldo) {
                if (saque > saldo) {
                    res.status(400).send('Saldo insuficiente para realizar o saque');
                }
            }
            else {
                res.status(400).send('Saldo não encontrado para o email: ' + pEmail);
            }
            if (saque > 101000) {
                res.status(400).send('Quantia de saque excedeu o limite diário');
            }
            ;
            if (saque > 0 && await sacarFundos(pEmail, saque)) {
                res.status(200).send(`Saque concluído com sucesso!`);
            }
            else {
                res.status(400).send('Quantia de saque inválida ou email não encontrado');
            }
        }
        else {
            res.status(400).send('Email ou quantia de saque não fornecidos');
        }
    };
})(SacarFundos || (exports.SacarFundos = SacarFundos = {}));
