/**
 * Interface para as estatísticas de interação do usuário
 */
export interface UserInteraction {
    userId: string;
    guildId: string;
    messageCount: number;
    totalTimeInVoice: number;
    reactionCount: number;
    lastInteraction: Date;
    lastVoiceJoin: Date;
    isInVoice: boolean;
}
