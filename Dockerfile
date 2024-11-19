FROM --platform=linux/amd64 node:20-alpine

ENV TZ="Asia/Shanghai"
ENV NODE_ENV="production"
ENV FILE_PATH="/data/donation.json"

WORKDIR /app

COPY . .

RUN npm install --registry https://registry.npmmirror.com/

EXPOSE 3000

CMD [ "npm", "run", "start" ]