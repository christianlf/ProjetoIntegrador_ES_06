"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerenciadorLogin = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var gerenciadorLogin;
(function (gerenciadorLogin_1) {
    async function validateCredentials(email, senha) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const result = await connection.execute('SELECT * FROM CONTAS WHERE email = :email AND senha = :senha', [email, senha]);
        await connection.close();
        return result.rows && result.rows.length > 0;
    }
    gerenciadorLogin_1.gerenciadorLogin = async (req, res) => {
        const pEmail = req.get('email');
        const pSenha = req.get('senha');
        if (pEmail && pSenha) {
            const isLoggedIn = await login(pEmail, pSenha);
            if (isLoggedIn) {
                res.status(200).send('Login realizado com sucesso.');
            }
            else {
                res.status(401).send('Credenciais inválidas. Acesso negado.');
            }
        }
        else {
            res.status(400).send('Requisição inválida - Parâmetros faltando.');
        }
    };
    async function login(email, senha) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        await connection.execute('UPDATE CONTAS SET token = dbms_random.string(\'X\', 10) WHERE email = :email AND senha = :senha', [email, senha], { autoCommit: true });
        return await validateCredentials(email, senha);
    }
})(gerenciadorLogin || (exports.gerenciadorLogin = gerenciadorLogin = {}));
