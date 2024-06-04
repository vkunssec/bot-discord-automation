import {
    ChatInputCommandInteraction,
    Client,
    Events,
    GatewayIntentBits,
    REST as DiscordRestClient,
    Routes,
    ActivityType,
} from "discord.js";

import { InteractionHandler } from "./controller/Interaction";
import { DeployCommandsProps } from "./core/model/commandsProps";
import { DISCORD_ACCESS_TOKEN } from "./config";

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
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            shards: "auto",
            failIfNotExists: false,
        });
        this.discordRestClient = new DiscordRestClient().setToken(
            DISCORD_ACCESS_TOKEN
        );
        this.interactionHandler = new InteractionHandler();
    }

    /**
     * Método de inicio do serviço
     * Necessário TOKEN de acesso para validação
     */
    start() {
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
    registerSlashCommands({ guildId }: DeployCommandsProps) {
        const commands = this.interactionHandler.getSlashCommands();
        this.discordRestClient
            .put(Routes.applicationGuildCommands(DISCORD_ACCESS_TOKEN, guildId), {
                body: commands,
            })
            .then((data: any) => {
                console.log(
                    `Successfully registered ${data.length} global application (/) commands`
                );
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
    addClientEventHandlers() {
        // Registro dos comandos
        this.client.on(Events.GuildCreate, async (guild) => {
            this.registerSlashCommands({ guildId: guild.id });
        });

        // Receber os eventos de input
        this.client.on(Events.InteractionCreate, (interaction) => {
            this.interactionHandler.handleInteraction(
                interaction as ChatInputCommandInteraction
            );
        });

        // Levantar o serviço do bot
        this.client.on(Events.ClientReady, () => {
            console.log("Dryscord Bot is Ready! 🤖");

            // https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
            this.client.user?.setPresence({ activities: [{ type: ActivityType.Custom, name: `（づ￣3￣）づ╭❤️～ APULULULU`}]})
        });

        // Handler de erros
        this.client.on(Events.Error, (err: Error) => {
            console.error("Client error", err);
        });
    }
}
