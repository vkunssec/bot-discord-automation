import cors from "cors";
import express from "express";
import helmet from "helmet";

import { PORT } from "@/config";
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

/**
 * Inicialização do Serviço Dryscord Application
 */
const dryscordApp = new DryscordApplication();
dryscordApp.start();

app.listen(PORT);
