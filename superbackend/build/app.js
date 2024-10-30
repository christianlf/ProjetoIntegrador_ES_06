"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const database_1 = __importDefault(require("./database/database"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware para processar JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware para servir arquivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Conectar ao banco de dados
database_1.default.initialize()
    .then(() => {
    console.log('Conectado ao banco de dados!');
})
    .catch((error) => console.log('Erro ao conectar ao banco de dados:', error));
// Definindo rotas
app.use('/api/users', userRoutes_1.default);
// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
// Rota padrão para qualquer outra requisição não definida
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada!' });
});
exports.default = app;
