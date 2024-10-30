// src/routes.ts
import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { LoginController } from './controller/loguinCustomerControle';
import { CreateCustomerController } from './controller/CreateCustomerController';
import { ListCustomerController } from './controller/ListCustomercontroller'; // Corrigido o nome do arquivo
import { DeleteCustomerController } from './controller/DeleteCustomerController';
import { CreateEventController } from './controller/CreateEventController';
import { LoginRequestBody } from './types'; // Importando o tipo
// src/controller/CreateEventController.ts
import { CreateEventRequestBody } from './types'; // Ajuste o caminho se necessário

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    // Rota de teste
    fastify.get("/teste", async (request, reply) => {
        return { ok: true };
    });

    // Rota de login
    const loginController = new LoginController();
    fastify.post('/login', async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) => {
        return loginController.handle(request, reply);
    });

    // Rota para cadastrar um cliente
    const createCustomerController = new CreateCustomerController();
    fastify.post("/cadastrar", async (request, reply) => {
        return createCustomerController.handle(request, reply);
    });

    // Rota para listar clientes
    const listCustomerController = new ListCustomerController();
    fastify.get("/listar", async (request, reply) => {
        return listCustomerController.handle(request, reply);
    });

    // Rota para deletar um cliente
    const deleteCustomerController = new DeleteCustomerController();
    fastify.delete("/deletar", async (request, reply) => {
        return deleteCustomerController.handle(request, reply);
    });
    // Rota para criar um novo evento
    const createEventController = new CreateEventController();
    fastify.post("/criar-evento", async (request: FastifyRequest<{ Body: CreateEventRequestBody }>, reply: FastifyReply) => {
        return createEventController.handle(request, reply);
    });
}
