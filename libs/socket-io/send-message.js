const { Response } = require('./response');
const { getDatabaseConnection } = require('../mongodb/connection');
const { logger } = require('../winston/config');

const sendMessage = async (socket, message) => {
  const response = new Response();
  response.requestAuthor = socket.id;
  response.message = message;

  if (message === '') {
    response.status = false;
    response.message = 'Type something, your message is empty.';
    response.from = 'Chat bot';

    socket.emit('sendMessage', response);

    return;
  }

  try {
    const { name: userName, roomId: userRoomId } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .findOne({ _id: socket.id });

    response.from = userName;

    if (userRoomId) {
      const { name: roomName } = await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      socket
        .to(roomName)
        .emit('sendMessage', response);
    }

    response.status = true;

    socket.emit('sendMessage', response);
  } catch (err) {
    response.status = false;
    response.message = 'We have a problem, please try again later.';
    response.from = 'Chat bot';

    socket.emit('sendMessage', response);

    logger.log({ level: 'error', message: err });
  }
};

module.exports = {
  sendMessage,
};
