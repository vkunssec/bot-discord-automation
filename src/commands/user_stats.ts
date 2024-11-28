import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";

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
     * Executa o comando
     *
     * @param interaction - Interação do usuário
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        const targetUser = interaction.options.getUser("usuario") || interaction.user;
        const guildId = interaction.guildId!;

        // Obter as estatísticas de interação do usuário
        const tracker = UserInteractionTracker.getInstance(interaction.client);
        const stats = await tracker.getUserStats(targetUser.id, guildId);

        // Obter o usuário do servidor
        const user = await interaction.guild?.members.fetch(targetUser.id);

        // Verificar se as estatísticas foram encontradas
        if (!stats) {
            await interaction.editReply(`Nenhuma interação registrada para ${user}`);
            return;
        }

        // Cálculo de pontos
        const messagePts = Points.calcPointsMessages(stats.messageCount || 0);
        const reactionPts = Points.calcPointsReactions(stats.reactionCount || 0);
        const voicePts = Points.calcPointsVoice(stats.totalTimeInVoice || 0);
        const attachmentPts = Points.calcPointsAttachment(stats.attachmentCount || 0);
        const totalPts = messagePts + reactionPts + voicePts + attachmentPts;
        const level = Points.calcLevel(totalPts);

        const embed = new EmbedBuilder({
            color: Colors.NotQuiteBlack,
            title: `📊 Estatísticas de ${user?.displayName}`,
            thumbnail: {
                url: targetUser.displayAvatarURL({ size: 128 }),
            },
            fields: [
                {
                    name: "📝 Mensagens",
                    value: `${stats.messageCount || 0} (${messagePts} pts)`,
                    inline: true,
                },
                {
                    name: "😄 Reações",
                    value: `${stats.reactionCount || 0} (${reactionPts} pts)`,
                    inline: true,
                },
                {
                    name: "🎤 Tempo em Voz",
                    value: `${tracker.formatVoiceTime(stats.totalTimeInVoice || 0)} (${voicePts} pts)`,
                    inline: true,
                },
                {
                    name: "📁 Anexos",
                    value: `${stats.attachmentCount || 0} (${attachmentPts} pts)`,
                    inline: true,
                },
                {
                    name: "✨ Progresso",
                    value: `**Nível:** ${level}\n**Total de Pontos:** ${totalPts}`,
                    inline: false,
                },
            ],
            footer: {
                text: `Última interação: ${stats.lastInteraction.toLocaleString()}`,
            },
        });

        await interaction.editReply({ embeds: [embed] });

        Logs.GenericInfoLog({
            interaction: interaction,
            command: this.name,
            description: this.description,
            channel: interaction.channel as TextChannel,
        });
    }
}
