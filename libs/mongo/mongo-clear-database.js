const { dbName } = require('../../config');

const clearMongoDatabase = async (mongoConnection, logger) => {
  try {
    await mongoConnection.db(dbName).collection('users').drop();
    await mongoConnection.db(dbName).collection('rooms').drop();
    logger.log({
      level: 'info',
      message: 'Collections in databases removed.',
    });
  } catch (err) {
    logger.log({
      level: 'warn',
      message: err,
    });
  }
};

module.exports = {
  clearMongoDatabase,
};
