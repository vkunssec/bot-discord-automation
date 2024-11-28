import { Client, TextChannel } from "discord.js";
import cron from "node-cron";

import { CHANNEL_BIRTHDAY } from "@/config";
import { getBirthdays } from "@/core/database/birthdate/get";
import { UserBirthday } from "@/core/interface/user_birthday";

/**
 * Classe responsável pela automação de aniversários
 *
 * @param client - Client do Discord
 * @param channelId - ID do canal do Discord
 */
export class BirthdayAutomation {
    private readonly CRON_EXPRESSION = "0 0 * * *";

    constructor(
        private readonly client: Client,
        private readonly channelId: string = CHANNEL_BIRTHDAY
    ) {}

    /**
     * Inicializa a automação de aniversários
     */
    public setup(): void {
        cron.schedule(this.CRON_EXPRESSION, async () => {
            await this.execute();
        });
    }

    /**
     * Executa a verificação de aniversários
     */
    private async execute(): Promise<void> {
        try {
            const birthdays = await getBirthdays();
            if (!birthdays.length) return;

            const channel = await this.getChannel();
            await this.sendBirthdayMessages(channel, birthdays as UserBirthday[]);
        } catch (error) {
            console.error("[BirthdayAutomation] Erro ao verificar aniversários:", error);
        }
    }

    /**
     * Obtém o canal de aniversários
     */
    private async getChannel(): Promise<TextChannel> {
        return (await this.client.channels.fetch(this.channelId)) as TextChannel;
    }

    /**
     * Envia as mensagens de aniversário
     */
    private async sendBirthdayMessages(channel: TextChannel, birthdays: UserBirthday[]): Promise<void> {
        const promises = [];
        for (const birthday of birthdays) {
            try {
                const user = await this.client.users.fetch(birthday.userId);
                const message = channel.send(
                    [
                        `🎉 **Feliz Aniversário** ${user}! 🎂`,
                        "Que seu dia seja repleto de alegria e realizações!",
                        "🎈🎊🎁",
                    ].join("\n")
                );
                promises.push(message);
            } catch (error) {
                console.log("Erro ao buscar o usuário pelo id:", error);
            }
        }
        await Promise.allSettled(promises);
    }
}
