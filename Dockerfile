FROM node:18-alpine as build

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install && \
    npm cache clean --force

COPY ./src ./src

RUN npm run build

RUN npm prune --production

FROM node:18-alpine as deploy

WORKDIR /app

COPY --from=build /app/node_modules /node_modules
COPY --from=build /app/build /app/build

USER node

CMD [ "node", "build/server.js" ]
