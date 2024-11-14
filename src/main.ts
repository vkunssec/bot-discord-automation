import {
    ActivityType,
    ChatInputCommandInteraction,
    Client,
    REST as DiscordRestClient,
    Events,
    GatewayIntentBits,
    Guild,
    Routes,
} from "discord.js";

import { RegisterCommands } from "./commands/register_commands";
import { CLIENT_ID, DISCORD_ACCESS_TOKEN } from "./config";
import { InteractionHandler } from "./controller/Interaction";
import { DeployCommandsProps } from "./core/model/commandsProps";

/**
 * Classe DryscordApplication
 *
 * Documentação oficial do Discord.js - https://discord.js.org/docs/packages/discord.js/14.15.3
 */
export class DryscordApplication {
    private client: Client;
    private discordRestClient: DiscordRestClient;
    private interactionHandler: InteractionHandler;

    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
            shards: "auto",
            failIfNotExists: false,
        });
        this.discordRestClient = new DiscordRestClient().setToken(DISCORD_ACCESS_TOKEN);
        this.interactionHandler = new InteractionHandler();
    }

    /**
     * Método de inicio do serviço
     * Necessário TOKEN de acesso para validação
     */
    public start() {
        this.client
            .login(DISCORD_ACCESS_TOKEN)
            .then(() => {
                // Em caso de sucesso no login a partir do Token de acesso,
                // inicia os Event Listeners
                this.addClientEventHandlers();
            })
            .catch((err) => console.error("Error starting bot", err));
    }

    /**
     * Método de Deploy dos comandos no Discord
     *
     * @param guildId Identificador do Comando no chat do Discord
     */
    public registerSlashCommands({ guildId }: DeployCommandsProps) {
        const commands = this.interactionHandler.getSlashCommands();
        this.discordRestClient
            .put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
                body: commands,
            })
            .then((data: any) => {
                console.log(`Successfully registered ${data.length} global application (/) commands`);
            })
            .catch((err) => {
                console.error("Error registering application (/) commands", err);
            });
    }

    /**
     * Inicialização dos Event Listeners do Discord
     * - Levantar o serviço do bot
     * - Registro dos comandos
     * - Handler de erros
     * - Receber os eventos de input
     */
    public addClientEventHandlers() {
        // Registro dos comandos ao entrar em um servidor
        this.client.on(Events.GuildCreate, async (guild: Guild) => {
            this.registerSlashCommands({ guildId: guild.id });
        });

        // Receber os eventos de input
        this.client.on(Events.InteractionCreate, (interaction) => {
            this.interactionHandler.handleInteraction(interaction as ChatInputCommandInteraction);
        });

        // Comando por prefixo, para atualizar os comandos no servidor
        this.client.on(Events.MessageCreate, async (message) => {
            if (!message.content.startsWith("!")) return;

            // Remover o prefixo "!"
            const command = message.content.slice(1).toLowerCase();
            const register = new RegisterCommands();

            // Verificar se o comando existe
            if (register.name === command || register.aliases.includes(command)) {
                await register.execute(message);
            }
        });

        // Levantar o serviço do bot
        this.client.on(Events.ClientReady, () => {
            console.log("Dryscord Bot is Ready! 🤖");

            // https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
            this.client.user?.setPresence({
                activities: [
                    {
                        type: ActivityType.Custom,
                        name: "（づ￣3￣）づ╭❤️～",
                    },
                ],
            });

            // Registrar comandos para todos os servidores onde o bot já está presente
            // essa funcionalidade está desativada para evitar sobrecarga no Servidor do Discord
            // porque existe um limite atualização de comandos por dia
            this.client.guilds.cache.forEach((guild: Guild) => {
                // this.registerSlashCommands({ guildId: guild.id });
            });
        });

        // Handler de erros
        this.client.on(Events.Error, (err: Error) => {
            console.error("Client error", err);
        });
    }
}
