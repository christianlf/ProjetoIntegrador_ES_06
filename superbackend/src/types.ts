// src/types.ts
export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface CreateEventRequestBody {
    titulo: string;
    descricao: string;
    precoPorCota: number; // Use number se você estiver usando Float
    dataInicio: Date; // ou string, dependendo de como você está tratando
    dataFim: Date; // ou string
    dataEvento: Date; // ou string
}
