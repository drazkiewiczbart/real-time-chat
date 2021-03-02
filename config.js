require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  host: process.env.HOST,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbUserPwd: process.env.DB_USER_PWD,
};
