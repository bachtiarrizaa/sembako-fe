# ─── Base Stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline

# ─── Development Stage ────────────────────────────────────────────────────────
FROM base AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ─── Builder Stage ────────────────────────────────────────────────────────────
FROM base AS builder
COPY . .
RUN npm run build

# ─── Staging Stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS staging
WORKDIR /app
ENV NODE_ENV=staging

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

# Only copy what's needed to run the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]