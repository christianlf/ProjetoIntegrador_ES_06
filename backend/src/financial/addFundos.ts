import { Request, RequestHandler, Response } from "express";
import { gerenciadorTransacao } from "./historico";
import OracleDB from "oracledb";
import dotenv from 'dotenv';
dotenv.config();

export namespace AdicionarFundos {

    async function getAccountByToken(token: string) {
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


    async function adicionarFundos(ownerEmail: string, funds: number) {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const result = await connection.execute(
            'SELECT email FROM CONTAS WHERE email = :ownerEmail',
            [ownerEmail]
        );

        if (result.rows && result.rows.length > 0) {
            await connection.execute(
                `UPDATE CONTAS SET saldo = saldo + :funds WHERE email = :ownerEmail`,
                { funds, ownerEmail },
                { autoCommit: true }
            );
            await connection.close();
            return true;
        } else {
            await connection.close();
            return false;
        }
    }

    export const gerenciadorAdicionarFundos: RequestHandler = async (req: Request, res: Response) => {
        const token = req.get('token');;
        if (token) {
            const accounts = await getAccountByToken(token);
            if (accounts) {
                const pEmail = accounts.EMAIL;
                const pFunds = req.get('funds');

                if (pEmail && pFunds) {

                    const fundos = parseFloat(pFunds);
                    if (await gerenciadorTransacao.criarTransacao('DEPOSITO', accounts.ID, fundos)) {
                        if (fundos > 0 && await adicionarFundos(pEmail, fundos)) {
                            res.status(200).json({ message: 'Depósito concluído com sucesso!' });
                        } else {
                            res.status(400).json({ message: 'Quantia de depósito inválida ou email não encontrado' });
                        }
                    } else {
                        res.status(400).json({ message: 'Email ou quantia de depósito não fornecidos' });
                    }
                } else {
                    res.status(401).json({ message: 'Token inválido' });
                }
            } else {
                res.status(401).json({ message: 'Token inválido' });
            }
        };
    }
}