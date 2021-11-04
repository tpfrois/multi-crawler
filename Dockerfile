FROM node:14 as base

WORKDIR /home/node/multi-crawler

COPY package.json ./

RUN yarn install || npm install

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN yarn build || npm run build

