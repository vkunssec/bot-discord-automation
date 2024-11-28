import { ChatInputCommandInteraction, Client } from "discord.js";

import { BirthdayAutomation } from "@/automation/get_birthdays";
import { UserInteractionTracker } from "@/automation/user_interactions";
import { WelcomeMessage } from "@/automation/welcome_message";
import {
    EmbeddingCommand,
    GetBirthdaysCommand,
    PingCommand,
    RemoveMessagesCommand,
    UserStatsCommand,
} from "@/commands";
import { RegisterBirthdateCommand } from "@/commands/register_birthdate";
import { Command } from "@/core/interface/command";

/**
 * Handler para controlar as Interações
 *
 * @param client - Client do Discord
 */
export class InteractionHandler {
    private commands: Command[];
    private client: Client;

    constructor(client: Client) {
        /**
         * Todo novo Comando DEVE ser adicionado no construtor
         */
        this.commands = [
            new EmbeddingCommand(),
            new PingCommand(),
            new RemoveMessagesCommand(),
            new RegisterBirthdateCommand(),
            new GetBirthdaysCommand(),
            new UserStatsCommand(),
        ];

        this.client = client;
    }

    /**
     * Retorna os comandos em formato JSON
     *
     * @returns
     */
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

        try {
            await matchedCommand.execute(interaction);
            console.log(`Successfully executed command [/${interaction.commandName}]`, {
                guild: {
                    id: interaction.guildId,
                    name: interaction.guild?.name,
                },
                user: { name: interaction.user.globalName },
            });
        } catch (error) {
            console.error(error);
            console.log(`Error executing command [/${interaction.commandName}]: ${error}`, {
                guild: {
                    id: interaction.guildId,
                    name: interaction.guild?.name,
                },
                user: { name: interaction.user.globalName },
            });
        }
    }

    /**
     * Evento de boas-vindas
     */
    public handleMemberAdd() {
        new WelcomeMessage(this.client).setup();
    }

    /**
     * Evento de aniversário
     */
    public handleBirthday() {
        new BirthdayAutomation(this.client).setup();
    }

    /**
     * Configura o rastreamento de interações do usuário
     */
    public handleUserInteraction() {
        new UserInteractionTracker(this.client).setup();
    }
}
