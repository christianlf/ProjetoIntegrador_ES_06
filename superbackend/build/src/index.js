"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const PI = 3.1415;
const port = 3000;
function calcComCircuferencia(r) {
    return 2 * PI * r;
}
function CalcAreaCirculo(r) {
    return PI * r * r;
}
const server = http_1.default.createServer((req, res) => {
    if (req.url === "/CalcAreaCirculo") {
        const area = CalcAreaCirculo(10);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(area.toString());
    }
    else if (req.url === "/calcComCircuferencia") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        const comp = calcComCircuferencia(10);
        res.end(comp.toString());
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Resposta padrão para qualquer outra rota/serviço');
    }
});
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
