const isPasswordValid = (password) => {
  if (password.length < 3 || password.length > 50) {
    return false
  }

  if (password.includes(" ")) {
    return false
  }
  return true;
};

module.exports = {
  password: isPasswordValid
};
