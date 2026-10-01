FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Use npm install instead of npm ci to read package.json directly
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]