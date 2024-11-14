import {
    AutocompleteInteraction,
    CacheType,
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
} from "discord.js";

/**
 * Interface de criação de um comando qualquer para o servidor do Discord
 */
export interface Command {
    // Nome do comando a ser chamado
    name: string;
    // Breve descrição da ação do comando, opcional
    description?: string;
    // Construtor do comando
    slashCommandConfig?: SlashCommandBuilder;

    // Alias do comando
    aliases?: string[];
    // Prefixo do comando
    prefix?: string;

    // Autocompletar campo
    autoComplete?(interaction: AutocompleteInteraction<CacheType>): Promise<any>;

    // Controlador da Execução do comando
    execute(interaction?: ChatInputCommandInteraction | Message, args?: string[]): Promise<any>;
}
