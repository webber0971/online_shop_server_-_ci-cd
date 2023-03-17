# Base image
FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/webserver

# set root dir
WORKDIR /usr/src/webserver

# Install app dependencies
# COPY package.json /usr/src/webserver/
COPY . .

RUN npm install

# Bundle app source
COPY . /usr/src/webserver

#open container port 8000
EXPOSE 8812

# CMD npm start
CMD [ "npm","start" ]