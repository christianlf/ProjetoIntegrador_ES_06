import prismaClient from "../prisma";

class ListCustomerService{
    async execute(){
        const customer=await prismaClient.customer.findMany()
        return customer;
    }
}
export {ListCustomerService}