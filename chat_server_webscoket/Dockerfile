# Base image
FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY . .

RUN npm install 
# Bundle app source
COPY . /usr/src/app

CMD [ "npm", "start" ]