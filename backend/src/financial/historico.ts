import { Request, RequestHandler, Response } from "express";
import { Obtercarteira } from "../financial/Obtercarteira";
import OracleDB from "oracledb";
import dotenv from 'dotenv';
dotenv.config();

export namespace gerenciadorTransacao {

    async function obterTransacao(id: number, transacao: string) {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const result = await connection.execute(
            ' SELECT * FROM HISTORICO WHERE FK_CONTA_ID = :id AND tipo_transacao = :transacao ORDER BY data_transacao DESC',
            [id, transacao]
        );

        await connection.close();
        return result.rows;
    };

    export async function criarTransacao( transacao: string, id: number, valor: number) {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const result = await connection.execute(
        `INSERT INTO HISTORICO
        (historico_id, FK_CONTA_ID, tipo_transacao, valor, data_transacao)
        VALUES
        (SEQ_HISTORICO.NEXTVAL, :id_conta, :transacao, :valor, SYSTIMESTAMP)`,
        {
            id_conta: id,
            transacao: transacao,
            valor: valor
        },
        { autoCommit: true }
        );

        if (result.rowsAffected && result.rowsAffected > 0) {
            await connection.close();
            return true;
        } else {    
            await connection.close();
            return false;
        }
    }   

    export const obterTransacaoHandler: RequestHandler = async (req: Request, res: Response) => {
        const token = req.get('token');
        const transacao = req.get('transacao');

        if (token && transacao) {
            const conta = await Obtercarteira.getAccountByToken(token);
            if (conta) {
                const transacoes = await obterTransacao(conta.ID, transacao);
                res.status(200).json(transacoes);
            } else {
                res.status(401).json({ message: 'Token inválido.' });
            }
        } else {
            res.status(400).send('Requisição inválida - Parâmetros faltando.');
        }
    }
}