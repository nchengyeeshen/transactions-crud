const { respond400, internalServerError } = require("./helpers");

const getTransaction = async (req, res) => {
  try {
    const prisma = req.app.prisma;
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.send({
      transaction: transaction,
    });
  } catch {
    internalServerError(res);
  }
};

const createTransaction = async (req, res) => {
  if (req.body === undefined) {
    respond400(res, "empty request body");
  }

  if (req.body.description === undefined || req.body.description.length === 0) {
    respond400(res, "description not provided or empty");
  }

  if (req.body.credit === undefined && req.body.debit === undefined) {
    respond400(res, "no credit or debit amount provided");
  }

  if (req.body.credit !== undefined && req.body.debit !== undefined) {
    respond400(
      res,
      "only credit or debit amount should provided, but not both"
    );
  }

  try {
    const transaction = await req.app.prisma.transaction.create({
      data: {
        description: req.body.description,
        credit: req.body.credit ? req.body.credit : 0.0,
        debit: req.body.debit ? req.body.debit : 0.0,
      },
    });
    res.send({
      transaction: transaction,
    });
  } catch {
    internalServerError(res);
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await req.app.prisma.transaction.findMany();
    res.send(transactions);
  } catch {
    internalServerError(res);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await req.app.prisma.transaction.update({
      where: {
        id: req.params.id,
      },
      data: {
        description: req.body.description,
        credit: req.body.credit,
        debit: req.body.debit,
      },
    });

    res.send({ transaction: transaction });
  } catch {
    internalServerError(res);
  }
};

module.exports = {
  getTransaction,
  createTransaction,
  getTransactions,
  updateTransaction,
};
