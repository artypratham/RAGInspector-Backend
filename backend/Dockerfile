FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production
FROM base AS production
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json ./
COPY prisma ./prisma

USER appuser

EXPOSE 5000

CMD ["node", "dist/index.js"]
