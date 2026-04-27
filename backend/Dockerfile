FROM node:20-alpine

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

#Install Server Dependencies
RUN npm ci

COPY . .

EXPOSE 5000
CMD ["node", "src/app.js"]