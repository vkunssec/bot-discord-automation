import {
    AutocompleteInteraction,
    CacheType,
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
} from "discord.js";

type CommandInteraction = ChatInputCommandInteraction | Message;

/**
 * Interface de criação de um comando para o servidor do Discord
 */
export interface Command {
    // Propriedades básicas obrigatórias
    // Nome do comando a ser chamado
    readonly name: string;
    // Breve descrição da ação do comando, opcional
    readonly description: string;

    // Configurações do comando
    readonly slashCommandConfig?: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    // Alias do comando
    readonly aliases?: readonly string[];
    // Prefixo do comando
    readonly prefix?: string;

    // Métodos do comando
    autoComplete?(interaction: AutocompleteInteraction<CacheType>): Promise<void>;
    // Execução do comando
    execute(interaction: CommandInteraction, args?: string[]): Promise<void>;
}
