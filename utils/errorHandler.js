module.exports = (res, err) => {
  console.log("err:", err);
  let responseObject = processError(err);
  console.log("responseObject", responseObject);

  res
    .status(responseObject.code)
    .send({ message: responseObject.message, field: responseObject.field });
};

const processError = (err) => {
  if (err.code === 11000) {
    // unique
    if (err.message.includes("email")) {
      return {
        code: 400,
        message: "this email is already in use",
        field: "email",
      };
    }
    return { code: 400, message: "duplicate key" };
  }

  if (err.name === "ValidationError") {
    let message;
    if (err.message.includes("email")) {
      message = "invalid e-mail";
      field = "email";
    }

    if (err.message.includes("fullName")) {
      message = "invalid fullName";
      field = "fullName";
    }
    if (err.message.includes("role")) {
      message = "invalid role";
      field = "role";
    }
    return { code: 400, message, field };
  }

  if (err.name === "CastError") {
    // user not found
    return {
      code: 404,
      field: "email",
      message: "The email or password is incorrect.",
    };
  }

  if (err.name === "TypeError") {
    // bad request
    return { code: 400, message: "TypeError" };
  }

  return { code, message } || { code: 500, message: "server error" };
};
