const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const {
  getTransaction,
  createTransaction,
  getTransactions,
  updateTransaction,
} = require("./handlers");

const host = process.env.host || "localhost";
const port = process.env.port || 3000;

const prisma = new PrismaClient();
const app = express();

const main = async () => {
  // Load environment variables
  dotenv.config();

  // Add dependencies to express app
  app.prisma = prisma;

  // Define middleware
  app.use(bodyParser.json());

  // Define endpoints here, you can split these out into functions
  app.get("/", (_, res) => {
    res.send("Hello world!");
  });

  // Define routes & handlers
  app.get("/transactions/:id", getTransaction);
  app.post("/transactions/", createTransaction);
  app.get("/transactions", getTransactions);
  app.patch("/transactions/:id", updateTransaction);

  app.listen(port, host, () => {
    console.log(`Server is listening on ${host}:${port}`);
  });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
