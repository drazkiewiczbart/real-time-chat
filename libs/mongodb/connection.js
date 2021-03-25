const { MongoClient } = require('mongodb');
const { logger } = require('../winston/config');

let databaseConnection = null;

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

    logger.log({ level: 'info', message: 'Database connected.' });

    return databaseConnection;
  } catch (err) {
    logger.log({ level: 'error', message: `Connect database problem. ${err}` });
  }
};

const getDatabaseConnection = () => {
  if (!databaseConnection) return establishDatabaseConnection();

  return databaseConnection;
};

module.exports = {
  establishDatabaseConnection,
  getDatabaseConnection,
};
