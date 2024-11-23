import { MONGODB_COLLECTION_BIRTHDATE } from "../../../config";
import { MongoDB } from "../mongodb";

/**
 * Busca todos os aniversariantes do dia
 *
 * @returns Lista de aniversariantes
 */
export async function getBirthdays() {
    try {
        const mongodb = MongoDB.getInstance();
        const db = mongodb.getDatabase();

        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;

        // Busca todos os aniversariantes do dia
        const birthdays = await db
            .collection(MONGODB_COLLECTION_BIRTHDATE)
            .find({
                day: currentDay,
                month: currentMonth,
            })
            .toArray();

        return birthdays;
    } catch (error) {
        console.error("Erro ao buscar aniversariantes:", error);
        return [];
    }
};
