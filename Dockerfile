FROM node:20-alpine
RUN apk add --no-cache tzdata
RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/

ENV TZ Europe/Brussels
RUN cp /usr/share/zoneinfo/${TZ} /etc/localtime
RUN echo ${TZ} > /etc/timezone

# copy contents of directory ./server/* to /app/
WORKDIR /app
COPY . .

# install packages
RUN npm ci

# run
EXPOSE 3000

CMD [ "npm", "start" ]
