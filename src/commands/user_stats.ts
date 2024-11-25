import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import { UserInteractionTracker } from "@/automation/user_interactions";
import { Logs } from "@/controller/Logs";
import { Command } from "@/core/interface/command";
import { Points } from "@/tools/points";

/**
 * Comando para mostrar as estatísticas de interação do usuário
 *
 * @class UserStatsCommand
 * @implements Command
 */
export class UserStatsCommand implements Command {
    name = "stats";
    description = "Mostra as estatísticas de interação do usuário";

    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) =>
            option
                .setName("usuario")
                .setDescription("Usuário para verificar as estatísticas, opcional")
                .setRequired(false)
        ) as SlashCommandBuilder;

    /**
     * TODO:
     * - Criar embed para mostrar as estatísticas
     * - Adicionar mais pontos para usuários com cargos
     * - Adicionar mais pontos para usuários que mandam imagens/memes
     * - Adicionar mais pontos para usuários que mandam vídeos
     *
     * Executa o comando
     *
     * @param interaction - Interação do usuário
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const targetUser = interaction.options.getUser("usuario") || interaction.user;
        const guildId = interaction.guildId!;

        // Obter as estatísticas de interação do usuário
        const tracker = UserInteractionTracker.getInstance(interaction.client);
        const stats = await tracker.getUserStats(targetUser.id, guildId);

        // Obter o usuário do servidor
        const user = await interaction.guild?.members.fetch(targetUser.id);

        // Verificar se as estatísticas foram encontradas
        if (!stats) {
            await interaction.reply(`Nenhuma interação registrada para ${user}`);
            return;
        }

        // Cálculo de pontos
        const messagePts = Points.calcPointsMessages(stats.messageCount || 0);
        const reactionPts = Points.calcPointsReactions(stats.reactionCount || 0);
        const voicePts = Points.calcPointsVoice(stats.totalTimeInVoice || 0);
        const totalPts = messagePts + reactionPts + voicePts;
        const level = Points.calcLevel(totalPts);

        await interaction.reply({
            content:
                `Estatísticas de ${user}:\n\n` +
                `**Mensagens enviadas:** ${stats.messageCount || 0} (${messagePts} pts)\n` +
                `**Reações adicionadas:** ${stats.reactionCount || 0} (${reactionPts} pts)\n` +
                `**Tempo em voz:** ${tracker.formatVoiceTime(stats.totalTimeInVoice || 0)} (${voicePts} pts)\n\n` +
                `**Total de Pontos:** ${totalPts}\n` +
                `**Nível:** ${level}\n\n` +
                `Última interação: ${stats.lastInteraction.toLocaleString()}`,
        });

        Logs.GenericInfoLog({
            interaction: interaction,
            command: this.name,
            description: this.description,
            channel: interaction.channel as TextChannel,
        });
    }
}
