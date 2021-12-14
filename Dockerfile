FROM node:16.13.1-alpine

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn --frozen-lockfile

COPY . .

ENTRYPOINT ["yarn", "start"]
