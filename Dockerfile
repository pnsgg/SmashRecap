FROM oven/bun:debian AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun ci

# Build the app wth secrets
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules /app/node_modules
RUN bun run build


# Run the app
FROM base AS runner
WORKDIR /app
COPY --from=builder --chown=bun:bun /app/build build/
COPY --from=builder --chown=bun:bun /app/node_modules node_modules/
EXPOSE 3000
ENV NODE_ENV=production

CMD ["bun", "./build"]
