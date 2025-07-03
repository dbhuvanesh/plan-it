# Use official Node.js LTS image as build environment
FROM node:lts AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve with a simple static server
FROM node:lts
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 6969
CMD ["serve", "-s", "dist", "-l", "6969"]
