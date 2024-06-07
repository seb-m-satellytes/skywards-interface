# build stage
FROM node:lts as build-stage

WORKDIR /app
COPY . /app

RUN yarn

EXPOSE 3000

CMD ["yarn", "dev", "--port", "3000", "--host", "0.0.0.0"]