import { MONGODB_COLLECTION_BIRTHDATE } from "@/config";
import { MongoDB } from "@/core/database/mongodb";
import { UserBirthday } from "@/core/interface/user_birthday";

/**
 * Busca todos os aniversariantes de um mês específico
 *
 * @param month Número do mês para consulta, exemplo: 1 para Janeiro, etc
 * @returns Lista de aniversariantes
 */
export async function getBirthdaysByMonth(month: number): Promise<Array<UserBirthday>> {
    try {
        const mongodb = MongoDB.getInstance();
        const db = mongodb.getDatabase();

        // Busca todos os aniversariantes do dia
        const birthdays = await db.collection(MONGODB_COLLECTION_BIRTHDATE).find({ month }).sort({ day: 1 }).toArray();

        return birthdays.map((birthday) => birthday as UserBirthday);
    } catch (error) {
        console.error("Erro ao buscar aniversariantes:", error);
        return [];
    }
}
