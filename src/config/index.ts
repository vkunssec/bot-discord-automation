/**
 * Arquivo para carregamento das Variáveis de Ambiente registradas no arquivo `.env`
 */

import dotenv from "dotenv";

dotenv.config();

export const STAGE = process.env.STAGE ?? "development";

export const DISCORD_ACCESS_TOKEN = process.env.DISCORD_ACCESS_TOKEN ?? "invalid_token";

export const CLIENT_ID = process.env.CLIENT_ID ?? "invalid_clientId";

export const CHANNEL_LOGS = process.env.CHANNEL_LOGS ?? "invalid_channel_logs";

export const CHANNEL_WELCOME = process.env.CHANNEL_WELCOME ?? "invalid_channel_welcome";

export const ROLE_DEFAULT = process.env.ROLE_DEFAULT ?? "invalid_role_default";

export const CHANNEL_BIRTHDAY = process.env.CHANNEL_BIRTHDAY ?? "invalid_channel_birthday";

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/dryscord";

export const MONGODB_DATABASE = process.env.MONGODB_DATABASE ?? "dryscord";

export const MONGODB_COLLECTION_BIRTHDATE = process.env.MONGODB_COLLECTION_BIRTHDATE ?? "users_birthdate";

export const MONGODB_COLLECTION_USER_INTERACTIONS =
    process.env.MONGODB_COLLECTION_USER_INTERACTIONS ?? "user_interactions";

export const PORT = process.env.PORT ?? 80;
