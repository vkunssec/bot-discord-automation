import { Message, REST, Routes, TextChannel } from "discord.js";

import { CLIENT_ID, DISCORD_ACCESS_TOKEN } from "@/config";
import { InteractionHandler } from "@/controller/Interaction";
import { Logs } from "@/controller/Logs";
import { Command } from "@/core/interface/command";

/**
 * Comando para registrar os comandos do bot
 *
 * @class RegisterCommands
 * @implements Command
 */
export class RegisterCommands implements Command {
    name = "register";
    description = "Comando para atualizar a lista de comandos registrados no Bot";
    aliases = ["register", "update"];

    /**
     * Execução do Comando
     */
    async execute(context: Message): Promise<any> {
        // Verifica se o usuário tem permissão de administrador
        if (!context.member?.permissions.has("Administrator")) {
            return await context.reply("Você não tem permissão para usar este comando!");
        }

        // Obtém os comandos registrados
        const commands = new InteractionHandler(context.client).getSlashCommands();

        try {
            console.log(`Registering commands for guild: ${context.guild!.id}`);
            // Lógica para registrar os comandos
            const rest = new REST({ version: "10" }).setToken(DISCORD_ACCESS_TOKEN);
            const data: any = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, context.guild!.id), {
                body: commands,
            });

            console.log(`Successfully registered ${data.length} global application (/) commands`);

            // Responde ao usuário
            await context.reply("Comandos registrados com sucesso!");

            // Registra o log
            Logs.GenericInfoLog({
                interaction: context,
                command: this.aliases,
                description: this.description,
                channel: context.channel as TextChannel,
            });

            console.log(`Successfully executed command [${this.name}]`, {
                guild: {
                    id: context.guildId,
                    name: context.guild?.name,
                },
                user: { name: context.author.globalName },
            });
        } catch (error) {
            console.error("Erro ao registrar comandos:", error);
            await context.reply("Ocorreu um erro ao registrar os comandos!");
        }
    }
}
