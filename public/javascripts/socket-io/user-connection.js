import { socket, publishMessage, scrollWindowMessages, createMessageView } from './utilities.js';

socket.on('userConnection', (serverResponse) => {
  const { message } = serverResponse;
  const messageView = createMessageView(message);

  publishMessage(messageView);

  scrollWindowMessages();
});
