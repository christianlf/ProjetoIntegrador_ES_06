import { Request, RequestHandler, Response } from "express";
import OracleDB from "oracledb";
import dotenv from 'dotenv';
dotenv.config();

export namespace Obtercarteira {


    export async function getAccountByToken(token: string) {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });


        const result = await connection.execute(
            'SELECT id, email, tipo_usuario FROM CONTAS WHERE token = :token',
            [token]
        );

        var data: { ID: number, EMAIL: string, TIPO_USUARIO: string } | null = null;
        if (result.rows && result.rows.length > 0) {
            data = result.rows[0] as { ID: number, EMAIL: string, TIPO_USUARIO: string };
        }

        await connection.close();
        return data;
    }

    export async function obterCarteira(ownerEmail: string): Promise<number | undefined> {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        const connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const result = await connection.execute(
            'SELECT saldo FROM contas WHERE email = :ownerEmail',
            [ownerEmail]
        );

        if (result.rows && result.rows.length > 0) {
            const saldo = (result.rows[0] as { SALDO: number }).SALDO;
            await connection.close();
            return saldo;
        } else {
            await connection.close();
            return undefined;
        }
    }

    export const gerenciadorCarteira: RequestHandler = async (req: Request, res: Response) => {
        const token = req.get('token');

        if(token)
        {
            const account = await getAccountByToken(token);
            if(account)
            {
                const balance = await obterCarteira(account.EMAIL);
                if(balance)
                {
                    res.statusCode = 200;
                    res.json({saldo: balance});
                }
                else
                {
                    res.statusCode = 400;
                    res.send(`Carteira não encontrada para o email: ${account.EMAIL}`);
                }
            }
        }
    }
}
