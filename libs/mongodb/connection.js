const { MongoClient } = require('mongodb');
const { logger } = require('../winston/config');

let databaseConnection;

const establishDatabaseConnection = async () => {
  if (databaseConnection) return databaseConnection;

  try {
    const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_USER_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}`;
    const config = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: process.env.DB_NAME,
    };
    const databaseClient = new MongoClient(uri, config);

    databaseConnection = await databaseClient.connect();

    logger.log({ level: 'info', message: 'Application connected to database server.' });
  } catch (err) {
    logger.log({ level: 'error', message: `Application has a problem to connect to database server. ${err}` });
  }

  try {
    await databaseConnection
      .db(process.env.DB_NAME)
      .collection('users')
      .drop();

    await databaseConnection
      .db(process.env.DB_NAME)
      .collection('rooms')
      .drop();

    logger.log({ level: 'info', message: 'Database removed collections.' });
  } catch (err) {
    logger.log({ level: 'warn', message: `Database has a problem with remove collections. Probably collections do not exists. ${err}` });
  }
};

const getDatabaseConnection = () => {
  if (!databaseConnection) {
    throw new Error('Before get connection you must use establishDatabaseConnection function.');
  } else {
    return databaseConnection;
  }
};

module.exports = {
  establishDatabaseConnection,
  getDatabaseConnection,
};
