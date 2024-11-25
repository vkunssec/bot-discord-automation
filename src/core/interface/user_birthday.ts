import { Document } from "./document";

/**
 * Interface para o aniversário do usuário
 *
 * @interface UserBirthday
 * @extends Document
 */
export interface UserBirthday extends Document {
    userId: string;
    day: number;
    month: number;
}
