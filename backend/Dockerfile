FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --dev
COPY . . 
EXPOSE 3000

RUN npx prisma generate