import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

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

    // Autocompletar campo
    autoComplete?(interaction: AutocompleteInteraction<CacheType>): Promise<any>;

    // Controlador da Execução do comando
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
