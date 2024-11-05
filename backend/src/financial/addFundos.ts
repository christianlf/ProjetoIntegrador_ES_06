import { Request, RequestHandler, Response } from "express";
import OracleDB from "oracledb";
import dotenv from 'dotenv';
dotenv.config();

export namespace AdicionarFundos {
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
            return false;
        }
    }

    export const gerenciadorAdicionarFundos: RequestHandler = async (req: Request, res: Response) => {
        const pEmail = req.get('email');
        const pFunds = req.get('funds');

        if (pEmail && pFunds) {
            const fundos = parseFloat(pFunds);
            if (fundos > 0 && await adicionarFundos(pEmail, fundos)) {
                res.status(200).send(`Depósito concluído com sucesso!`);
            } else {
                res.status(400).send('Quantia de depósito inválida ou email não encontrado');
            }
        } else {
            res.status(400).send('Email ou quantia de depósito não fornecidos');
        }
    };
}