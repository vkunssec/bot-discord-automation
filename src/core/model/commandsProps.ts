import { ChatInputCommandInteraction, Message, TextChannel } from "discord.js";

/**
 * Propriedades para o comando de deploy de comandos
 */
export type DeployCommandsProps = {
    guildId: string;
};

/**
 * Propriedades para o log de comandos
 */
export type LogData = {
    interaction: ChatInputCommandInteraction | Message;
    command: string | string[];
    description?: string;
    channel: TextChannel;
};
