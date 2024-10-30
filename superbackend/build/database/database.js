"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/database/database.ts
const typeorm_1 = require("typeorm");
const UserEntity_1 = require("../entities/UserEntity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root', // Substitua pelo seu usuário
    password: 'root', // Substitua pela sua senha
    database: 'clientes', // Substitua pelo seu banco de dados
    entities: [UserEntity_1.UserEntity],
    synchronize: true, // Apenas para desenvolvimento, faz sincronização automática
});
exports.default = AppDataSource;
