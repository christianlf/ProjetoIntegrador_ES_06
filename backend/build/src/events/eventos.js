"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManipuladorDeEventos = void 0;
const Obtercarteira_1 = require("../financial/Obtercarteira");
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var ManipuladorDeEventos;
(function (ManipuladorDeEventos) {
    async function adicionarNovoEvento(tituloEvento, descricaoEvento, dataInicioEvento, dataFinalEvento, fkIdConta) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        await connection.execute(`INSERT INTO EVENTOS(
            evento_id,
            titulo_evento,
            descricao_evento,
            data_inicio_evento,
            data_final_evento,
            status_evento,
            fk_id_conta
            ) VALUES (
            SEQ_EVENTOS.NEXTVAL,
            :tituloEvento,
            :descricaoEvento,
            :dataInicioEvento,
            :dataFinalEvento,
            'pendente',
            :fkIdConta
            )`, {
            tituloEvento: tituloEvento,
            descricaoEvento: descricaoEvento,
            dataInicioEvento: dataInicioEvento,
            dataFinalEvento: dataFinalEvento,
            fkIdConta: fkIdConta
        });
        await connection.execute('commit');
        await connection.close();
    }
    ManipuladorDeEventos.adicionarNovoEventoHandler = async (req, res) => {
        const tituloEvento = req.get('titulo_evento');
        const descricaoEvento = req.get('descricao_evento');
        const dataInicioEvento = req.get('data_inicio_evento');
        const dataFinalEvento = req.get('data_final_evento');
        const fkIdConta = req.get('fk_id_conta');
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dataInicioEvento || !dataFinalEvento || !dateRegex.test(dataInicioEvento) || !dateRegex.test(dataFinalEvento)) {
            res.status(400).send('Datas devem estar no formato dd/mm/yyyy.');
            return;
        }
        if (tituloEvento && descricaoEvento && dataInicioEvento && dataFinalEvento && fkIdConta) {
            await adicionarNovoEvento(tituloEvento, descricaoEvento, dataInicioEvento, dataFinalEvento, parseInt(fkIdConta));
            res.status(201).send('Evento Criado Com Sucesso. Aguarde a Aprovação.');
        }
        else {
            res.status(400).send('Parâmetros Faltando.');
        }
    };
    async function excluirEvento(eventoId) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        await connection.execute(`UPDATE EVENTOS SET status_evento = 'excluído' WHERE evento_id = :eventoId`, [eventoId]);
        await connection.commit();
        await connection.close();
    }
    ManipuladorDeEventos.excluirEventoHandler = async (req, res) => {
        const eventoId = req.get('evento_id');
        if (eventoId) {
            const id = parseFloat(eventoId);
            await excluirEvento(id);
            res.status(200).send('Evento Excluído Com Sucesso.');
        }
        else {
            res.status(400).send('Parâmetros Faltando.');
        }
    };
    async function avaliarEvento(eventoId, statusEvento, descricao) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        const connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        await connection.execute('UPDATE EVENTOS SET status_evento = :statusEvento WHERE evento_id = :eventoId', [statusEvento, eventoId], { autoCommit: true });
        await connection.close();
    }
    ManipuladorDeEventos.avaliarEventoHandler = async (req, res) => {
        const eventoId = req.get('evento_id');
        const statusEvento = req.get('status_evento');
        const mensagem = req.get('mensagem');
        if (eventoId && statusEvento && mensagem) {
            const id = parseInt(eventoId);
            await avaliarEvento(id, statusEvento, mensagem);
            res.status(200).send(`Evento ${statusEvento}, ${mensagem}`);
        }
        else {
            res.status(400).send('Parâmetros Faltando.');
        }
    };
    async function buscarEventos(palavraChave) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        let result = await connection.execute(`SELECT * FROM EVENTOS WHERE titulo_evento LIKE '%${palavraChave}%' OR descricao_evento LIKE '%${palavraChave}%'`);
        await connection.close();
        return result.rows;
    }
    ManipuladorDeEventos.buscarEventosHandler = async (req, res) => {
        const palavraChave = req.get('palavra_chave');
        if (palavraChave) {
            const eventos = await buscarEventos(palavraChave);
            res.status(200).send(eventos);
        }
        else {
            res.status(400).send('Parâmetros Faltando.');
        }
    };
    async function obterEventos(statusEvento) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        let result = await connection.execute(`SELECT * FROM EVENTOS WHERE status_evento = '${statusEvento}'`);
        await connection.close();
        return result.rows;
    }
    ManipuladorDeEventos.obterEventosHandler = async (req, res) => {
        const statusEvento = req.get('status_evento');
        if (statusEvento) {
            const eventos = await obterEventos(statusEvento);
            res.status(200).send(eventos);
        }
        else {
            res.status(400).send('Parâmetros Faltando.');
        }
    };
    async function apostarEmEventos(eventoId, email, valorAposta, opcaoAposta) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        await connection.execute(`INSERT INTO APOSTAS(
            aposta_id,
            valor_aposta,
            opcao_aposta,
            fk_email_conta,
            fk_id_evento
            ) VALUES (
            SEQ_APOSTAS.NEXTVAL,
            :valorAposta,
            :opcaoAposta,
            :email,
            :eventoId    
            )`, {
            valorAposta: valorAposta,
            opcaoAposta: opcaoAposta,
            email: email,
            eventoId: eventoId
        });
        await connection.execute('UPDATE CONTAS SET saldo = saldo - :valorAposta WHERE email = :email', {
            valorAposta: valorAposta,
            email: email
        });
        await connection.commit();
        await connection.close();
    }
    ;
    async function verificarConta(email) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        let result = await connection.execute(`SELECT * FROM CONTAS WHERE email = :email`, [email]);
        if (result.rows && result.rows.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    ManipuladorDeEventos.apostarEmEventosHandler = async (req, res) => {
        const eventoId = req.get('evento_id');
        const email = req.get('email');
        const valorAposta = req.get('valor_aposta');
        const opcaoAposta = req.get('opcao_aposta');
        // adicionar verificaçao se o evento esta com status de aprovado
        if (eventoId && email && valorAposta && opcaoAposta) {
            if (parseFloat(valorAposta) >= 1) {
                if (await verificarConta(email)) {
                    const saldoCarteira = await Obtercarteira_1.Obtercarteira.obterCarteira(email);
                    if (saldoCarteira) {
                        if (saldoCarteira < parseFloat(valorAposta)) {
                            res.status(400).send('Saldo Insuficiente.');
                        }
                        else {
                            await apostarEmEventos(parseInt(eventoId), email, parseFloat(valorAposta), opcaoAposta);
                            res.status(201).send('Aposta Realizada Com Sucesso.');
                        }
                    }
                    else {
                        res.status(400).send('Saldo não encontrado.');
                    }
                }
                else {
                    res.status(404).send('Conta não encontrada.');
                }
            }
            else {
                res.status(400).send('Valor da Aposta Inválido. Por Favor, insira mais que R$1,00.');
            }
        }
        else {
            res.send(400).send('Parâmetros Faltando.');
        }
    };
    async function finalizarEvento(eventoId, veredito) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        await connection.execute(`UPDATE EVENTOS SET status_evento = 'finalizado' WHERE evento_id = :eventoId`, [eventoId]);
        await connection.execute(`UPDATE EVENTOS SET veredito = :veredito WHERE evento_id = :eventoId`, [veredito, eventoId]);
        await connection.execute(`UPDATE EVENTOS SET valor_vitorias = (SELECT SUM(valor_aposta) FROM APOSTAS WHERE fk_id_evento = :eventoId AND opcao_aposta = :veredito) WHERE evento_id = :eventoId`, { eventoId: eventoId, veredito: veredito });
        await connection.execute(`UPDATE EVENTOS SET valor_derrotas = (SELECT SUM(valor_aposta) FROM APOSTAS WHERE fk_id_evento = :eventoId AND opcao_aposta != :veredito) WHERE evento_id = :eventoId`, { eventoId: eventoId, veredito: veredito });
        await connection.commit();
        await connection.close();
    }
    async function distribuirValores(eventoId, veredito) {
        oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
        let connection = await oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        // Obter todos os valores de aposta para os vencedores no evento específico
        const result = await connection.execute(`SELECT valor_aposta, fk_email_conta 
            FROM APOSTAS 
            WHERE fk_id_evento = :eventoId 
            AND opcao_aposta = :userOption`, { eventoId: eventoId, userOption: veredito });
        if (result.rows && result.rows.length > 0) {
            // Calcular o prêmio para cada vencedor
            for (const row of result.rows) {
                const resultValorVitorias = await connection.execute(`SELECT SUM(valor_aposta) AS TOTAL FROM APOSTAS WHERE fk_id_evento = :eventoId AND opcao_aposta = :veredito`, { eventoId: eventoId, veredito: veredito });
                const resultValorDerrotas = await connection.execute(`SELECT SUM(valor_aposta) AS TOTAL FROM APOSTAS WHERE fk_id_evento = :eventoId AND opcao_aposta != :veredito`, { eventoId: eventoId, veredito: veredito });
                if ((resultValorVitorias.rows && resultValorVitorias.rows.length > 0) && (resultValorDerrotas.rows && resultValorDerrotas.rows.length > 0)) {
                    const valorVitorias = resultValorVitorias.rows[0].TOTAL;
                    const valorDerrotas = resultValorDerrotas.rows[0].TOTAL;
                    if (typeof row === 'object' && row !== null) {
                        let valorAposta = row.VALOR_APOSTA; // Valor da aposta de cada vencedor
                        let email = row.FK_EMAIL_CONTA; // Email do usuário vencedor
                        // Calcular a proporção e o prêmio individual
                        var proporcao = valorAposta / valorVitorias;
                        const premio = valorDerrotas * proporcao;
                        // Atualizar o saldo do vencedor com o prêmio calculado
                        await connection.execute(`UPDATE CONTAS 
                        SET saldo = saldo + :premio + :valorAposta
                        WHERE email = :email`, { premio: premio, email: email, valorAposta: valorAposta });
                    }
                }
            }
            await connection.commit();
            await connection.close();
        }
    }
    ManipuladorDeEventos.finalizarEventoHandler = async (req, res) => {
        const eventoId = req.get('evento_id');
        const veredito = req.get('veredito');
        if (eventoId && veredito) {
            await finalizarEvento(parseInt(eventoId), veredito);
            await distribuirValores(parseInt(eventoId), veredito);
            res.status(200).send('Evento Finalizado Com Sucesso.');
        }
        else {
            res.status(400).send('Parâmetros Faltando.');
        }
    };
})(ManipuladorDeEventos || (exports.ManipuladorDeEventos = ManipuladorDeEventos = {}));
