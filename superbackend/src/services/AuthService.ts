import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function createUser(email: string, password: string, name: string, status: boolean) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.customer.create({
        data: {
            email,
            password: hashedPassword,
            name,
            status,
        },
    });
    return user;
}

export async function authenticateUser(email: string, password: string) {
    console.log('Tentando autenticar usuário:', email);

    const user = await prisma.customer.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        console.log('Usuário não encontrado');
        throw new Error('Usuário não encontrado');
    }
    console.log('Senha fornecida:', password); // Log para verificar a senha fornecida
    console.log('Senha armazenada:', user.password); // Log para verificar a senha armazenada
    // Comparando a senha fornecida com a senha armazenada (hash)
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        console.log('Senha inválida');
        throw new Error('Senha inválida');
    }

    console.log('Autenticação bem-sucedida para usuário:', email);
    return user;
}
