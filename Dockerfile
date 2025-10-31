# Builder Stage
FROM node:23-alpine AS builder

# Install dependencies required for `node-gyp` and pnpm
RUN apk add --no-cache python3 make g++ && \
    npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production Stage
FROM node:23-alpine AS runner

# Install pnpm in runner stage
RUN npm install -g pnpm

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321

# Expose port
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4321/ || exit 1

# Start the application
CMD ["node", "./dist/server/entry.mjs"]