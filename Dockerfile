FROM node:20

# RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /src

COPY package*.json ./


COPY prisma ./prisma

RUN npm install

COPY . .


EXPOSE 5001

CMD ["sh", "-c", "npx prisma db pull && npx prisma generate && npm start"]
