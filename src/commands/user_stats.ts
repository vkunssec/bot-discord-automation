import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UserInteractionTracker } from "../automation/user_interactions";
import { Command } from "../core/interface/command";

/**
 * Comando para mostrar as estatísticas de interação do usuário
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

        await interaction.reply({
            content:
                `Estatísticas de ${user}:\n\n` +
                `**Mensagens enviadas:** ${stats.messageCount || 0}\n` +
                `**Reações adicionadas:** ${stats.reactionCount || 0}\n` +
                `**Tempo em voz:** ${tracker.formatVoiceTime(stats.totalTimeInVoice || 0)}\n\n` +
                `Última interação: ${stats.lastInteraction.toLocaleString()}`,
        });
    }
}
