const mongoose = require('mongoose');
const User = mongoose.model('Users');
const {
  serverResponse,
  newUserConnection,
  userDisconnect,
} = require('./socket-io-utilities');

module.exports = (io) => {
  io.on('connection', (socket) => {
    newUserConnection(socket);
    socket.on('disconnect', () => {
      userDisconnect(socket);
    });
    socket.on('clientRequest', async (clientRequest) => {
      try {
        const response = await serverResponse(socket, clientRequest);
        const user = await User.findOne({ userSocketId: socket.id }).exec();
        if (response.name === 'Chat bot') {
          io.to(user.defaultRoom).emit('serverResponse', response);
        } else {
          io.to(user.defaultRoom)
            .to(user.additionalRoom)
            .emit('serverResponse', response);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
};
