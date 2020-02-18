FROM node:11-alpine

ENV PORT=3000
ENV TEST="HELLO FROM PRODUCTION"

WORKDIR /opt/app
COPY ./server/package.json ./server/package-lock.json ./

RUN yarn install --no-optional && yarn cache clean

COPY ./server/ ./

RUN yarn build

WORKDIR /opt/app/frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./

RUN yarn install --no-optional && yarn cache clean

COPY ./frontend/ ./

RUN yarn build

ENV NODE_ENV=production

USER node

EXPOSE $PORT

CMD [ "node", "dist/server.js" ]
