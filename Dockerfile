FROM node:14

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL="file:../transactions.db"
ENV NODE_ENV="production"
ENV PORT=80

EXPOSE 80

CMD [ "npm", "run", "start" ]