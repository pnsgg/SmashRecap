FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun ci
COPY . .
RUN bun run build

FROM oven/bun:latest AS runner
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "run", "./build"]
