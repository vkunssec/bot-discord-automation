import {
    ChatInputCommandInteraction,
    Collection,
    EmbedBuilder,
    GuildMember,
    Message,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";

import { Command } from "./command";

/**
 * Remoção de Mensagens de um Canal
 */
export class RemoveMessagesCommand implements Command {
    name = "clear";
    description = "Remoção de Mensagens do Canal, informe a quantidade de mensagens que deseja remover.";

    // Configuração do Comando
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addNumberOption((option) =>
            option
                .setName("quantidade")
                .setDescription("Informe a quantidade de mensagens que deseja limpar do canal")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("autor")
                .setDescription("Informe o usuário o qual se deve limpar as mensagens")
                .setRequired(false)
        ) as SlashCommandBuilder;


    /**
     * Execução do Comando
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<any> {
        const { member, options, channel } = interaction;

        // Verificar se o usuário tem permissão para deletar mensagens
        if (!(member as GuildMember).permissions.has("ManageMessages")) {
            return await interaction.reply({
                content: "❌ Você não tem permissão para usar este comando!",
                ephemeral: true,
            });
        }

        // Verificar se o canal é de texto
        if (!channel?.isTextBased()) {
            return await interaction.reply({
                content: "❌ Não é possível utilizar esse comando nesse canal!",
                ephemeral: true,
            });
        }

        // Obter a quantidade de mensagens e o autor
        const qty = options.getNumber("quantidade") || 1;
        // Obter o autor
        const autor = options.getMember("autor");

        // Verificar se a quantidade de mensagens é maior que 100
        if (qty > 100) {
            return await interaction.reply({
                content: "❌ Você só pode deletar até 100 mensagens por vez!",
                ephemeral: true,
            });
        }

        // Verificar se a quantidade de mensagens é maior que 0
        if (qty < 1) {
            return await interaction.reply({
                content: "❌ A quantidade deve ser maior que 0!",
                ephemeral: true,
            });
        }

        // Buscar e filtrar mensagens
        const messages = await channel.messages.fetch({ limit: qty });
        const filteredMessages = messages.filter((m) => {
            if (autor && autor instanceof GuildMember) {
                return m.author.id === autor.user.id;
            }
            return true;
        });

        // Deletar as mensagens
        if (channel instanceof TextChannel) {
            try {
                await channel.bulkDelete(filteredMessages);
                await writeLogs(interaction, filteredMessages, channel);

                const embed = new EmbedBuilder()
                    .setColor("#00ff00")
                    .setTitle("🗑️ Mensagens Deletadas")
                    .addFields(
                        { name: "Quantidade", value: `${filteredMessages.size}`, inline: true },
                        { name: "Canal", value: `${channel.name}`, inline: true },
                        { name: "Autor do comando", value: `${interaction.user.tag}`, inline: true }
                    )
                    .setTimestamp();

                return await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            } catch {
                return await interaction.reply({
                    content: "❌ Erro ao deletar as mensagens. Verifique se elas têm menos de 14 dias.",
                    ephemeral: true,
                });
            }
        }

        return await interaction.reply({
            content: "❌ Não é possível deletar mensagens neste tipo de canal!",
            ephemeral: true,
        });
    }
}

async function writeLogs(
    interaction: ChatInputCommandInteraction,
    filteredMessages: Collection<string, Message<boolean>>,
    channel: TextChannel
) {
    try {
        // Criar log antes de deletar
        const logChannel = interaction.guild?.channels.cache.find((channel) => channel.name === "logs") as TextChannel;

        // Mapear as mensagens deletadas
        const deletedMessagesLog = filteredMessages.map((msg) => ({
            autor: msg.author.tag,
            conteudo: msg.content,
            data: msg.createdAt,
        }));

        // Enviar o log
        if (logChannel) {
            await logChannel.send({
                content: `**Log de Mensagens Deletadas**
Deletado por: ${interaction.user.tag}
Quantidade: ${filteredMessages.size}
Canal: ${channel.name}
Data: ${new Date().toLocaleString("pt-BR")}
                \`\`\`json\n${JSON.stringify(deletedMessagesLog, null, 2)}\`\`\``,
            });
        }
    } catch (error) {
        console.error("Erro ao criar log de mensagens deletadas:", error);
    }
}
