import { ChatInputCommandInteraction, SlashCommandBuilder, TextBasedChannelFields } from "discord.js";

/**
 * Interface de criação de um comando qualquer para o servidor do Discord
 */
export interface Command {
    // Nome do comando a ser chamado
    name: string;
    // Breve descrição da ação do comando, opcional
    description?: string;
    // Construtor do comando
    slashCommandConfig: SlashCommandBuilder;

    // Controlador da Execução do comando
    execute(interaction: ChatInputCommandInteraction | TextBasedChannelFields): Promise<void>;
}
