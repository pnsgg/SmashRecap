FROM oven/bun:debian AS base

# Install Chrome Dependencies
RUN apt update && apt install -y \
    libnss3 \
    libdbus-1-3 \
    libatk1.0-0 \
    libgbm-dev \
    libasound2 \
    libxrandr2 \
    libxkbcommon-dev \
    libxfixes3 \
    libxcomposite1 \
    libxdamage1 \
    libpango-1.0-0 \
    libcairo2 \
    libcups2 \
    libatk-bridge2.0-0 && \
    rm -rf /var/lib/apt/lists/*

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
ENV REMOTION_BUNDLE_LOCATION=/app/remotion-bundle
RUN --mount=type=secret,id=startgg_secrets,dst=.env bun run build

# Bundle remotion project
FROM base AS remotion-bundler
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/package.json package.json
COPY . .
RUN bun run remotion:bundle

# Run the app
FROM base AS runner
WORKDIR /app
COPY --from=builder --chown=bun:bun /app/build build/
COPY --from=builder --chown=bun:bun /app/node_modules node_modules/
COPY --from=remotion-bundler --chown=bun:bun /app/remotion-bundle /app/remotion-bundle
RUN bunx remotion browser ensure
VOLUME [ "/app/out" ]
EXPOSE 3000
ENV NODE_ENV=production

CMD ["bun", "./build"]
