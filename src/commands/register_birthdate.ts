import {
    ApplicationCommandType,
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";

import { Logs } from "@/controller/Logs";
import { insertBirthdate } from "@/core/database/birthdate/insert";
import { Command } from "@/core/interface/command";
import { UserBirthday } from "@/core/interface/user_birthday";

/**
 * Comando para registrar a data de aniversário do usuário
 *
 * @class RegisterBirthdateCommand
 * @implements Command
 */
export class RegisterBirthdateCommand implements Command {
    name = "register_birthdate";
    description = "Registra a data de aniversário do usuário!";
    type = ApplicationCommandType.ChatInput;
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addNumberOption((option) =>
            option.setName("dia").setDescription("Informe o dia do aniversário").setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName("mês")
                .setDescription(
                    "Informe o mês do aniversário. Apenas valores numéricos. Ex: Janeiro = 1, Fevereiro = 2, etc."
                )
                .setRequired(true)
        ) as SlashCommandBuilder;

    /**
     * Registra a data de aniversário do usuário no banco de dados MongoDB
     *
     * @param interaction - Interação do usuário
     * @returns - Retorno da interação
     */
    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        const day = interaction.options.getNumber("dia");
        const month = interaction.options.getNumber("mês");

        if (day! > 31 || day! < 1 || month! > 12 || month! < 1) {
            await interaction.editReply({ content: "Por favor, informe um dia e mês válidos!" });
            return;
        }

        const data: UserBirthday = {
            userId: interaction.user.id,
            guildId: interaction.guildId!,
            day: day!,
            month: month!,
        };

        try {
            // Registra a data de aniversário do usuário no banco de dados MongoDB
            await insertBirthdate(data);

            Logs.GenericInfoLog({
                interaction: interaction,
                command: this.name,
                description: this.description,
                channel: interaction.channel as TextChannel,
            });

            await interaction.editReply({
                content: "Data de aniversário registrada com sucesso! 🎂",
            });
        } catch (error) {
            console.error("Erro ao registrar aniversário:", error);
            await interaction.editReply({
                content: "Desculpe, ocorreu um erro ao registrar seu aniversário. Tente novamente mais tarde.",
            });
        }
    }
}
