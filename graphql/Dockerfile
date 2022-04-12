FROM node:14-alpine

COPY . /myapp

WORKDIR /myapp

RUN npm install

EXPOSE 4000

CMD [ "node", "index.js" ]