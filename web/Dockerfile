FROM node:16-alpine3.11  as builder

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile
# NextJs 12 workaround
RUN rm -rf node_modules/@next/swc-linux-x64-gnu

RUN yarn global add pm2 
# pm2-deploy

COPY . .

COPY .env ./

RUN yarn build

ENV NODE_ENV production

EXPOSE 3000

USER node

CMD ["pm2-runtime", "yarn", "--interpreter", "ash", "--", "start"]
