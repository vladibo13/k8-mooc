FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY app.js ./

ENV PORT=3002
EXPOSE 3002

CMD ["npm", "start"]