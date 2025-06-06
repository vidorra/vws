FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache tzdata
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
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache tzdata
ENV TZ=Europe/Amsterdam
ENV NODE_ENV=production

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