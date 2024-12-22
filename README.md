# Bot

[![Docs](https://github.com/vkunssec/Bot-Dryscord/actions/workflows/docs.yml/badge.svg?branch=main)](https://github.com/vkunssec/Bot-Dryscord/actions/workflows/docs.yml)
[![Deploy GCP](https://github.com/vkunssec/Bot-Dryscord/actions/workflows/deploy-gcp.yml/badge.svg)](https://github.com/vkunssec/Bot-Dryscord/actions/workflows/deploy-gcp.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Estrutura do Projeto

Projeto baseado em NodeJS para criação de um Bot para Discord. Conforme a necessidade podem ser acrescentadas novas pastas e arquivos de configuração.

```
// resumo básico da estrutura do projeto
    // pasta `src` para centralização do projeto
├── src
        // pasta das funcionalidades automáticas
    ├── automation

        // pasta dos comandos para o bot
    ├── commands

        // pasta de configurações gerais
        // variáveis de ambiente, chaves de conexões, etc
    ├── config

        // pasta para as classes de execução dos handler do projeto
    ├── controller
            // arquivo handler padrão para as interações do usuário no chat
        └── Interaction.ts

        // pasta das funcionalidades centrais, ex.:
        // modelos de dados, classes de conexões com banco de dados, etc
    ├── core
        // pasta modelos de dados
        └── model

        // pasta de interfaces
        └── interface

        // arquivo para classe principal do projeto
        // Dryscord Application - controle das inicializações, event listeners, routes, etc
    ├── main.ts
        // arquivo de inicialização do projeto, servindo atualmente o bot
        // podendo futuramente servir rotas http ou demais funcionalidades
    └── server.ts

    // arquivo de regras de arquivos ignorados
├── .dockerignore
├── .gitignore

    // arquivo de variáveis de ambiente
├── .env

    // arquivo de docker
├── docker-compose.yml
├── Dockerfile

    // arquivo de configuração da aplicação nodejs
├── package.json

    // arquivo de configuração do interpretador typescript
└── tsconfig.json
```

## Environment

Variáveis de Ambiente do projeto, ex.: [.env.example](.env.example)

```
# Ambiente
STAGE=<development | staging | production>

# Porta
PORT=8080

# Discord
DISCORD_ACCESS_TOKEN=<discord_token>
CLIENT_ID=<application_id>

# Canais
CHANNEL_LOGS=<channel_logs_id>
CHANNEL_WELCOME=<channel_welcome_id>
CHANNEL_BIRTHDAY=<channel_birthday_id>

# Cargos
ROLE_DEFAULT=<role_default_id>

# MongoDB
MONGODB_URI=<mongodb_uri>
MONGODB_DATABASE=<mongodb_database>
MONGODB_COLLECTION_BIRTHDATE=<collection_birthdate>
MONGODB_COLLECTION_USER_INTERACTIONS=<collection_user_interactions>
```

## Inicialização

### Via Docker

```sh
docker compose up
```

### Via CLI

Rodar em ambiente de Desenvolvimento

```sh
npm run dev
```

Rodar a Construção do projeto

```sh
npm run build
```

Rodar a Inicialização

```sh
npm run start
```

## Dependências

Principais dependências do projeto em produção

-   [dotenv](https://www.npmjs.com/package/dotenv)
-   [discord.js](https://www.npmjs.com/package/discord.js)
-   [mongodb](https://www.npmjs.com/package/mongodb)
-   [node-cron](https://www.npmjs.com/package/node-cron)
-   [express](https://www.npmjs.com/package/express)
-   [cors](https://www.npmjs.com/package/cors)
-   [helmet](https://www.npmjs.com/package/helmet)
-   [http-status-codes](https://www.npmjs.com/package/http-status-codes)

Demais dependências para desenvolvimento

-   [tsx](https://www.npmjs.com/package/tsx)
-   [tsc-alias](https://www.npmjs.com/package/tsc-alias)
-   [typescript](https://www.npmjs.com/package/typescript)
-   [prettier](https://www.npmjs.com/package/prettier)
-   [prettier-plugin-organize-imports](https://www.npmjs.com/package/prettier-plugin-organize-imports)
-   [husky](https://www.npmjs.com/package/husky)
-   [typedoc](https://www.npmjs.com/package/typedoc)
-   [eslint](https://www.npmjs.com/package/eslint)
-   [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)
-   [commitlint](https://www.npmjs.com/package/commitlint)
-   [cz-conventional-changelog](https://www.npmjs.com/package/cz-conventional-changelog)
-   [@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional)
-   [@commitlint/format](https://www.npmjs.com/package/@commitlint/format)

## Documentação

Para mais informações sobre o projeto, acesse a [Documentação](./documentation.md)
