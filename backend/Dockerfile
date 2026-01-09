FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

RUN npm install typescript

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]