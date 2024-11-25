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




// Rota para excluir um evento (ou marcar como excluído)
routes.post('/deleteEvent', ManipuladorDeEventos.excluirEventoHandler);

// Rota para avaliar ou aprovar um evento
routes.post('/evaluateEvent', ManipuladorDeEventos.avaliarEventoHandler);

// Rota para buscar eventos usando uma palavra-chave (título ou descrição)
routes.get('/searchEvents', ManipuladorDeEventos.buscarEventosHandler);

// Rota para obter eventos filtrados pelo status (pendente, aprovado, etc.)
routes.get('/getEvents', ManipuladorDeEventos.obterEventosHandler);

// Rota para fazer uma aposta em um evento, informando o valor e a opção da aposta
routes.put('/betOnEvent', ManipuladorDeEventos.apostarEmEventosHandler);

// Rota para finalizar um evento e distribuir os prêmios aos vencedores
routes.post('/finishEvent', ManipuladorDeEventos.finalizarEventoHandler);

// Rota para adicionar um novo evento ao sistema
routes.put('/addEvent', ManipuladorDeEventos.adicionarNovoEventoHandler);

export default routes;