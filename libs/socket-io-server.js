const { parseClientMsg } = require('./socket-io-parse');
const { emitServerMsg, addUserToSession } = require('./socket-io-utilities');

const serverWelcomeMsg = 'System: Hello user!';

module.exports = async (io) => {
  io.on('connection', (socket) => {
    emitServerMsg(io, serverWelcomeMsg);
    addUserToSession(socket);
    socket.on('clientMsg', (clientMsg) => {
      const serverResponse = parseClientMsg(socket, clientMsg);
      emitServerMsg(io, serverResponse);
    });
  });
};
