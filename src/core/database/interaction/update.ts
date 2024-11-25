import { MONGODB_COLLECTION_USER_INTERACTIONS } from "../../../config";
import { Document } from "../../interface/document";
import { UserInteraction } from "../../interface/user_interaction";
import { MongoDB } from "../mongodb";

/**
 * Atualiza as estatísticas de interação do usuário
 *
 * @param filter - Filtro para encontrar o usuário
 * @param data - Dados a serem atualizados
 */
export async function updateUserInteraction(filter: Partial<UserInteraction>, data: Partial<Document>): Promise<void> {
    try {
        const mongodb = MongoDB.getInstance();
        const db = mongodb.getDatabase();
        await db.collection(MONGODB_COLLECTION_USER_INTERACTIONS).updateOne(filter, data, { upsert: true });
    } catch (error) {
        console.error("Erro ao atualizar estatísticas de interação do usuário:", error);
        throw error;
    }
}
