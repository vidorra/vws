FROM node:20-slim AS builder
WORKDIR /app

# Install timezone data
RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*
ENV TZ=Europe/Amsterdam

COPY package.json package-lock.json ./

# Copy prisma folder before npm ci to ensure postinstall script works
COPY prisma ./prisma

RUN npm ci

# Copy all necessary files
COPY . .

# Generate Prisma client (already done in postinstall, but keeping for clarity)
RUN npx prisma generate

# Build with a dummy DATABASE_URL to satisfy Prisma during build time
# The actual DATABASE_URL will be provided at runtime
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"
RUN npm run build

# Production stage
FROM node:20-slim AS runner
WORKDIR /app

# Install dependencies for Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Chromium instead of Chrome (more reliable in containers)
RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

# Install timezone data
RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*
ENV TZ=Europe/Amsterdam
ENV NODE_ENV=production

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema and generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Copy package.json for reference
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Set the host to listen on all interfaces
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Debug: List files to ensure server.js exists
RUN ls -la /app/

CMD ["node", "server.js"]