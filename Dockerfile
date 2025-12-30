FROM node:22-bookworm-slim

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

COPY . .
RUN npm ci

# Install Chrome
RUN npx remotion browser ensure

RUN --mount=type=secret,id=server_env \
    cp /run/secrets/server_env .env && \
    npm run build
RUN node deploy.mjs
VOLUME [ "/out" ]
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "./build"]
