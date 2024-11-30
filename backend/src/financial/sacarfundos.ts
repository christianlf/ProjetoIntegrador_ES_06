import { Request, RequestHandler, Response } from "express";
import OracleDB from "oracledb";
import dotenv from 'dotenv';
import { Obtercarteira } from "../financial/Obtercarteira";

dotenv.config();

export namespace SacarFundos {

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
    
    async function sacarFundos(ownerEmail: string, saque: number) {

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
                `UPDATE CONTAS SET saldo = saldo - :saque WHERE email = :ownerEmail`,
                { saque, ownerEmail },
                { autoCommit: true }
            );
            await connection.close();
            return true;
        } else {
            return false;
        }
    }

    export const gerenciadorSacarFundos: RequestHandler = async (req: Request, res: Response) => {
        const token = req.get('token');
        if (token){
            const account = await getAccountByToken(token);
            if (account) {
                const email = account.EMAIL;
                const saque = req.get('saque');
                if (email && saque) {
                    const saqueNumber = parseFloat(saque);
                    const saldo = await Obtercarteira.obterCarteira(email);
                    if (saldo) {
                        if (saqueNumber > saldo) {
                            res.status(400).json({ message: 'Saldo insuficiente para realizar o saque' });
                            return;
                        }
                    } else {
                        res.status(400).json({ message: 'Saldo não encontrado para o email: ' + email });
                        return;
                    }
                    if (saqueNumber > 101000) {
                        res.status(400).json({ message: 'Quantia de saque excedeu o limite diário' });
                        return;
                    }
                    if (saqueNumber > 0 && await sacarFundos(email, saqueNumber)) {
                        res.status(200).json({ message: 'Saque concluído com sucesso!' });
                    } else {
                        res.status(400).json({ message: 'Quantia de saque inválida ou email não encontrado' });
                    }
                } else {
                    res.status(400).json({ message: 'Email ou quantia de saque não fornecidos' });
                }
            } else {
                res.status(400).json({ message: 'Conta não encontrada' });
            }
        }
    }
}
