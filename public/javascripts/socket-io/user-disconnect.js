import { socket, publishMessage, scrollWindowMessages, createMessageView } from './utilities.js';

socket.on('userDisconnect', (serverResponse) => {
  const { message, date, time } = serverResponse;
  const messageView = createMessageView(message, date, time);

  publishMessage(messageView);

  scrollWindowMessages();
});