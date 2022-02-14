# Install dependencies only when needed
FROM node:10.16.3 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app
COPY package.json ./
RUN npm i

# Rebuild the source code only when needed
FROM node:10.16.3 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

ENV NODE_ENV production

CMD [ "node", "server" ]
