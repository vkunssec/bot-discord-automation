import { ChatInputCommandInteraction, Collection, EmbedBuilder, Message, TextChannel } from "discord.js";

import { CHANNEL_LOGS } from "@/config";
import { LogData } from "@/core/model/commandsProps";

export class Logs {
    /**
     * Cria um log de mensagens deletadas
     *
     * @param interaction - Interação do usuário
     * @param filteredMessages - Mensagens filtradas
     * @param channel - Canal onde a mensagem foi deletada
     */
    static async DeletedMessages(
        interaction: ChatInputCommandInteraction,
        filteredMessages: Collection<string, Message<boolean>>,
        channel: TextChannel
    ) {
        try {
            // Verifica se o canal é o de logs, para não criar log de log
            if (channel.id === CHANNEL_LOGS) return;

            const logChannel = interaction.guild?.channels.cache.find(
                (channel) => channel.id === CHANNEL_LOGS
            ) as TextChannel;
            if (!logChannel) return;

            // Mapear as mensagens deletadas com limite de caracteres
            const deletedMessagesLog = filteredMessages.map((msg) => ({
                autor_tag: msg.author.tag,
                autor_username: msg.author.username,
                conteudo: msg.content.substring(0, 1000), // Limita o conteúdo a 1000 caracteres
                embeds: msg.embeds,
                data_da_mensagem: new Date(msg.createdAt).toLocaleString("pt-BR"),
                data_de_exclusao: new Date().toLocaleString("pt-BR"),
                deletado_por: interaction.user.tag,
            }));

            const logsPromise: Promise<Message<boolean>>[] = [];
            // Envia os logs das mensagens deletadas
            for (const message of deletedMessagesLog) {
                const log = logChannel.send({
                    content: `\`\`\`json\n${JSON.stringify(message, null, 2)}\`\`\``,
                });

                logsPromise.push(log);
            }

            // Aguardar todas as promises
            await Promise.allSettled(logsPromise);
        } catch (error) {
            console.error("Erro ao criar log de mensagens deletadas:", error);
            // Não propaga o erro para não impedir a deleção das mensagens
        }
    }

    /**
     * Cria um log de informações genéricas
     *
     * @param {LogData} data - Dados do log
     */
    static async GenericInfoLog(data: LogData) {
        try {
            // Verifica se o canal é o de logs, para não criar log de log
            if (data.channel.id === CHANNEL_LOGS) return;

            const logChannel = data.interaction.guild?.channels.cache.find(
                (channel) => channel.id === CHANNEL_LOGS
            ) as TextChannel;
            if (!logChannel) return;

            // Cria o embed do log
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🖥️ Comando executado")
                .addFields([
                    { name: "Comando", value: Array.isArray(data.command) ? data.command.join(", ") : data.command },
                    { name: "Descrição", value: data.description || "Sem descrição" },
                    {
                        name: "Usuário",
                        value:
                            data.interaction instanceof Message
                                ? (data.interaction as Message).author.tag
                                : (data.interaction as ChatInputCommandInteraction).user.tag,
                    },
                    { name: "Canal", value: data.channel.name },
                ])
                .setTimestamp();

            await logChannel.send({
                embeds: [embed],
            });
        } catch (error) {
            console.error("Erro ao criar log de comando executado:", error);
        }
    }
}
