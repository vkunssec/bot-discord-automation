import { MONGODB_COLLECTION_USER_INTERACTIONS } from "../../../config";
import { UserInteraction } from "../../interface/user_interaction";
import { MongoDB } from "../mongodb";

/**
 * Obtém as estatísticas de interação do usuário
 *
 * @param filter - Filtro para encontrar o usuário
 * @returns - Estatísticas de interação do usuário
 */
export async function getUserInteraction(filter: Partial<UserInteraction>): Promise<UserInteraction | null> {
    try {
        const mongodb = MongoDB.getInstance();
        const db = mongodb.getDatabase();

        const userInteraction = await db.collection(MONGODB_COLLECTION_USER_INTERACTIONS).findOne(filter);
        return userInteraction ? (userInteraction as unknown as UserInteraction) : null;
    } catch (error) {
        console.error("Erro ao buscar estatísticas de interação do usuário:", error);
        return null;
    }
}
