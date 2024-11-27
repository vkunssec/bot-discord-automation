/**
 * **Explicação do sistema de pontuação:**
 *
 * **Mensagens:**
 *  - 2 pontos base por mensagem
 *  - Bônus de 10% a cada 100 mensagens
 *  - Exemplo: 250 mensagens = 550 pontos (500 base + 10% + 10% parcial)
 *
 * **Reações:**
 *  - 1 ponto base por reação
 *  - Bônus de 5% a cada 50 reações
 *  - Exemplo: 120 reações = 132 pontos (120 base + 10% de bônus)
 *
 * **Tempo em Voz:**
 *  - 3 pontos por minuto
 *  - Bônus de 15% por hora completa
 *  - Exemplo: 90 minutos = 310.5 pontos (270 base + 15% de bônus)
 *
 * **Anexos:**
 *  - 1.5 pontos base por anexo
 *  - Bônus de 5% a cada 100 anexos
 *  - Exemplo: 250 anexos = 393.75 pontos (375 base + 5% de bônus)
 *
 * **Sistema de Níveis:**
 *  - Usa raiz quadrada para criar uma progressão mais equilibrada
 *  - Nível 1: 0-99 pontos
 *  - Nível 2: 100-399 pontos
 *  - Nível 3: 400-899 pontos
 *  - E assim por diante...
 *
 * Este sistema incentiva:
 *  - Engajamento com outros (reações)
 *  - Participação constante (mensagens)
 *  - Presença em canais de voz
 *
 * Progressão mais rápida no início e mais desafiadora em níveis superiores
 */
export class Points {
    private static readonly BASE_REACTION_PTS = 1;
    private static readonly BASE_ATTACHMENT_PTS = 1.5;
    private static readonly BASE_MESSAGE_PTS = 2;
    private static readonly BASE_VOICE_PTS = 3;

    private static readonly REACTION_BONUS_PER_100 = 0.05;
    private static readonly ATTACHMENT_BONUS_PER_100 = 0.05;
    private static readonly MESSAGE_BONUS_PER_100 = 0.1;
    private static readonly VOICE_BONUS_PER_HOUR = 0.15;

    /**
     * Cada mensagem vale 2 pontos base
     *
     * A cada 100 mensagens, ganha 10% de bônus
     *
     * @param quantity - Quantidade de mensagens
     * @returns Pontos de mensagens
     */
    public static calcPointsMessages(quantity: number): number {
        const base = Points.BASE_MESSAGE_PTS;
        const bonus = Math.floor(quantity / 100) * Points.MESSAGE_BONUS_PER_100;
        return Math.floor(quantity * base * (1 + bonus));
    }

    /**
     * Cada reação vale 1 ponto base
     *
     * A cada 50 reações, ganha 5% de bônus
     *
     * @param quantity - Quantidade de reações
     * @returns Pontos de reações
     */
    public static calcPointsReactions(quantity: number): number {
        const base = Points.BASE_REACTION_PTS;
        const bonus = Math.floor(quantity / 50) * Points.REACTION_BONUS_PER_100;
        return Math.floor(quantity * base * (1 + bonus));
    }

    /**
     * Cada minuto em voz vale 3 pontos
     *
     * A cada hora completa, ganha 15% de bônus
     *
     * @param minutes - Quantidade de minutos em voz
     * @returns Pontos de voz
     */
    public static calcPointsVoice(minutes: number): number {
        const base = Points.BASE_VOICE_PTS;
        const hours = Math.floor(minutes / 60);
        const bonus = hours * Points.VOICE_BONUS_PER_HOUR;
        return Math.floor(minutes * base * (1 + bonus));
    }

    /**
     * Cada anexo vale 1.5 pontos base
     *
     * A cada 100 anexos, ganha 5% de bônus
     *
     * @param quantity - Quantidade de anexos
     * @returns Pontos de anexos
     */
    public static calcPointsAttachment(quantity: number): number {
        const base = Points.BASE_ATTACHMENT_PTS;
        const bonus = Math.floor(quantity / 100) * Points.ATTACHMENT_BONUS_PER_100;
        return Math.floor(quantity * base * (1 + bonus));
    }

    /**
     * Cada nível requer progressivamente mais pontos
     *
     * Fórmula: nível = raiz quadrada(pontos totais / 100)
     *
     * @param pointTotal - Pontos totais
     * @returns Nível do usuário
     */
    public static calcLevel(pointTotal: number): number {
        return Math.floor(Math.sqrt(pointTotal / 100)) + 1;
    }
}
