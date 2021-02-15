const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/.env') });

const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const dbConfig = {
  user: process.env.DB_USER,
  pass: process.env.DB_USER_PWD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  httpOnly: true,
  cookie: {
    secure: false,
  },
};

module.exports = {
  port: process.env.PORT,
  host: process.env.HOST,
  dbURI,
  dbConfig,
  sessionConfig,
};
