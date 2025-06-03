FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache tzdata
ENV TZ=Europe/Amsterdam

COPY package.json package-lock.json ./
RUN npm ci

# Explicitly copy the app directory
COPY app/ ./app/
COPY public/ ./public/
COPY *.config.js ./
COPY *.json ./

# Debug verification
RUN echo "Files copied:" && ls -la
RUN echo "App directory:" && ls -la app/

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]