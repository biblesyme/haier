FROM node:6.9.1
MAINTAINER aaronwang@rancher.com

RUN mkdir /web
WORKDIR /web

COPY package.json ./
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm" ,"run", "dev"]
