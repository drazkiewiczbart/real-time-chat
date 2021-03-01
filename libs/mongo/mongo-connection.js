const { MongoClient } = require('mongodb');
const {
  dbHost,
  dbPort,
  dbName,
  dbUser,
  dbUserPwd,
} = require('../../config/config');

const uri = `mongodb://${dbUser}:${dbUserPwd}@${dbHost}:${dbPort}/${dbName}`;
//TODO check config options
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
let client;

const openConnection = async () => {
  try {
    client = await MongoClient.connect(uri, config);
    //TODO handle logs, delete consol.log
    console.log('Connected successfully to database server.');
  } catch (err) {
    //TODO handle logs, delete consol.log
    console.error(`Connection fail to database server. ${err}.`);
  }
};

const getConnection = () => {
  const connection = client.db(dbName);
  return connection;
};

module.exports = {
  openConnection,
  getConnection,
};
