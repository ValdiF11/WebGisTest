function errorHandler(err, req, res, next) {
  let status = err.status;
  let message = err.message;
  switch (err.name) {
    case "SequelizeValidationError":
      status = 400;
      message = err.errors.map((el) => el.message).join(", ");
      break;
    case "SequelizeUniqueConstraintError":
      status = 400;
      message = err.errors.map((el) => el.message).join(", ");
      break;
    case "Invalid Token":
      status = 401;
      message = "Error Authentication";
      break;
    default:
      status = 500;
      message = "Internal server error";
      break;
  }

  console.error(err);
  res.status(status).json({ message });
}

module.exports = errorHandler;
