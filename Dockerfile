FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun ci
COPY . .
RUN --mount=type=secret,id=server_env \
    cp /run/secrets/server_env .env && \
    bun run build

FROM oven/bun:latest AS runner
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json package.json
EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "./build"]
