FROM node:22.18.0
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
EXPOSE 5000
CMD ["npm","start"]