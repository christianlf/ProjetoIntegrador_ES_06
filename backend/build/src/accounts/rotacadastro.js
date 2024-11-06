"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerenciadorCadastro = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var gerenciadorCadastro;
(function (gerenciadorCadastro_1) {
    async function cadastro(name, email, password, birthday_date) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        await connection.execute('INSERT INTO CONTAS (ID, nome_completo, email, senha, data_nascimento, tipo_usuario, saldo) VALUES (SEQ_CONTAS.NEXTVAL, :nome_completo, :email, :senha, :data_nascimento, :tipo_usuario, :saldo)', [name, email, password, birthday_date, 'PLAYER', 0]);
        await connection.execute('commit');
        await connection.close();
    }
    gerenciadorCadastro_1.gerenciadorCadastro = async (req, res) => {
        const pName = req.get('nome_completo');
        const pEmail = req.get('email');
        const pPassword = req.get('senha');
        const pBirthday_date = req.get('data_nascimento');
        if (pName && pEmail && pPassword && pBirthday_date) {
            let connection = await oracledb_1.default.getConnection({
                user: process.env.ORACLE_USER,
                password: process.env.ORACLE_PASSWORD,
                connectString: process.env.ORACLE_CONN_STR
            });
            const result = await connection.execute('SELECT * FROM CONTAS WHERE email = :email', [pEmail]);
            if (result.rows && result.rows.length > 0) {
                res.status(400).send('Usuário já cadastrado.');
            }
            else {
                await cadastro(pName, pEmail, pPassword, pBirthday_date);
                res.status(200).send('Usuário cadastrado com sucesso.');
            }
            await connection.close();
        }
        else {
            res.status(400).send('Requisição inválida - Parâmetros faltando.');
        }
    };
})(gerenciadorCadastro || (exports.gerenciadorCadastro = gerenciadorCadastro = {}));
