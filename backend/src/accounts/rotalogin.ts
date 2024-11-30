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
                
                const credenciaisValidas = await validateCredentials(pEmail, pSenha);
                if (credenciaisValidas) {
                    const token = await login(pEmail, pSenha);
                    if(token) {
                        res.status(200).json({message: 'Login realizado com sucesso.', token: token});
                    } else{
                        res.status(500).json({message: 'Erro ao gerar token.'});
                    }
                } else {
                    res.status(401).json({message: 'Credenciais inválidas. Acesso negado.'});
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
        
        const result = await connection.execute(
            'SELECT token FROM CONTAS WHERE email = :email AND senha = :senha',
            [email, senha]
        );

        var token = null;

        if (result.rows && result.rows.length > 0) {
            token = (result.rows[0] as { TOKEN: string }).TOKEN; 
           console.log(result.rows[0]);
        }

        await connection.close();
        return token;
    }

}

