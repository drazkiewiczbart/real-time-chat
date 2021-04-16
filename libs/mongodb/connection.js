const { MongoClient } = require('mongodb');
const { logger } = require('../winston/config');

let databaseConnection;

const establishDatabaseConnection = async () => {
  if (databaseConnection) return databaseConnection;

  try {
    const config = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const databaseClient = new MongoClient(process.env.DB_PATH, config);

    databaseConnection = await databaseClient.connect();

    logger.log({ level: 'info', message: 'Application connected to database server.' });
  } catch (err) {
    logger.log({ level: 'error', message: `Application has a problem to connect to database server. ${err}` });
    process.exit();
  }

  try {
    await databaseConnection
      .db(process.env.DB_NAME)
      .collection('rtchatusers')
      .drop();

    await databaseConnection
      .db(process.env.DB_NAME)
      .collection('rtchatrooms')
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
