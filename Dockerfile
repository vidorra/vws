FROM node:20-alpine

WORKDIR /app

# Set timezone  
RUN apk add --no-cache tzdata
ENV TZ=Europe/Amsterdam
RUN cp /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# DEBUG: Show exactly what got copied
RUN echo "=== ROOT DIRECTORY CONTENTS ==="
RUN ls -la

RUN echo "=== APP DIRECTORY CHECK ==="
RUN ls -la app/ || echo "❌ APP DIRECTORY NOT FOUND!"

RUN echo "=== PAGES DIRECTORY CHECK ==="  
RUN ls -la pages/ || echo "✅ PAGES DIRECTORY NOT FOUND (GOOD)"

RUN echo "=== ALL SUBDIRECTORIES ==="
RUN find . -maxdepth 2 -type d

# Try to build anyway to see the exact error
RUN npm run build

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production
CMD ["npm", "start"]
