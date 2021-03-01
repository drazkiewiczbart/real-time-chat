const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/.env') });

module.exports = {
  port: process.env.PORT,
  host: process.env.HOST,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbUserPwd: process.env.DB_USER_PWD,
};
