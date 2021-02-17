const { parseCommand } = require('./socket-io-commands');

const normalizeCommand = (command) => {
  const commandRemoveSpecialChars = command.replace(/\$/g, '');
  const commandLowerCase = commandRemoveSpecialChars.toLowerCase();
  return commandLowerCase;
};

const parseClientMsg = (socket, clientMsg) => {
  if (clientMsg.match(/\${1}\w+\${1}/)) {
    const [clientCommand, commandProperty] = clientMsg.split(' ');
    const normalizeClientCommand = normalizeCommand(clientCommand);
    const serverResponse = parseCommand(
      socket,
      normalizeClientCommand,
      commandProperty,
    );
    return serverResponse;
  }
  return clientMsg;
};

module.exports = {
  parseClientMsg,
};
