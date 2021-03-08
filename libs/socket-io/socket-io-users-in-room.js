const moment = require('moment');
const { dbName } = require('../../config');

const updateUserInRoomList = async (
  socket,
  mongoConnection,
  userRoomId = null,
) => {
  // Create response object
  const response = {
    target: socket.id,
    message: null,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    data: null,
    status: null,
  };

  try {
    // Check if user exists
    const isUserExists = await mongoConnection
      .db(dbName)
      .collection('users')
      .findOne({ _id: socket.id });

    // Check if room exists
    const isRoomExists = await mongoConnection
      .db(dbName)
      .collection('rooms')
      .findOne({ _id: userRoomId });

    // Check if user is in room
    const isUserInRoom = await mongoConnection
      .db(dbName)
      .collection('rooms')
      .findOne({
        _id: userRoomId,
        'connectedUsers.socketId': socket.id,
      });

    // Case if user disconnect
    if (!isUserExists && isRoomExists) {
      // Get room from database
      const {
        name: roomName,
        connectedUsers: usersInRoom,
      } = await mongoConnection
        .db(dbName)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      // Set and emit message
      response.message = usersInRoom;
      response.status = true;
      socket.to(roomName).emit('usersInRoom', response);
      return;
    }

    // Case if user not join to room
    if (!isRoomExists) {
      const { _id: userId, name: userName } = await mongoConnection
        .db(dbName)
        .collection('users')
        .findOne({ _id: socket.id });

      // Set and emit message
      response.message = [{ socketId: userId, name: userName }];
      response.status = true;
      socket.emit('usersInRoom', response);
      return;
    }

    // Case if user leave room
    if (isRoomExists && !isUserInRoom) {
      // Get user from database
      const { _id: userId, name: userName } = await mongoConnection
        .db(dbName)
        .collection('users')
        .findOne({ _id: socket.id });

      // Get room from database
      const {
        name: roomName,
        connectedUsers: usersInRoom,
      } = await mongoConnection
        .db(dbName)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      // Set and emit message
      response.message = usersInRoom;
      response.status = true;
      socket.to(roomName).emit('usersInRoom', response);
      response.message = [{ socketId: userId, name: userName }];
      socket.emit('usersInRoom', response);
      return;
    }

    // Case if user is in room
    // Get room from database
    const {
      name: roomName,
      connectedUsers: usersInRoom,
    } = await mongoConnection
      .db(dbName)
      .collection('rooms')
      .findOne({ _id: userRoomId });

    // Set and emit message
    response.message = usersInRoom;
    response.status = true;
    socket.to(roomName).emit('usersInRoom', response);
    socket.emit('usersInRoom', response);
  } catch (err) {
    // Set and emit message
    response.message = 'We have a problem, please check list again later.';
    socket.emit('usersInRoom', response);
    response.status = false;
    //TODO handle logs, delete consol.log
    console.log(err);
  }
};

module.exports = {
  updateUserInRoomList,
};
