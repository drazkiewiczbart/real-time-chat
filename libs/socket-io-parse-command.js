const {
  setName,
  joinToRoom,
  leaveRoom,
  whereAmI,
  checkName,
} = require('./socket-io-parse-command-utilities');

const commandList = {
  setname: 'setname',
  changename: 'changename',
  checkname: 'checkname',
  jointoroom: 'jointoroom',
  leaveroom: 'leaveroom',
  whereami: 'whereami',
};

const normalizeCommand = (clientRequest) => {
  const [command, property] = clientRequest.split(' ');
  const commandRemoveSpecialChars = command.replace(/\$/g, '');
  const commandLowerCase = commandRemoveSpecialChars.toLowerCase();
  return [commandLowerCase, property];
};

const parseClientCommand = async (socket, clientRequest) => {
  const [command, property] = normalizeCommand(clientRequest);
  let message;

  switch (command) {
    case commandList.setname:
    case commandList.changename: {
      message = await setName(socket, property);
      break;
    }
    case commandList.checkname: {
      message = checkName(socket);
      break;
    }
    case commandList.jointoroom: {
      message = await joinToRoom(socket, property);
      break;
    }
    case commandList.leaveroom: {
      message = await leaveRoom(socket);
      break;
    }
    case commandList.whereami: {
      message = await whereAmI();
      break;
    }
    default: {
      message = `Error command!`;
    }
  }
  return message;
};

module.exports = {
  parseClientCommand,
};
