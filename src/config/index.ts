/**
 * Arquivo para carregamento das Variáveis de Ambiente registradas no arquivo `.env`
 */

import dotenv from "dotenv";

dotenv.config();

export const STAGE = process.env.STAGE ?? "development";

export const DISCORD_ACCESS_TOKEN = process.env.DISCORD_ACCESS_TOKEN ?? "invalid_token";

export const CLIENT_ID = process.env.CLIENT_ID ?? "invalid_clientId";

export const CHANNEL_LOGS = process.env.CHANNEL_LOGS ?? "logs";
