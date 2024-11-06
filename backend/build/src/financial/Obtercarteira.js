"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obtercarteira = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var Obtercarteira;
(function (Obtercarteira) {
    async function obterCarteira(ownerEmail) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        const connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const result = await connection.execute('SELECT saldo FROM contas WHERE email = :ownerEmail', [ownerEmail]);
        if (result.rows && result.rows.length > 0) {
            const saldo = result.rows[0].SALDO;
            await connection.close();
            return saldo;
        }
        else {
            await connection.close();
            return undefined;
        }
    }
    Obtercarteira.obterCarteira = obterCarteira;
    Obtercarteira.gerenciadorCarteira = async (req, res) => {
        const pEmail = req.get('email');
        if (pEmail) {
            const balance = await obterCarteira(pEmail);
            if (balance) {
                res.statusCode = 200;
                res.send(`Saldo da carteira encontrado: R$${balance}`);
            }
            else {
                res.statusCode = 400;
                res.send(`Carteira não encontrada para o email: ${pEmail}`);
            }
        }
    };
})(Obtercarteira || (exports.Obtercarteira = Obtercarteira = {}));
