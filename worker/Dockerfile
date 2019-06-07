FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
#this is specified in the package.json file (start)

#Prod docker file does not allow us to run any tests. No code present