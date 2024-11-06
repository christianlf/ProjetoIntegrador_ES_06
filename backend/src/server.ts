import express from "express";
import { Request, Response, Router } from "express";
import routes from "./routes";

const port = 3000; 
const app = express();

app.use(express.json()); // Para lidar com JSON no corpo da requisição
app.use(routes);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server is running on: ${port}`);
});

