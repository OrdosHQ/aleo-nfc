FROM --platform=linux/amd64 node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY scripts/. ./scripts

RUN npm i

COPY . .

RUN chmod +x ./scripts/*.sh

ENTRYPOINT [ "./scripts/prod.sh" ]
