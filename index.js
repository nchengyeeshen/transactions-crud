const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

const host = process.env.host || "localhost";
const port = process.env.port || 3000;

const prisma = new PrismaClient();
const app = express();

const main = async () => {
  // Load environment variables
  dotenv.config();

  // Define middleware
  app.use(bodyParser.json());

  // Define endpoints here, you can split these out into functions
  app.get("/", (_, res) => {
    res.send("Hello world!");
  });

  // Show a given transaction
  app.get("/transactions/:id", async (req, res) => {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.send({
      transaction: transaction,
    });
  });

  // Create a transaction
  app.post("/transactions/", async (req, res) => {
    if (!req.body) {
      res.statusCode = 400;
      res.send({ error: "empty request body" });
      return;
    }

    if (!req.body.description || req.body.description.length === 0) {
      res.statusCode = 400;
      res.send({ error: "description not provided or empty" });
      return;
    }

    if (!req.body.credit && !req.body.debit) {
      res.statusCode = 400;
      res.send({ error: "no credit or debit amount provided" });
      return;
    }

    if (req.body.credit && req.body.debit) {
      res.statusCode = 400;
      res.send({
        error: "only credit or debit amount should be provided, but not both",
      });
      return;
    }

    try {
      const transaction = await prisma.transaction.create({
        data: {
          description: req.body.description,
          credit: req.body.credit ? parseFloat(req.body.credit) : 0.0,
          debit: req.body.debit ? parseFloat(req.body.debit) : 0.0,
        },
      });

      res.statusCode = 200;
      res.send({ transaction: transaction });
    } catch {
      console.error("failed to create transaction");
      res.statusCode = 500;
      res.send({ error: "internal server error" });
    }
  });

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
