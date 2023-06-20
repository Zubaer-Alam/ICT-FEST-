FROM node:18.16.0-alpine

WORKDIR /app

COPY app/package*.json .

RUN npm install

COPY app .

EXPOSE 2051

CMD  npm start

