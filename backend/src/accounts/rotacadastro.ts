import { Request, RequestHandler, Response } from "express";
import OracleDB from "oracledb";
import dotenv from 'dotenv';
dotenv.config();

export namespace gerenciadorCadastro {

    async function cadastro(name: string, email: string, password: string, birthday_date: string) {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        await connection.execute(
            'INSERT INTO CONTAS (ID, nome_completo, email, senha, data_nascimento, tipo_usuario, saldo) VALUES (SEQ_CONTAS.NEXTVAL, :nome_completo, :email, :senha, :data_nascimento, :tipo_usuario, :saldo)',
            [name, email, password, birthday_date, 'PLAYER', 0]
        );
        
        await connection.execute('commit');
        await connection.close();
    }

    export const gerenciadorCadastro : RequestHandler = async (req: Request, res: Response) => {
        const pName = req.get('nome_completo');
        const pEmail = req.get('email');
        const pPassword = req.get('senha');
        const pBirthday_date = req.get('data_nascimento');

        if (pName && pEmail && pPassword && pBirthday_date) {
            let connection = await OracleDB.getConnection({
                user: process.env.ORACLE_USER,
                password: process.env.ORACLE_PASSWORD,
                connectString: process.env.ORACLE_CONN_STR
            });
            
            const result = await connection.execute(
                'SELECT * FROM CONTAS WHERE email = :email',
                [pEmail]
            );

            if (result.rows && result.rows.length > 0) {
                res.status(400).send('Usuário já cadastrado.');
            } else {
                await cadastro(pName, pEmail, pPassword, pBirthday_date);
                res.status(200).send('Usuário cadastrado com sucesso.');
            }

            await connection.close();

        } else {
            res.status(400).send('Requisição inválida - Parâmetros faltando.');
        }
    };
}