const { dbName } = require('../../config');

const clearMongoDatabase = async (mongoConnection) => {
  try {
    await mongoConnection.db(dbName).collection('users').drop();
    await mongoConnection.db(dbName).collection('rooms').drop();
    console.log('Collections in databases removed.');
  } catch (err) {
    console.error(
      `Cannot remove collections from database. Collections do not exists. ${err}.`,
    );
  }
};

module.exports = {
  clearMongoDatabase,
};
