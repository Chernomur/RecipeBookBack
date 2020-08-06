const crypto = require('crypto');
const config = require('../config');

module.exports = (password) => {
  return crypto
    .createHmac(config.hashType, config.hashKey)
    .update(password)
    .digest('hex');
};
