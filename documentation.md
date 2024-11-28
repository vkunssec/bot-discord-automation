# Documentação do Bot Discord

## 🤖 Visão Geral

Este é um bot Discord desenvolvido em TypeScript que oferece diversos comandos e automações para gerenciar e melhorar a experiência em servidores Discord.

## 📋 Comandos Disponíveis

### /ping

-   **Descrição:** Comando básico que responde com "Pong!"
-   **Uso:** `/ping`

### /embed

-   **Descrição:** Cria mensagens incorporadas (embeds) personalizadas
-   **Opções:**
    -   `title` (obrigatório): Título principal
    -   `description` (obrigatório): Descrição principal
    -   `subtitle`: Subtítulo opcional
    -   `footer`: Texto do rodapé
    -   `banner`: Imagem do banner
    -   `main_image`: Imagem principal
    -   `secondary_image`: Imagem secundária
    -   `fields_json`: Campos adicionais em formato JSON, exemplo: `[{"name": "Campo 1", "value": "Valor 1"}, {"name": "Campo 2", "value": "Valor 2"}]`
    -   `color`: Cor da barra lateral, existem algumas opções: `Red`, `Green`, `Blue` ou um código hexadecimal, exemplo: `0x000000`, veja mais sobre as cores utilizadas pelo Discord em [Discord.js](https://discord.js.org/docs/packages/discord.js/14.16.3/Colors:Variable) ou [colors](./colors.md)
-   **Permissão:** Requer permissão "Gerenciar Mensagens"
-   **Uso:** `/embed title: "Título" description: "Descrição" subtitle: "Subtítulo" footer: "Rodapé" main_image: "img/Imagem_Principal.gif" secondary_image: "img/Imagem_Secundária.png" fields_json: "[{"name": "Campo 1", "value": "Valor 1"}, {"name": "Campo 2", "value": "Valor 2"}]" color: "Red"`

### /clear

-   **Descrição:** Remove mensagens do canal
-   **Opções:**
    -   `quantidade`: Número de mensagens (máx. 100)
    -   `autor`: Filtrar mensagens por usuário específico
-   **Permissão:** Requer permissão "Gerenciar Mensagens"
-   **Uso:** `/clear quantidade: 100 autor: "Usuário"`

### /register_birthdate

-   **Descrição:** Registra a data de aniversário do usuário
-   **Opções:**
    -   `dia`: Dia do aniversário (1-31)
    -   `mês`: Mês do aniversário (1-12)
-   **Uso:** `/register_birthdate dia: 12 mês: 6`

### /stats

-   **Descrição:** Mostra estatísticas de interação do usuário
-   **Opções:**
    -   `usuario`: Usuário opcional para verificar estatísticas
-   **Métricas:**
    -   Mensagens enviadas
    -   Reações adicionadas
    -   Tempo em canais de voz
    -   Nível baseado em pontos
-   **Uso:** `/stats usuario: "Usuário"`

## 🤖 Automações

### Sistema de Boas-vindas

-   Envia mensagem personalizada quando novos membros entram
-   Atribui cargo padrão automaticamente
-   Mostra contagem de membros
-   Exibe avatar do novo membro

### Sistema de Aniversários

-   Verifica diariamente aniversariantes
-   Envia mensagens de parabéns automaticamente
-   Utiliza banco de dados para armazenar datas

### Rastreamento de Interações

Monitora:

-   Mensagens enviadas
-   Reações adicionadas
-   Tempo em canais de voz
-   Calcula pontuação e nível do usuário
-   Armazena estatísticas no banco de dados

## 📝 Sistema de Logs

### Logs de Comandos

Registra execução de comandos:

-   Nome do comando
-   Usuário executor
-   Canal utilizado
-   Timestamp

### Logs de Mensagens Deletadas

Registra mensagens removidas:

-   Conteúdo da mensagem
-   Autor original
-   Quem deletou
-   Timestamp

## 🛠️ Estrutura do Projeto

### Core

-   [Command](./src/core/interface/command.ts): Interface base para todos os comandos
-   [InteractionHandler](./src/core/interaction/interaction_handler.ts): Gerenciador central de comandos
-   [Database](./src/core/database/mongodb.ts): Sistema de banco de dados para armazenamento persistente

### Automações

-   [WelcomeMessage](./src/automations/welcome_message.ts): Sistema de boas-vindas
-   [BirthdayAutomation](./src/automations/birthday.ts): Sistema de aniversários
-   [UserInteractionTracker](./src/automations/user_interaction_tracker.ts): Sistema de rastreamento

### Controladores

-   [Logs](./src/controllers/logs.ts): Sistema de registro de atividades
-   [Interaction](./src/controllers/interaction.ts): Gerenciamento de interações do bot

## 🔒 Permissões

-   Sistema hierárquico de permissões
-   Verificações de segurança em comandos administrativos
-   Proteção contra uso indevido de comandos

## 📊 Sistema de Pontuação

### Cálculo de Pontos

#### Mensagens

-   2 pontos base por mensagem
-   Bônus de 10% a cada 100 mensagens
-   Exemplo: 250 mensagens = 550 pontos (500 base + 10% + 10% parcial)

#### Anexos

-   1.5 pontos base por anexo
-   Bônus de 5% a cada 50 anexos
-   Exemplo: 250 anexos = 393.75 pontos (375 base + 5% de bônus)

#### Reações

-   1 ponto base por reação
-   Bônus de 5% a cada 50 reações
-   Exemplo: 120 reações = 132 pontos (120 base + 10% de bônus)

#### Tempo em Canais de Voz

-   3 pontos por minuto
-   Bônus de 15% por hora completa
-   Exemplo: 90 minutos = 310.5 pontos (270 base + 15% de bônus)

### Sistema de Níveis

-   Utiliza raiz quadrada para criar uma progressão mais equilibrada
-   Fórmula: nível = raiz quadrada(pontos totais / 100) + 1
-   Progressão de níveis:
    -   Nível 1: 0-99 pontos
    -   Nível 2: 100-399 pontos
    -   Nível 3: 400-899 pontos
    -   E assim por diante...

### Objetivos do Sistema

-   Incentivar engajamento através de reações
-   Promover participação ativa com mensagens
-   Estimular presença em canais de voz
-   Oferecer progressão mais rápida inicialmente
-   Tornar níveis superiores mais desafiadores

## 🔄 Registro de Comandos

-   Sistema automático de registro de comandos
-   Atualização dinâmica de comandos slash
-   Requer permissão de administrador

## Rotas da API

-   [API](./src/core/routes/index.ts)

### Healthcheck

-   `GET /`
-   Retorna status 200 e mensagem do bot e banco de dados conectado
```json
{
    "status": "ok",
    "timestamp": "2024-11-28T17:50:31.104Z",
    "services": {
        "database": {
            "status": "healthy",
            "latency": "2ms"
        },
            "bot": {
            "status": "healthy",
            "uptime": "0d 0h 0m 24s",
            "guilds": 1,
            "ping": 157
        }
    }
}
```
