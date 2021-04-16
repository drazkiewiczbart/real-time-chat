import { socket, publishMessage, scrollWindowMessages, createMessageView } from './utilities.js';

socket.on('userDisconnect', (serverResponse) => {
  const { message } = serverResponse;
  const messageView = createMessageView(message);

  publishMessage(messageView);

  scrollWindowMessages();
});
