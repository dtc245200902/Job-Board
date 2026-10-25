# Stage 1: Build & Production Image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies (utilizing Docker layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Ensure uploads directory exists and set proper permissions
RUN mkdir -p /usr/src/app/public/uploads && \
    chown -R node:node /usr/src/app

# Hardening: Run as non-root user
USER node

# Expose HTTP port
EXPOSE 3000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

# Start Application
CMD ["node", "server.js"]
