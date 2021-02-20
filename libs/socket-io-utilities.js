const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Room = mongoose.model('Rooms');
const { parseClientCommand } = require('./socket-io-parse-command');

const isClientRequestIsCommand = (clientRequest) => {
  const commandPattern = /^\${1}\w+\${1}/;
  const isCommand = clientRequest.match(commandPattern);
  return isCommand;
};

const serverResponse = async (socket, clientRequest) => {
  const now = moment();
  const date = now.format('YYYY-MM-DD');
  const time = now.format('HH:mm:ss');
  const response = {
    name: '',
    message: '',
    date,
    time,
  };
  if (isClientRequestIsCommand(clientRequest)) {
    const message = await parseClientCommand(socket, clientRequest);
    response.name = 'Chat bot';
    response.message = message;
  } else {
    const user = await User.findOne({ userSocketId: socket.id }).exec();
    response.name = user.name;
    response.message = clientRequest;
  }
  return response;
};

const newUserConnection = async (socket) => {
  const user = new User({
    userSocketId: socket.id,
    name: 'New user',
    defaultRoom: socket.id,
  });
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
};

const userDisconnect = async (socket) => {
  try {
    const user = await User.findOne({ userSocketId: socket.id }).exec();
    if (user.additionalRoom) {
      const userCurrentRoom = await Room.findOne({ name: user.additionalRoom });
      userCurrentRoom.users = userCurrentRoom.users.filter(
        (el) => el !== user.name,
      );
      if (userCurrentRoom.users.length === 0) {
        await Room.deleteOne({ name: user.additionalRoom });
      } else {
        userCurrentRoom.save();
      }
    }
    await User.deleteOne({ userSocketId: socket.id }).exec();
    socket.disconnect();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  serverResponse,
  newUserConnection,
  userDisconnect,
};
