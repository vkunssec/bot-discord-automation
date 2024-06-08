# Bot Dryscord

## Estrutura do Projeto
Projeto baseado em NodeJS para criação de um Bot para Discord. Conforme a necessidade podem ser acrescentadas novas pastas e arquivos de configuração.

```js
// resumo básico da estrutura do projeto
    // pasta `src` para centralização do projeto
├── src
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

```sh
STAGE=development
DISCORD_ACCESS_TOKEN=<discord_token>
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
- dotenv
- discord.js

Demais dependências para desenvolvimento
- tsx
- typescript
