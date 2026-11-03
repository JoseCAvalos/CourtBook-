FROM node:26-bookworm-slim

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --config prisma7.config.ts

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]