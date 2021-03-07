const moment = require('moment');
const { dbName } = require('../../config');

const updateUserInRoomList = async (socket, mongoConnection) => {
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
    // Get user from database
    const {
      _id: userId,
      name: userName,
      roomId: userRoomId,
    } = await mongoConnection
      .db(dbName)
      .collection('users')
      .findOne({ _id: socket.id });

    // If user is in default room, send response and return
    if (!userRoomId) {
      response.message = [{ socketId: userId, name: userName }];
      response.status = true;
      socket.emit('usersInRoom', response);
      return;
    }

    // Get user room from database
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
