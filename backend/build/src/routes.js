"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rotalogin_1 = require("./accounts/rotalogin");
const rotacadastro_1 = require("./accounts/rotacadastro");
const eventos_1 = require("./events/eventos");
const Obtercarteira_1 = require("./financial/Obtercarteira");
const addFundos_1 = require("./financial/addFundos");
const sacarfundos_1 = require("./financial/sacarfundos");
const routes = (0, express_1.Router)();
//rotas de contas
routes.post('/login', rotalogin_1.gerenciadorLogin.gerenciadorLogin);
routes.put('/criarConta', rotacadastro_1.gerenciadorCadastro.gerenciadorCadastro);
//rotas de financeiro
routes.get('/obterCarteira', Obtercarteira_1.Obtercarteira.gerenciadorCarteira);
routes.post('/AdicionarFundos', addFundos_1.AdicionarFundos.gerenciadorAdicionarFundos);
routes.post('/sacarFundos', sacarfundos_1.SacarFundos.gerenciadorSacarFundos);
//rotas de eventos
routes.post('/deleteEvent', eventos_1.ManipuladorDeEventos.excluirEventoHandler);
routes.post('/evaluateEvent', eventos_1.ManipuladorDeEventos.avaliarEventoHandler);
routes.get('/searchEvents', eventos_1.ManipuladorDeEventos.buscarEventosHandler);
routes.get('/getEvents', eventos_1.ManipuladorDeEventos.obterEventosHandler);
routes.put('/betOnEvent', eventos_1.ManipuladorDeEventos.apostarEmEventosHandler);
routes.post('/finishEvent', eventos_1.ManipuladorDeEventos.finalizarEventoHandler);
routes.put('/addEvent', eventos_1.ManipuladorDeEventos.adicionarNovoEventoHandler);
exports.default = routes;
