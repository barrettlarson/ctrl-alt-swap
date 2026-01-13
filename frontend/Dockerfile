FROM node:22.18.0
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
EXPOSE 5173
CMD ["npm","run","dev"]