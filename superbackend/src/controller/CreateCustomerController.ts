import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";
import { AppError } from '../errors/App.Error'; // Ajuste o caminho conforme necessário
import prisma from '../prisma';

class CreateCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password } = request.body as { name: string; email: string; password: string };

        try {
            // Verificar se todos os campos foram fornecidos
            if (!name || !email || !password) {
                throw new AppError("Todos os campos são obrigatórios.", 400);
            }

            // Verificar se o cliente já existe
            const existingCustomer = await prisma.customer.findUnique({
                where: { email },
            });

            if (existingCustomer) {
                throw new AppError("Email já cadastrado.", 400);
            }

            // Criar novo cliente
            const customerService = new CreateCustomerService();
            const customer = await customerService.execute({ name, email, password });

            return reply.status(201).send(customer);
        } catch (error) {
            if (error instanceof AppError) {
                return reply.status(error.statusCode).send({ message: error.message });
            }
            console.error("Erro ao criar cliente:", error);
            return reply.status(500).send({ message: "Erro ao criar cliente." });
        }
    }
}

export { CreateCustomerController };
