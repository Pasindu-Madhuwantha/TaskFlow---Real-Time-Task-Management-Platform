# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install production dependencies only
RUN npm ci --omit=dev
# Copy built application from builder
COPY --from=builder /app/dist ./dist
# Expose port
EXPOSE 8080
# Set environment to production
ENV NODE_ENV=production
# Start the application
CMD ["node", "dist/main.js"]
