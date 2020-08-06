const _defaultsDeep = require('lodash/defaultsDeep');
const defaultsConfig = require('./defaultConfig.json');
const env = process.env.NODE_ENV || 'development';
let localConfig = {};
try {
  localConfig = require('./localConfig.json');
} catch (err) {
  console.warn('There is no localConfig.json file!');
}
const config = _defaultsDeep(localConfig, defaultsConfig);
module.exports = config[env];