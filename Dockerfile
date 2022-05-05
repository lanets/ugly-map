FROM node:10

WORKDIR /usr/src/app

COPY ./app/package.json .
COPY ./app/package-lock.json .
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
