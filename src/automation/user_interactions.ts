import { Client, Message, MessageReaction, PartialMessageReaction, PartialUser, User, VoiceState } from "discord.js";

import { getUserInteraction } from "@/core/database/interaction/get";
import { updateUserInteraction } from "@/core/database/interaction/update";
import { Document } from "@/core/interface/document";
import { UserInteraction } from "@/core/interface/user_interaction";

/**
 * Classe para rastrear as interações do usuário
 *
 * @param client - Client do Discord
 */
export class UserInteractionTracker {
    private static instance: UserInteractionTracker;
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Retorna a instância da classe
     *
     * @param client - Client do Discord
     * @returns - Instância da classe
     */
    public static getInstance(client: Client): UserInteractionTracker {
        if (!UserInteractionTracker.instance) {
            UserInteractionTracker.instance = new UserInteractionTracker(client);
        }
        return UserInteractionTracker.instance;
    }

    /**
     * Configura o rastreamento de interações
     */
    public setup(): void {
        this.client.on("messageCreate", async (message: Message) => {
            if (message.author.bot || !message.guild) return;
            if (message.attachments && message.attachments.size > 0) {
                await this.trackAttachment(message.author.id, message.guild.id);
            } else {
                await this.trackMessage(message.author.id, message.guild.id);
            }
        });

        this.client.on(
            "messageReactionAdd",
            async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
                try {
                    // Verifica se a reação é parcial e tenta carregá-la
                    if (reaction.partial) {
                        await reaction.fetch();
                    }

                    // Verifica se o usuário é parcial e tenta carregá-lo
                    if (user.partial) {
                        await user.fetch();
                    }

                    if (user.bot || !reaction.message.guild) return;
                    await this.trackReaction(user.id, reaction.message.guild.id);
                } catch (error) {
                    console.error("Erro ao processar reação:", error);
                }
            }
        );

        this.client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
            // Usuário entrou em um canal de voz
            if (!oldState.channelId && newState.channelId) {
                await this.handleVoiceJoin(newState.member!.id, newState.guild.id);
            }
            // Usuário saiu de um canal de voz
            else if (oldState.channelId && !newState.channelId) {
                await this.handleVoiceLeave(oldState.member!.id, oldState.guild.id);
            }
            // Usuário mudou de canal
            else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
                // Não precisa fazer nada, pois o usuário continua em call
                return;
            }
        });
    }

    /**
     * Rastreia a interação de anexos
     *
     * @param userId - ID do usuário
     * @param guildId - ID do servidor
     */
    private async trackAttachment(userId: string, guildId: string): Promise<void> {
        const data: Partial<Document> = {
            $inc: { attachmentCount: 1.5 },
            $set: { lastInteraction: new Date() },
            $setOnInsert: { reactionCount: 0, messageCount: 0, totalTimeInVoice: 0, isInVoice: false },
        };
        await updateUserInteraction({ userId, guildId }, data);
    }

    /**
     * Rastreia a interação de mensagens
     *
     * @param userId - ID do usuário
     * @param guildId - ID do servidor
     */
    private async trackMessage(userId: string, guildId: string): Promise<void> {
        const data: Partial<Document> = {
            $inc: { messageCount: 1 },
            $set: { lastInteraction: new Date() },
            $setOnInsert: { reactionCount: 0, attachmentCount: 0, totalTimeInVoice: 0, isInVoice: false },
        };
        await updateUserInteraction({ userId, guildId }, data);
    }

    /**
     * Rastreia a interação de reações
     *
     * @param userId - ID do usuário
     * @param guildId - ID do servidor
     */
    private async trackReaction(userId: string, guildId: string): Promise<void> {
        const data: Partial<Document> = {
            $inc: { reactionCount: 1 },
            $set: { lastInteraction: new Date() },
            $setOnInsert: { messageCount: 0, attachmentCount: 0, totalTimeInVoice: 0, isInVoice: false },
        };
        await updateUserInteraction({ userId, guildId }, data);
    }

    /**
     * Obtém as estatísticas de interação do usuário
     *
     * @param userId - ID do usuário
     * @param guildId - ID do servidor
     * @returns - Estatísticas de interação do usuário
     */
    public async getUserStats(userId: string, guildId: string): Promise<UserInteraction | null> {
        const userActivity: UserInteraction | null = await getUserInteraction({ userId, guildId });
        if (!userActivity) return null;

        return {
            userId: userActivity.userId,
            guildId: userActivity.guildId,
            messageCount: userActivity.messageCount,
            reactionCount: userActivity.reactionCount,
            totalTimeInVoice: userActivity.totalTimeInVoice || 0,
            lastInteraction: userActivity.lastInteraction,
            lastVoiceJoin: userActivity.lastVoiceJoin || null,
            isInVoice: userActivity.isInVoice || false,
            attachmentCount: userActivity.attachmentCount || 0,
        };
    }

    /**
     * Gerencia a entrada do usuário em um canal de voz
     *
     * @param userId - ID do usuário
     * @param guildId - ID do servidor
     */
    private async handleVoiceJoin(userId: string, guildId: string): Promise<void> {
        const data: Partial<Document> = {
            $set: {
                lastVoiceJoin: new Date(),
                isInVoice: true,
                lastInteraction: new Date(),
            },
            $setOnInsert: {
                totalTimeInVoice: 0,
                reactionCount: 0,
                messageCount: 0,
                attachmentCount: 0,
            },
        };
        await updateUserInteraction({ userId, guildId }, data);
    }

    /**
     * Gerencia a saída do usuário de um canal de voz
     *
     * @param userId - ID do usuário
     * @param guildId - ID do servidor
     */
    private async handleVoiceLeave(userId: string, guildId: string): Promise<void> {
        const userActivity: UserInteraction | null = await getUserInteraction({ userId, guildId });

        if (userActivity && userActivity.isInVoice) {
            // Calcula o tempo em minutos que o usuário ficou em voz
            const timeSpent = Math.floor((new Date().getTime() - userActivity.lastVoiceJoin.getTime()) / 1000 / 60);

            const data: Partial<Document> = {
                $inc: { totalTimeInVoice: timeSpent },
                $set: {
                    isInVoice: false,
                    lastInteraction: new Date(),
                },
                $setOnInsert: { reactionCount: 0, messageCount: 0, attachmentCount: 0 },
            };
            await updateUserInteraction({ userId, guildId }, data);
        }
    }

    /**
     * Formata o tempo de voz em horas e minutos
     *
     * @param minutes - Tempo em minutos
     * @returns - Tempo formatado
     */
    public formatVoiceTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${remainingMinutes}m`;
    }
}
