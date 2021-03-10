const { MongoClient } = require('mongodb');
const { dbHost, dbPort, dbName, dbUser, dbUserPwd } = require('../../config');

const uri = `mongodb://${dbUser}:${dbUserPwd}@${dbHost}:${dbPort}`;
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: dbName,
};
let mongoConnection;

const openMongoConnection = async (logger) => {
  try {
    mongoConnection = await MongoClient.connect(uri, config);
    logger.log({
      level: 'info',
      message: 'Connected successfully to database server.',
    });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

const getMongoConnection = () => {
  return mongoConnection;
};

module.exports = {
  openMongoConnection,
  getMongoConnection,
};
