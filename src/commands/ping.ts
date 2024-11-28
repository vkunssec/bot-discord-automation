import {
    ApplicationCommandType,
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";

import { Logs } from "@/controller/Logs";
import { Command } from "@/core/interface/command";

/**
 * Criação básica de um Comando
 * A partir da interface Command, se define o Nome, Descrição e o Construtor do comando
 *
 * @class PingCommand
 * @implements Command
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
        await interaction.deferReply({ ephemeral: true });

        Logs.GenericInfoLog({
            interaction: interaction,
            command: this.name,
            description: this.description,
            channel: interaction.channel as TextChannel,
        });

        return await interaction.editReply(`Pong! (≧∇≦)ﾉ`);
    }
}
