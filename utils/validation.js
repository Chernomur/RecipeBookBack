const isPasswordValid = (password) => {
  if (password.length < 3 || password.length > 50) {
    return false;
  }

  return !password.includes(" ");
};

module.exports = {
  password: isPasswordValid,
};
