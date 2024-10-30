import { error } from "console";
import prismaClient from "../prisma"

interface DeteleCustomerProps {
    id: string;
}
class DeleteCustomerService {
    async execute({ id }: DeteleCustomerProps) {
        if (!id) {
            throw new Error("solicitacao invalida")
        }
        const findCustomer = await prismaClient.customer.findFirst({
            where: {
                id: id
            }
        })
        if (!findCustomer) {
            throw new Error("cliente n encontrado")
        }
        await prismaClient.customer.delete({
            where: {
                id: findCustomer.id
            }

        })
        return{message: "deletado com sucesso"}
    }
}

export { DeleteCustomerService }