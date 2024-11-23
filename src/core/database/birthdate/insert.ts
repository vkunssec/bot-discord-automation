import { User } from "discord.js";
import { MONGODB_COLLECTION_BIRTHDATE } from "../../../config";
import { MongoDB } from "../mongodb";

/**
 * Registra a data de aniversário do usuário no banco de dados MongoDB
 *
 * @param user - Usuário do Discord
 * @param day - Dia do aniversário
 * @param month - Mês do aniversário
 */
export async function insertBirthdate(user: User, day: number, month: number): Promise<void> {
    try {
        // Instancia a classe MongoDB
        const mongodb = MongoDB.getInstance();
        const db = mongodb.getDatabase();

        // Insere os dados no banco de dados MongoDB
        await db.collection(MONGODB_COLLECTION_BIRTHDATE).insertOne({
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatarURL(),
                tag: user.tag,
            },
            day,
            month,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Erro ao registrar aniversário:", error);
        throw error;
    }
}
