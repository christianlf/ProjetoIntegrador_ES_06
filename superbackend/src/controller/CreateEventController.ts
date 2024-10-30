// src/controller/CreateEventController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { ServicoDeEvento } from '../services/CreateEventService'; // Verifique se o nome do serviço está correto
import { CreateEventRequestBody } from '../types';

export class CreateEventController {
    private servicoDeEvento = new ServicoDeEvento();

    async handle(request: FastifyRequest<{ Body: CreateEventRequestBody }>, reply: FastifyReply) {
        const { titulo, descricao, precoPorCota, dataInicio, dataFim, dataEvento } = request.body;

        // Validação de entrada
        if (titulo.length > 50) {
            return reply.status(400).send({ error: 'Título deve ter no máximo 50 caracteres.' });
        }

        if (descricao.length > 150) {
            return reply.status(400).send({ error: 'Descrição deve ter no máximo 150 caracteres.' });
        }

        if (precoPorCota < 1) {
            return reply.status(400).send({ error: 'Preço por cota deve ser no mínimo R$ 1,00.' });
        }

        if (dataInicio >= dataFim) {
            return reply.status(400).send({ error: 'A data de início deve ser anterior à data de fim.' });
        }

        try {
            const evento = await this.servicoDeEvento.criarEvento(request.body);
            reply.status(201).send(evento);
        } catch (error) {
            console.error(error); // Log do erro para depuração
            reply.status(500).send({ error: 'Erro ao criar evento.' });
        }
    }
}
