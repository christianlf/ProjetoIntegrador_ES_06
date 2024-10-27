import prismaClient from "../prisma";
import bcrypt from 'bcrypt';

interface CreateCustomerProps {
    name: string;
    email: string;
    password: string;
}

class CreateCustomerService {
    
    async execute({ name, email, password }: CreateCustomerProps) {
        // Verifique se todos os campos foram preenchidos
        if (!name || !email || !password) {
            throw new Error("Preencha todos os campos.");
        }

        // Verifique se o email já está cadastrado
        const existingCustomer = await prismaClient.customer.findUnique({
            where: { email },
        });

        if (existingCustomer) {
            throw new Error("Email já cadastrado.");
        }

        // Hash da senha antes de armazená-la
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crie um novo cliente com a senha hashada
        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                password: hashedPassword, // Armazene a senha hashada
                status: true,
            },
        });

        return customer;
    }
}

export { CreateCustomerService };
