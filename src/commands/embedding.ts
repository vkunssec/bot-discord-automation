import {
    ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";

import { Logs } from "@/controller/Logs";
import { Command } from "@/core/interface/command";

/**
 * Comando para criar um incorporador de mensagens personalizado
 *
 * @class EmbeddingCommand
 * @implements Command
 */
export class EmbeddingCommand implements Command {
    name = "embed";
    description = "Criar um incorporador de mensagens personalizado";

    // Configuração do Comando
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
            option.setName("title").setDescription("Título principal do incorporador").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("description").setDescription("Descrição principal").setRequired(true)
        )
        .addChannelOption((option) =>
            option.setName("channel").setDescription("Canal onde o incorporador será enviado").setRequired(false)
        )
        .addStringOption((option) =>
            option.setName("subtitle").setDescription("Subtítulo do incorporador").setRequired(false)
        )
        .addStringOption((option) => option.setName("footer").setDescription("Texto do rodapé").setRequired(false))
        .addAttachmentOption((option) =>
            option.setName("banner").setDescription("Imagem do banner superior").setRequired(false)
        )
        .addAttachmentOption((option) =>
            option.setName("main_image").setDescription("Imagem principal do corpo").setRequired(false)
        )
        .addAttachmentOption((option) =>
            option.setName("secondary_image").setDescription("Imagem secundária").setRequired(false)
        )
        .addStringOption((option) =>
            option.setName("fields_json").setDescription("Campos adicionais em formato JSON").setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("color")
                .setDescription("Cor da barra lateral (ex: #FF0000, Blue, Red, Green)")
                .setRequired(false)
        ) as SlashCommandBuilder;

    /**
     * Execução do Comando
     *
     * @param interaction - Interação do usuário
     * @returns - Retorno da interação
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ ephemeral: true, fetchReply: true });

        const { member, options, channel } = interaction;

        // Verificar se o usuário tem permissão para deletar mensagens
        if (!(member as GuildMember).permissions.has("ManageMessages")) {
            await interaction.editReply({
                content: "❌ Você não tem permissão para usar este comando!",
            });
            return;
        }

        const title = options.getString("title");
        const subtitle = options.getString("subtitle");
        const channelOption = (options.getChannel("channel") || channel) as TextChannel;
        const description = options.getString("description");
        const footer = options.getString("footer");
        const banner = options.getAttachment("banner");
        const mainImage = options.getAttachment("main_image");
        const secondaryImage = options.getAttachment("secondary_image");
        const color = options.getString("color") || "Blue";
        const fieldsJson = options.getString("fields_json");

        // Formata a descrição
        const formattedDescription = description?.split("\\n").join("\n") || "";

        // Criação do Embed
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(formattedDescription)
            .setColor(color as ColorResolvable);

        // Configuração do Subtítulo
        if (subtitle) {
            embed.setAuthor({ name: subtitle });
        }

        // Configuração da Imagem Principal
        if (mainImage) {
            embed.setImage(mainImage.url);
        }

        // Configuração da Imagem do Banner
        if (banner) {
            embed
                .addFields({
                    name: "\u200B",
                    value: "\u200B",
                })
                .setThumbnail(banner.url);
        }

        // Configuração da Imagem Secundária
        if (secondaryImage) {
            embed.setImage(secondaryImage.url);
        }

        // Configuração do Rodapé
        if (footer) {
            embed.setFooter({
                text: footer,
                iconURL: interaction.guild?.iconURL() || undefined,
            });
        }

        // Configuração dos Campos JSON
        if (fieldsJson) {
            try {
                // Converte o JSON para um array de campos
                const fields = JSON.parse(fieldsJson);

                // Adiciona os campos ao embed
                if (Array.isArray(fields)) {
                    fields.forEach((field) => {
                        if (field.title && field.content) {
                            embed.addFields({
                                name: field.title,
                                value: field.content,
                                inline: field.inline ?? false,
                            });
                        }
                    });
                }
            } catch (error) {
                console.error("Erro ao processar JSON dos campos:", error);
            }
        }

        Logs.GenericInfoLog({
            interaction: interaction,
            command: this.name,
            description: this.description,
            channel: channelOption,
        });

        try {
            // Envia o embed para o canal especificado
            await channelOption.send({ embeds: [embed] });

            // Confirma o envio para o usuário
            await interaction.editReply({
                content: `✅ Embed enviado com sucesso para o canal ${channelOption}!`,
            });
        } catch (error) {
            console.error("Erro ao enviar embed:", error);
            await interaction.editReply({
                content: "❌ Não foi possível enviar o embed para o canal especificado. Verifique as permissões.",
            });
        }
    }
}
