const { MongoClient } = require('mongodb');
const { dbHost, dbPort, dbName, dbUser, dbUserPwd } = require('../../config');

const uri = `mongodb://${dbUser}:${dbUserPwd}@${dbHost}:${dbPort}`;
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: dbName,
};
let mongoConnection;

const openMongoConnection = async () => {
  try {
    mongoConnection = await MongoClient.connect(uri, config);
    // TODO handle logs, delete consol.log
    console.log('Connected successfully to database server.');
  } catch (err) {
    // TODO handle logs, delete consol.log
    console.error(`Connection fail to database server. ${err}.`);
  }
};

const getMongoConnection = () => {
  return mongoConnection;
};

module.exports = {
  openMongoConnection,
  getMongoConnection,
};
