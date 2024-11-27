import { Router } from "express";

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

router.get("/readyz", (req, res) => {
    res.send("Ready!");
});

router.get("/livez", (req, res) => {
    res.send("Live!");
});

export default router;
