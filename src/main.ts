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

import { RegisterCommands } from "@/commands";
import { CLIENT_ID, DISCORD_ACCESS_TOKEN } from "@/config";
import { InteractionHandler } from "@/controller/Interaction";
import { DeployCommandsProps } from "@/core/model/commandsProps";

/**
 * Classe BotApplication
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
 *
 * @version 1.0.0
 * @since 2024-11-22
 */
export class BotApplication {
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

        this.interactionHandler = new InteractionHandler(this.client);
    }

    /**
     * Método de inicio do serviço
     * Necessário TOKEN de acesso para validação
     */
    public async start() {
        try {
            await this.client.login(DISCORD_ACCESS_TOKEN);
            // Em caso de sucesso no login a partir do Token de acesso,
            // inicia os Event Listeners
            this.addClientEventHandlers();
        } catch (error) {
            console.error("Error starting bot", error);
        }
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
            console.log("Bot is Ready! 🤖");

            // https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
            this.client.user?.setPresence({
                activities: [
                    {
                        type: ActivityType.Custom,
                        name: "（づ￣3￣）づ╭❤️～",
                    },
                ],
            });

            // Iniciar o serviço de verificação de aniversários
            // Executa todos os dias as 00:00
            this.interactionHandler.handleBirthday();

            // Configurar o rastreamento de interações do usuário
            this.interactionHandler.handleUserInteraction();

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

        // Adicionar o novo evento de boas-vindas
        this.client.on(Events.GuildMemberAdd, async () => {
            this.interactionHandler.handleMemberAdd();
        });
    }

    /**
     * Verifica se o bot está pronto para uso
     *
     * @returns {boolean} - Retorna true se o bot está pronto para uso
     */
    public isReady(): boolean {
        return this.client?.isReady() ?? false;
    }

    /**
     * Retorna o tempo de atividade do bot em formato legível
     *
     * @returns {string} - Retorna o tempo de atividade do bot em formato legível
     */
    public getUptime(): string {
        const uptime = this.client?.uptime ?? 0;
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    }

    /**
     * Retorna o número de servidores em que o bot está presente
     *
     * @returns {number} - Retorna o número de servidores em que o bot está presente
     */
    public getGuildsCount(): number {
        return this.client?.guilds.cache.size ?? 0;
    }

    /**
     * Retorna a latência do WebSocket do bot
     *
     * @returns {number} - Retorna a latência do WebSocket do bot
     */
    public getPing(): number {
        return this.client?.ws.ping ?? 0;
    }
}
