# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install Python and build dependencies including PostgreSQL
RUN apk add --no-cache \
    python3 \
    python3-dev \
    py3-setuptools \
    make \
    g++ \
    postgresql-dev

# Copy package files
COPY package.json package-lock.json .npmrc ./

# Install dependencies
RUN npm ci --no-progress

# Development image, copy all files and run next dev
FROM base AS development
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED 1

# Expose port
EXPOSE 3000

# Start Next.js in development mode with hot reloading
CMD ["npm", "run", "dev"]

# Production image, copy all the files and run next build
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Build application
RUN npm run build

# Production image, copy all the files and run next start
FROM base AS production
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port
EXPOSE 3000

# Start Next.js in production mode
CMD ["node", "server.js"]
