import {
  socket,
  publishMessage,
  scrollWindowMessages,
  createMessageView,
} from './socket-io-utilities.js';

/*
 ** Main socket io, get server response for user disconnect request
 */
socket.on('userDisconnect', (serverResponse) => {
  const { requestAuthor, message, date, time, data, status } = serverResponse;
  const messageView = createMessageView(message, date, time);
  publishMessage(messageView);
  scrollWindowMessages();
});
