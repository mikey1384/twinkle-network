FROM node:7.7.1
ENV HOME=/var/www/twinkle
RUN mkdir -p $HOME
WORKDIR $HOME

RUN npm install -g nodemon forever

COPY ./package.json .
RUN npm install

ADD ./ $HOME

EXPOSE 3500
EXPOSE 3000

VOLUME ["$HOME/node_modules"]

CMD ["npm", "run", "devapi"]
CMD ["npm", "run", "dev"]
