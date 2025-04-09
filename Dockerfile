#Step 1
FROM node:18

WORKDIR /app

#Step 2
COPY package*.json ./

#Step 3
RUN npm install

#Step 4 install nodemon globally (if not in package.json)
RUN npm install -g nodemon

#Step 4
COPY . .

EXPOSE 3001

#Step 5
CMD [ "npx", "nodemon", "server.js" ]