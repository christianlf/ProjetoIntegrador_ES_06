import { Request, Response, Router } from "express";
import { gerenciadorLogin } from "./accounts/rotalogin";
import { gerenciadorCadastro } from "./accounts/rotacadastro";
import { ManipuladorDeEventos } from "./events/eventos";
import { Obtercarteira } from "./financial/Obtercarteira";
import { AdicionarFundos } from "./financial/addFundos";
import { SacarFundos } from "./financial/sacarfundos";

const routes = Router();

//rotas de contas
routes.post('/login', gerenciadorLogin.gerenciadorLogin);
routes.put('/criarConta', gerenciadorCadastro.gerenciadorCadastro);

//rotas de financeiro
routes.get('/obterCarteira', Obtercarteira.gerenciadorCarteira);
routes.post('/AdicionarFundos', AdicionarFundos.gerenciadorAdicionarFundos);
routes.post('/sacarFundos', SacarFundos.gerenciadorSacarFundos);

//rotas de eventos
routes.post('/deleteEvent', ManipuladorDeEventos.excluirEventoHandler);
routes.post('/evaluateEvent', ManipuladorDeEventos.avaliarEventoHandler);
routes.get('/searchEvents', ManipuladorDeEventos.buscarEventosHandler);
routes.get('/getEvents', ManipuladorDeEventos.obterEventosHandler);
routes.put('/betOnEvent', ManipuladorDeEventos.apostarEmEventosHandler);
routes.post('/finishEvent', ManipuladorDeEventos.finalizarEventoHandler);
routes.put('/addEvent', ManipuladorDeEventos.adicionarNovoEventoHandler);

export default routes;