import {
    ActivityType,
    ChatInputCommandInteraction,
    Client,
    REST as DiscordRestClient,
    Events,
    GatewayIntentBits,
    Guild,
    Partials,
    Routes,
} from "discord.js";

import { BirthdayAutomation } from "./automation/get_birthdays";
import { UserInteractionTracker } from "./automation/user_interactions";
import { RegisterCommands } from "./commands/register_commands";
import { CLIENT_ID, DISCORD_ACCESS_TOKEN } from "./config";
import { InteractionHandler } from "./controller/Interaction";
import { MongoDB } from "./core/database/mongodb";
import { DeployCommandsProps } from "./core/model/commandsProps";

/**
 * Classe DryscordApplication
 *
 * Documentação oficial do Discord.js - https://discord.js.org/docs/packages/discord.js/14.15.3
 *
 * Documentação oficial do Node-Cron - https://www.npmjs.com/package/node-cron
 *
 * Documentação oficial do MongoDB - https://www.mongodb.com/docs/drivers/node/current/
 *
 * Documentação oficial do dotenv - https://www.npmjs.com/package/dotenv
 *
 * @param {Client} client - Cliente do Discord
 * @param {DiscordRestClient} discordRestClient - Cliente REST do Discord
 * @param {InteractionHandler} interactionHandler - Manipulador de interações
 * @param {BirthdayAutomation} birthdayAutomation - Serviço de verificação de aniversários
 *
 * @version 1.0.0
 * @since 2024-11-22
 */
export class DryscordApplication {
    /**
     * Cliente do Discord
     */
    private client: Client;

    /**
     * Cliente REST do Discord
     */
    private discordRestClient: DiscordRestClient;

    /**
     * Manipulador de interações
     */
    private interactionHandler: InteractionHandler;

    /**
     * Serviço de verificação de aniversários
     */
    private birthdayAutomation: BirthdayAutomation;

    /**
     * Serviço de rastreamento de interações
     */
    private userInteractionTracker: UserInteractionTracker;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildVoiceStates,
            ],
            shards: "auto",
            failIfNotExists: false,
            partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.User, Partials.GuildMember],
        });
        this.discordRestClient = new DiscordRestClient().setToken(DISCORD_ACCESS_TOKEN);
        this.interactionHandler = new InteractionHandler();
        this.birthdayAutomation = new BirthdayAutomation(this.client);
        this.userInteractionTracker = UserInteractionTracker.getInstance();
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
        this.client.on(Events.ClientReady, async () => {
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

            /**
             * Conectar ao banco de dados MongoDB
             * Necessário para que alguns comandos funcionem
             * Abrindo a conexão quando a aplicação é levantada para
             * Aproveitar uma mesma conexão em toda aplicação
             * Diminuindo a quantidade de conexões ao banco de dados
             */
            await MongoDB.getInstance().connect();

            // Iniciar o serviço de verificação de aniversários
            // Executa todos os dias as 00:00
            this.birthdayAutomation.startBirthdayCheck();

            // Configurar o rastreamento de interações do usuário
            this.userInteractionTracker.setupTracking(this.client);

            // Registrar comandos para todos os servidores onde o bot já está presente
            // essa funcionalidade está desativada para evitar sobrecarga no Servidor do Discord
            // porque existe um limite atualização de comandos por dia
            this.client.guilds.cache.forEach((guild: Guild) => {
                this.registerSlashCommands({ guildId: guild.id });
            });
        });

        // Handler de erros
        this.client.on(Events.Error, (err: Error) => {
            console.error("Client error", err);
        });

        // Adicionar o novo evento de boas-vindas
        this.client.on(Events.GuildMemberAdd, async (member) => {
            this.interactionHandler.handleMemberAdd(member);
        });
    }
}
