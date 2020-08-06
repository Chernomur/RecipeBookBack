module.exports = (err) => {
  if (err.code === 11000) { // unique
    if (err.message.includes("email")) {
      return ({code: 400, message: "this email is already in use."});
    }
    return ({code: 400, message: "duplicate key"});
  }

  if (err.name === "ValidationError") {
    let message;
    if (err.message.includes("email")) {
      message = "incorrect e-mail";
    }
    if (err.message.includes("fullName")) {
      message = "incorrect fullName";
    }
    if (err.message.includes("role")) {
      message = "incorrect role";
    }
    return ({code: 400, message});
  }

  if (err.name === "CastError") { // user not found
    return ({code: 404, message: "Not Found"});
  }

  if (err.name === "TypeError") { // bad request
    return ({code: 400, message: "TypeError"});
  }


  return ({code: 500, message: "server error"});
}