import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { EmbeddingCommand, PingCommand, RemoveMessagesCommand } from "../commands";
import { CHANNEL_WELCOME, ROLE_DEFAULT } from "../config";
import { Command } from "../core/interface/command";

/**
 * Handler para controlar as Interações
 */
export class InteractionHandler {
    private commands: Command[];

    constructor() {
        /**
         * Todo novo Comando DEVE ser adicionado no construtor
         */
        this.commands = [new EmbeddingCommand(), new PingCommand(), new RemoveMessagesCommand()];
    }

    public getSlashCommands() {
        return this.commands.map((command: Command) => command.slashCommandConfig?.toJSON());
    }

    /**
     * Execução dos Comandos
     *
     * Exemplo:
     * Ao executar o comando de `/ping` no chat
     *
     * ```
     * >>> Successfully executed command [/ping] {
     * >>>      guild: { id: '1029619927512006676', name: 'Dryscord' },
     * >>>      user: { name: 'vkunssec' }
     * >>> }
     * ```
     */
    public async handleInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
        const commandName = interaction.commandName;

        // Checa se o comando existe no registro de comandos
        const matchedCommand = this.commands.find((command) => command.name === commandName);
        if (!matchedCommand) {
            return Promise.reject("Command not matched");
        }

        matchedCommand
            .execute(interaction)
            .then(() => {
                console.log(`Successfully executed command [/${interaction.commandName}]`, {
                    guild: {
                        id: interaction.guildId,
                        name: interaction.guild?.name,
                    },
                    user: { name: interaction.user.globalName },
                });
            })
            .catch((err) =>
                console.log(`Error executing command [/${interaction.commandName}]: ${err}`, {
                    guild: {
                        id: interaction.guildId,
                        name: interaction.guild?.name,
                    },
                    user: { name: interaction.user.globalName },
                })
            );
    }

    /**
     * Evento de boas-vindas
     *
     * @param member - Membro que foi adicionado ao servidor
     */
    public async handleMemberAdd(member: GuildMember) {
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
    }
}
