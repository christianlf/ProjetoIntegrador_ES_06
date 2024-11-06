"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Para lidar com JSON no corpo da requisição
app.use(routes_1.default);
// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server is running on: ${port}`);
});
