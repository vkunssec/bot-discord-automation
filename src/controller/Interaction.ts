import { ChatInputCommandInteraction } from "discord.js";
import { Command, PingCommand } from "../commands";

/**
 * Handler para controlar as Interações
 */
export class InteractionHandler {
    private commands: Command[];

    constructor() {
        /**
         * Todo novo Comando DEVE ser adicionado no construtor
         */
        this.commands = [
            new PingCommand(),
            // new NewCommand()...
        ];
    }

    getSlashCommands() {
        return this.commands.map((command: Command) => command.slashCommandConfig.toJSON());
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
    async handleInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
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
}
