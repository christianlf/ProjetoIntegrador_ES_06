import express from "express";
import cors from "cors";  // Importando o CORS
import routes from "./routes";

const port = 3000;
const app = express();

app.use(cors());  // Habilitando CORS para todas as rotas
app.use(express.json()); // Para lidar com JSON no corpo da requisição
app.use(routes); // Rotas

app.listen(port, () => {
    console.log(`Server is running on: ${port}`);
});
