import { ApplicationCommandType, CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { Command } from "../core/interface/command";

/**
 * Criação básica de um Comando
 * A partir da interface Command, se define o Nome, Descrição e o Construtor do comando
 */
export class PingCommand implements Command {
    name = "ping";
    description = "Retries with Pongo!";
    type = ApplicationCommandType.ChatInput;
    slashCommandConfig = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

    /**
     * Resposta de Retorno do Comando
     * Pode ser customizado, desde envios simples de texto, a imagens, arquivos e estruturas interativas
     *
     * Alguns link de referência
     * - https://discord.js.org/docs/packages/discord.js/14.15.3/ChatInputCommandInteraction:Class#reply
     * - https://discord.js.org/docs/packages/discord.js/14.15.3/InteractionReplyOptions:Interface
     */
    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any> {
        return interaction.reply(`Pong! (≧∇≦)ﾉ`);
    }
}
