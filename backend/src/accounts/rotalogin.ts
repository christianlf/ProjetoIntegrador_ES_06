import { Request, RequestHandler, Response } from "express";
import OracleDB from "oracledb";
import dotenv from 'dotenv';
dotenv.config();

export namespace gerenciadorLogin {

    async function validateCredentials(email: string, senha: string) {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const result = await connection.execute(
            'SELECT * FROM CONTAS WHERE email = :email AND senha = :senha',
            [email, senha]
        );

        await connection.close();

        return result.rows && result.rows.length > 0;
    }

    export const gerenciadorLogin: RequestHandler =
        async (req: Request, res: Response) => {
            const pEmail = req.get('email');
            const pSenha = req.get('senha');

            if (pEmail && pSenha) {
                const isLoggedIn = await login(pEmail, pSenha);

                if (isLoggedIn) {
                    res.status(200).send('Login realizado com sucesso.');
                } else {
                    res.status(401).send('Credenciais inválidas. Acesso negado.');
                }
            } else {
                res.status(400).send('Requisição inválida - Parâmetros faltando.');
            }
        }

    async function login(email: string, senha: string) {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        await connection.execute(
            'UPDATE CONTAS SET token = dbms_random.string(\'X\', 10) WHERE email = :email AND senha = :senha',
            [email, senha],
            { autoCommit: true }
        );

        return await validateCredentials(email, senha);
    }

}
