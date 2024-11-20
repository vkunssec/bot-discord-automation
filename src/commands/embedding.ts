import {
    ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    GuildMember,
    InteractionResponse,
    SlashCommandBuilder,
} from "discord.js";
import { Command } from "../core/interface/command";

/**
 * Criação de um Incorporador de Mensagens
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
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean>> {
        const { member, options, channel } = interaction;

        // Verificar se o usuário tem permissão para deletar mensagens
        if (!(member as GuildMember).permissions.has("ManageMessages")) {
            return await interaction.reply({
                content: "❌ Você não tem permissão para usar este comando!",
                ephemeral: true,
            });
        }

        const title = options.getString("title");
        const subtitle = options.getString("subtitle");
        const description = options.getString("description");
        const footer = options.getString("footer");
        const banner = options.getAttachment("banner");
        const mainImage = options.getAttachment("main_image");
        const secondaryImage = options.getAttachment("secondary_image");
        const color = options.getString("color") || "Blue";
        const fieldsJson = options.getString("fields_json");

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

        // Configuração da Imagem do Banner
        if (banner) {
            embed.setImage(banner.url);
        }

        // Configuração da Imagem Principal
        if (mainImage) {
            embed
                .addFields({
                    name: "\u200B",
                    value: "\u200B",
                })
                .setThumbnail(mainImage.url);
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
                const fields = JSON.parse(fieldsJson);
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

        return await interaction.reply({ embeds: [embed] });
    }
}