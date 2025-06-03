FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache tzdata
ENV TZ=Europe/Amsterdam

COPY package.json package-lock.json ./
RUN npm ci

# Copy all necessary files
COPY . .

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

EXPOSE 3000
CMD ["node", "server.js"]