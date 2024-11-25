import { Document } from "@/core/interface/document";

/**
 * Interface para as estatísticas de interação do usuário
 *
 * @interface UserInteraction
 * @extends Document
 */
export interface UserInteraction extends Document {
    userId: string;
    guildId: string;
    messageCount: number;
    totalTimeInVoice: number;
    reactionCount: number;
    lastInteraction: Date;
    lastVoiceJoin: Date;
    isInVoice: boolean;
}
