FROM node:20.13.1-alpine
EXPOSE 5000
RUN mkdir -p /app/config /app/src
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
CMD ["npm", "run", "start"]