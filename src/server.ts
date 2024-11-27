import cors from "cors";
import express from "express";
import helmet from "helmet";

import { PORT } from "@/config";
import { MongoDB } from "@/core/database/mongodb";
import router from "@/core/routes";
import { DryscordApplication } from "@/main";

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
    const dryscordApp = new DryscordApplication();
    await dryscordApp.start();

    // Inicialização do Servidor Express
    app.listen(PORT, () => {
        console.log(`Servidor Express iniciado na porta ${PORT}`);
    });
})();
