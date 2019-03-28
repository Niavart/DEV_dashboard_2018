# Get image from docker hub
FROM node:8.12-stretch

RUN apt-get update && apt-get -y upgrade

#RUN sudo apt-get install nodejs

RUN mkdir -p /app

WORKDIR /app

RUN mkdir -p app/src/

COPY package.json /app/package.json

ADD package-lock.json /app/package-lock.json

COPY app.js /app/app.js

COPY src/ /app/src/

EXPOSE 8080

RUN npm install

CMD [ "node", "app.js" ]
