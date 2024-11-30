import cors from "cors";
import express from "express";
import helmet from "helmet";

import { PORT } from "@/config";
import { MongoDB } from "@/core/database/mongodb";
import router from "@/core/routes";
import { DryscordApplication } from "@/main";

declare global {
    var botInstance: DryscordApplication;
}

// Adicionar no início do arquivo, após os imports
process.env.TZ = "America/Sao_Paulo";
console.log(new Date().toDateString);
console.log(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));

/**
 * Inicialização do Servidor Express
 */
const app = express();

// Configurações do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurações de segurança
app.use(cors());
app.use(helmet());

// Rotas da aplicação
app.use(router);

(async () => {
    /**
     * Conectar ao banco de dados MongoDB
     * Necessário para que alguns comandos funcionem
     * Abrindo a conexão quando a aplicação é levantada para
     * Aproveitar uma mesma conexão em toda aplicação
     * Diminuindo a quantidade de conexões ao banco de dados
     */
    try {
        await MongoDB.getInstance().connect();
    } catch (error) {
        console.error(error);
    }

    /**
     * Inicialização do Serviço Dryscord Application
     */
    const bot = new DryscordApplication();
    global.botInstance = bot;
    await bot.start();

    // Inicialização do Servidor Express
    app.listen(PORT, () => {
        console.log(`Servidor Express iniciado na porta ${PORT}`);
    });
})();
