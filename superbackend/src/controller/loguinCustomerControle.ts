import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticateUser } from '../services/AuthService'; // Importar a função diretamente
import { LoginRequestBody } from '../types';

interface CustomError extends Error {
    message: string;
}

export class LoginController {
    async handle(request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) {
        const { email, password } = request.body;

        console.log('Tentando autenticar usuário:', email); // Log para verificar o email recebido

        try {
            const user = await authenticateUser(email, password); // Chamar a função
            console.log('Autenticação bem-sucedida para usuário:', email); // Log para autenticação bem-sucedida
            return reply.send({ message: 'Login bem-sucedido', user });

        } catch (error) {
            const customError = error as CustomError;
            console.log('Erro de autenticação para usuário:', email, 'Erro:', customError.message); // Log para erro de autenticação
            return reply.status(401).send({ message: customError.message || 'Erro desconhecido' });         
        }
    }
}
