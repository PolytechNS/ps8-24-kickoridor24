FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY front ./front
COPY back ./back

EXPOSE 8000

CMD [ "npm", "start" ]
