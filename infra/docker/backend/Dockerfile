FROM node:20-alpine

WORKDIR /app

COPY ../../apps/backend/package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli
COPY ../../apps/backend .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/src/main"]