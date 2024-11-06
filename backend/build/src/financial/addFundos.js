"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdicionarFundos = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var AdicionarFundos;
(function (AdicionarFundos) {
    async function adicionarFundos(ownerEmail, funds) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const result = await connection.execute('SELECT email FROM CONTAS WHERE email = :ownerEmail', [ownerEmail]);
        if (result.rows && result.rows.length > 0) {
            await connection.execute(`UPDATE CONTAS SET saldo = saldo + :funds WHERE email = :ownerEmail`, { funds, ownerEmail }, { autoCommit: true });
            await connection.close();
            return true;
        }
        else {
            return false;
        }
    }
    AdicionarFundos.gerenciadorAdicionarFundos = async (req, res) => {
        const pEmail = req.get('email');
        const pFunds = req.get('funds');
        if (pEmail && pFunds) {
            const fundos = parseFloat(pFunds);
            if (fundos > 0 && await adicionarFundos(pEmail, fundos)) {
                res.status(200).send(`Depósito concluído com sucesso!`);
            }
            else {
                res.status(400).send('Quantia de depósito inválida ou email não encontrado');
            }
        }
        else {
            res.status(400).send('Email ou quantia de depósito não fornecidos');
        }
    };
})(AdicionarFundos || (exports.AdicionarFundos = AdicionarFundos = {}));
