import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { MongoDB } from "@/core/database/mongodb";

/**
 * Rotas da aplicação
 *
 * Necessário para utilização do serviço do bot no Cloud Run - GCP
 */
const router = Router();

router.get("/", (req, res) => {
    res.status(StatusCodes.OK).send("Servidor Dryscord Online");
});

router.get("/ping", (req, res) => {
    res.status(StatusCodes.OK).send("Pong!");
});

router.get("/readyz", async (req, res) => {
    try {
        const mongodb = MongoDB.getInstance();
        await mongodb.connect();
        res.status(StatusCodes.OK).send("Ready! MongoDB Connected");
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
});

router.get("/livez", (req, res) => {
    res.status(StatusCodes.OK).send("Live!");
});

router.get("/healthcheck", async (req, res) => {
    try {
        const mongodb = MongoDB.getInstance();
        const dbStatus = await mongodb.checkConnection();

        const bot = global.botInstance;

        if (!bot || !bot.isReady()) {
            res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                status: "error",
                timestamp: new Date().toISOString(),
                services: {
                    database: {
                        status: dbStatus.isConnected ? "healthy" : "unhealthy",
                        latency: `${dbStatus.latency}ms`,
                    },
                    bot: {
                        status: "unhealthy",
                        message: "Bot não está pronto ou não inicializado",
                    },
                },
            });
        }

        res.status(StatusCodes.OK).json({
            status: "ok",
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: dbStatus.isConnected ? "healthy" : "unhealthy",
                    latency: `${dbStatus.latency}ms`,
                },
                bot: {
                    status: "healthy",
                    uptime: bot.getUptime(),
                    guilds: bot.getGuildsCount(),
                    ping: bot.getPing(),
                },
            },
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: "unhealthy",
                    error: error instanceof Error ? error.message : String(error),
                },
                bot: {
                    status: "unhealthy",
                    error: error instanceof Error ? error.message : String(error),
                },
            },
        });
    }
});

export default router;
