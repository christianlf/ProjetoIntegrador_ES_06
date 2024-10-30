// src/services/CreateEventService.ts
import prisma from '../prisma';
import { CreateEventRequestBody } from '../types';

export class ServicoDeEvento {
    async criarEvento(eventoData: CreateEventRequestBody) {
        const evento = await prisma.evento.create({
            data: {
                titulo: eventoData.titulo,
                descricao: eventoData.descricao,
                precoPorCota: eventoData.precoPorCota,
                dataInicio: eventoData.dataInicio,
                dataFim: eventoData.dataFim,
                dataEvento: eventoData.dataEvento,
            },
        });
        return evento;
    }
}
