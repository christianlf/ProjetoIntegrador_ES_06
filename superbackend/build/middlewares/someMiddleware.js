"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../database/database"));
const UserController_1 = require("../controllers/UserController");
const app = (0, express_1.default)();
const userController = new UserController_1.UserController();
// Middleware para processar JSON
app.use(express_1.default.json());
// Definindo rotas
app.post('/signup', userController.signUp);
app.post('/login', userController.login);
// Conexão ao banco de dados e inicialização do servidor
database_1.default.initialize()
    .then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
})
    .catch((error) => console.log('Erro ao conectar ao banco de dados', error));
