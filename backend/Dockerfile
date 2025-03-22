FROM node:latest

WORKDIR /app

COPY package.json package-lock.json bun.lock ./

RUN npm install

COPY . /app/

EXPOSE 3000

CMD ["node","server.js"]