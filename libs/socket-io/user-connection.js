const { Response } = require('./response');
const { getDatabaseConnection } = require('../mongodb/connection');
const { logger } = require('../winston/config');
const { updateUsersList } = require('./users-in-room');

const userConnection = async (socket) => {
  const response = new Response();
  response.requestAuthor = socket.id;

  try {
    response.status = true;
    response.message = '[WELCOME MESSAGE] Hello new user! This is your private/default chat room. Only you can see your messages in this place. In settings above you can change your name, create room or join to existing room or leave room. In one time you can be only in one room. It is all, have a nice day!';

    await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .insertOne({ _id: socket.id, name: 'New user', roomId: null });

    socket.emit('userConnection', response);
    updateUsersList(socket);
  } catch (err) {
    response.status = false;
    response.message = 'We have a problem, please try again later.';

    socket.emit('userConnection', response);

    logger.log({ level: 'error', message: err });
  }
};

module.exports = {
  userConnection,
};
