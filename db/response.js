const response = (statusCode, data, message, res) => {
  res.status(statusCode).json(
    {
      status:statusCode,
      data,
      message,
    }
  );
};
module.exports = response;
