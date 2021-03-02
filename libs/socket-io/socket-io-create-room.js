const { dbName } = require('../../config');

const createRoom = async (socket, mongoConnection, roomName) => {
  try {
    const { _id: userId, name: userName } = await mongoConnection
      .db(dbName)
      .collection('users')
      .findOne({ _id: socket.id });

    await mongoConnection
      .db(dbName)
      .collection('rooms')
      .insertOne({
        name: roomName,
        connectedUsers: [{ socketId: userId, name: userName }],
      });
    return true;
  } catch (err) {
    //TODO handle logs
    return false;
  }
};

module.exports = {
  createRoom,
};
