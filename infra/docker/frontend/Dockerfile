FROM node:20-alpine AS builder

WORKDIR /app

COPY ../../apps/frontend/package*.json ./
COPY ../../apps/frontend .

RUN yarn install
RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["yarn", "start"]