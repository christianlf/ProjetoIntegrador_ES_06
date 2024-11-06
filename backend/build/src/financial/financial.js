"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialManager = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var FinancialManager;
(function (FinancialManager) {
    async function getWallet(ownerEmail) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        const connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const result = await connection.execute('SELECT balance FROM accounts WHERE email = :ownerEmail', [ownerEmail]);
        if (result.rows && result.rows.length > 0) {
            const balance = result.rows[0].BALANCE;
            await connection.close();
            return balance;
        }
        else {
            await connection.close();
            return undefined;
        }
    }
    FinancialManager.getWallet = getWallet;
    FinancialManager.getWalletHandler = async (req, res) => {
        const pEmail = req.get('email');
        if (pEmail) {
            const balance = await getWallet(pEmail);
            if (balance) {
                res.statusCode = 200;
                res.send(`Saldo da carteira encontrado: R$${balance}`);
            }
            else {
                res.statusCode = 400;
                res.send(`Carteira não encontrada para o email: ${pEmail}`);
            }
        }
    };
    async function addFunds(ownerEmail, funds) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const result = await connection.execute('SELECT email FROM accounts WHERE email = :ownerEmail', [ownerEmail]);
        if (result.rows && result.rows.length > 0) {
            await connection.execute(`UPDATE accounts SET balance = balance + :Funds WHERE email = :ownerEmail`, { funds, ownerEmail }, { autoCommit: true });
            await connection.close();
            return true;
        }
        else {
            return false;
        }
    }
    FinancialManager.addFundsHandler = async (req, res) => {
        const pEmail = req.get('email');
        const pFunds = req.get('funds');
        if (pEmail && pFunds) {
            const funds = parseFloat(pFunds);
            if (funds > 0 && await addFunds(pEmail, funds)) {
                res.status(200).send(`Depósito concluído com sucesso!`);
            }
            else {
                res.status(400).send('Quantia de depósito inválida ou email não encontrado');
            }
        }
        else {
            res.status(400).send('Email ou quantia de depósito não fornecidos');
        }
    };
    async function withdrawFunds(ownerEmail, saque) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const result = await connection.execute('SELECT email FROM accounts WHERE email = :ownerEmail', [ownerEmail]);
        if (result.rows && result.rows.length > 0) {
            await connection.execute(`UPDATE accounts SET balance = balance - :saque WHERE email = :ownerEmail`, { saque, ownerEmail }, { autoCommit: true });
            await connection.close();
            return true;
        }
        else {
            return false;
        }
    }
    FinancialManager.withdrawFundsHandler = async (req, res) => {
        const pEmail = req.get('email');
        const pSaque = req.get('saque');
        if (pEmail && pSaque) {
            var saque = parseFloat(pSaque);
            const balance = await getWallet(pEmail);
            if (balance) {
                if (saque > balance) {
                    res.status(400).send('Saldo insuficiente para realizar o saque');
                }
            }
            else {
                res.status(400).send('Saldo não encontrado para o email: ' + pEmail);
            }
            if (saque > 101000) {
                res.status(400).send('Quantia de saque ecedeu o limite diário');
            }
            ;
            if (saque > 0 && await withdrawFunds(pEmail, saque)) {
                res.status(200).send(`Saque concluído com sucesso!`);
            }
            else {
                res.status(400).send('Quantia de saque inválida ou email não encontrado');
            }
        }
        else {
            res.status(400).send('Email ou quantia de saque não fornecidos');
        }
    };
})(FinancialManager || (exports.FinancialManager = FinancialManager = {}));
