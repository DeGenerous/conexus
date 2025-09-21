# Builder Stage
FROM node:23-alpine AS builder

# Install dependencies required for `node-gyp`
RUN apk add --no-cache python3 make g++

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json ./

# Copy the pnpm-lock.yaml if you are using pnpm
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# copy public files
COPY public ./app/public

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN pnpm run build

ENV HOST=0.0.0.0

# Start the Next.js application
# CMD ["npm", "start"]
CMD ["node", "./dist/server/entry.mjs"]
