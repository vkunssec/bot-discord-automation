import { Client, TextChannel } from "discord.js";
import cron from "node-cron";
import { CHANNEL_BIRTHDAY } from "../config";
import { getBirthdays } from "../core/database/birthdate/get";

/**
 * Classe BirthdayAutomation
 *
 * @param client - Cliente do Discord
 */
export class BirthdayAutomation {
    private client: Client;
    private readonly BIRTHDAY_CHANNEL_ID = CHANNEL_BIRTHDAY;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Inicia a verificação dos aniversários
     */
    public startBirthdayCheck() {
        // Executa todos os dias as 00:00
        cron.schedule("0 0 * * *", async () => {
            await this.checkBirthdays();
        });
    }

    /**
     * Verifica os aniversários
     */
    private async checkBirthdays() {
        try {
            const birthdays = await getBirthdays();

            if (birthdays.length === 0) return;

            const channel = (await this.client.channels.fetch(this.BIRTHDAY_CHANNEL_ID)) as TextChannel;

            const promises = [];

            for (const birthday of birthdays) {
                const user = await this.client.users.fetch(birthday.user.id);

                const message = [
                    `🎉 **Feliz Aniversário** ${user}! 🎂`,
                    "Que seu dia seja repleto de alegria e realizações!",
                    "🎈🎊🎁",
                ].join("\n");

                promises.push(channel.send(message));
            }

            await Promise.allSettled(promises);
        } catch (error) {
            console.error("Erro ao verificar aniversários:", error);
        }
    }
}
