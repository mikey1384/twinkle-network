const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, curr) => {
  prev[`process.env.${curr}`] = JSON.stringify(env[curr]);
  return prev;
}, {});

module.exports = { envKeys };
