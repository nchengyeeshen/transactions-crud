const respond400 = (res, msg) => {
  res.statusCode = 400;
  res.send({
    error: msg,
  });
};

const respond500 = (res, msg) => {
  res.statusCode = 500;
  res.send({
    error: msg,
  });
};

const internalServerError = (res) => respond500(res, "internal server error");

module.exports = {
  respond400,
  respond500,
  internalServerError,
};
