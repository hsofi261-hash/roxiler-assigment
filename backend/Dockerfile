FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Use npm ci for clean, reproducible installs from package-lock.json
RUN npm ci

COPY . .

# Build TypeScript source code into /dist
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]