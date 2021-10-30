const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bodyParser = require("body-parser");
const {
  getTransaction,
  createTransaction,
  getTransactions,
  updateTransaction,
} = require("./handlers");

const port = process.env.PORT || 3000;

const app = express();

const main = async () => {
  // Add dependencies to express app
  app.prisma = new PrismaClient();

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

  app.listen(port, () => {
    console.log(`Server is listening on :${port}`);
  });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await app.prisma.$disconnect();
  });
