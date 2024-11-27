import { Router } from "express";

import { MongoDB } from "@/core/database/mongodb";

/**
 * Rotas da aplicação
 *
 * Necessário para utilização do serviço do bot no Cloud Run - GCP
 */
const router = Router();

router.get("/", (req, res) => {
    res.send("Servidor Dryscord Online");
});

router.get("/ping", (req, res) => {
    res.send("Pong!");
});

router.get("/readyz", async (req, res) => {
    try {
        const mongodb = MongoDB.getInstance();
        await mongodb.connect();
        res.send("Ready! MongoDB Connected");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

router.get("/livez", (req, res) => {
    res.send("Live!");
});

export default router;
