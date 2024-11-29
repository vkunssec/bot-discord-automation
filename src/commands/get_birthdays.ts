import {
    ApplicationCommandType,
    CacheType,
    ChatInputCommandInteraction,
    Colors,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";

import { getBirthdaysByMonth } from "@/core/database/birthdate/get_by_month";
import { Command } from "@/core/interface/command";

/**
 * Comando para retornar os aniversariantes de um mês específico
 *
 * @class GetBirthdaysCommand
 * @implements Command
 */
export class GetBirthdaysCommand implements Command {
    name = "get_birthdays";
    description = "Retorna os aniversários registrados, por mês";
    type = ApplicationCommandType.ChatInput;
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addNumberOption((option) =>
            option
                .setName("mês")
                .setDescription("Número do mês para consulta, exemplo: 1 para Janeiro, etc")
                .setRequired(false)
        ) as SlashCommandBuilder;

    /**
     * Execução do comando
     *
     * @param interaction
     * @returns
     */
    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });

        // Obtém o mês selecionado pelo usuário ou o mês atual
        const month = interaction.options.getNumber("mês") || new Date().getMonth() + 1;
        // Formata o mês em português brasileiro
        const formattedMonth = new Date(Date.UTC(new Date().getUTCFullYear(), month, 1)).toLocaleDateString("pt-BR", {
            month: "long",
        });

        // Busca os aniversariantes do mês
        const birthdays = await getBirthdaysByMonth(month);

        if (birthdays.length === 0) {
            await interaction.editReply({
                content: `Nenhum aniversariante encontrado para o mês de ${formattedMonth} /(ㄒoㄒ)/~~`,
            });
            return;
        }

        // Busca os usuários dos aniversariantes
        for (const birthday of birthdays) {
            birthday.user = await interaction.client.users.fetch(birthday.userId);
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(`🎈🎊🎁 Aniversariantes do mês - ${formattedMonth} 🎈🎊🎁`)
            .setDescription(
                birthdays.map((birthday) => `- ${birthday.user} - (${birthday.day}/${birthday.month})`).join("\n")
            );

        await interaction.editReply({ embeds: [embed] });
    }
}
