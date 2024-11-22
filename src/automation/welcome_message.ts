import { EmbedBuilder, GuildMember } from "discord.js";

import { CHANNEL_WELCOME, ROLE_DEFAULT } from "../config";

export const welcomeMessage = async (member: GuildMember) => {
    // Canal padrão para mensagens de boas-vindas
    const welcomeChannel = member.guild.channels.cache.get(CHANNEL_WELCOME);

    // ID do cargo que será atribuído automaticamente
    const roleId = ROLE_DEFAULT;

    try {
        // Adiciona o cargo ao novo membro
        const role = member.guild.roles.cache.get(roleId);
        if (role) {
            await member.roles.add(role);
            console.log(`Cargo **${role.name}** atribuído ao membro **${member.user.tag}**`);
        }

        // Verifica se o canal de boas-vindas existe
        if (!welcomeChannel) return;

        // Embed de boas-vindas
        const welcomeEmbed = new EmbedBuilder({
            color: 0x0099ff,
            title: "🎉 Bem-vindo(a)!",
            description: `Olá ${member}! Seja bem-vindo(a) ao servidor **${member.guild.name}**!\nVocê recebeu automaticamente o cargo **${role?.name}**!`,
            thumbnail: {
                url: member.user.displayAvatarURL({ size: 256 }),
            },
            fields: [
                {
                    name: "📜 Membros no servidor",
                    value: `Você é o membro #${member.guild.memberCount}!`,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: "🤖 Dryscord Bot",
            },
        });

        // Envia a mensagem de boas-vindas
        if (welcomeChannel.isTextBased()) {
            await welcomeChannel.send({ embeds: [welcomeEmbed] });
        }
    } catch (error) {
        console.error("Erro ao processar novo membro:", error);
    }
};
