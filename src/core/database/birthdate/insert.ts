import { MONGODB_COLLECTION_BIRTHDATE } from "@/config";
import { MongoDB } from "@/core/database/mongodb";
import { UserBirthday } from "@/core/interface/user_birthday";

/**
 * Registra a data de aniversário do usuário no banco de dados MongoDB
 *
 * @param data - Dados do aniversário
 */
export async function insertBirthdate(data: UserBirthday): Promise<void> {
    try {
        // Instancia a classe MongoDB
        const mongodb = MongoDB.getInstance();
        const db = mongodb.getDatabase();

        // Insere os dados no banco de dados MongoDB
        await db
            .collection(MONGODB_COLLECTION_BIRTHDATE)
            .updateOne({ userId: data.userId }, { $set: data }, { upsert: true });
    } catch (error) {
        console.error("Erro ao registrar aniversário:", error);
        throw error;
    }
}
