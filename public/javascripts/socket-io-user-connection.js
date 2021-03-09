import {
  socket,
  publishMessage,
  scrollWindowMessages,
  createMessageView,
} from './socket-io-utilities.js';

/*
 ** Main socket io, get server response for user connection request
 */
socket.on('userConnection', (serverResponse) => {
  const { requestAuthor, message, date, time, data, status } = serverResponse;
  const messageView = createMessageView(message, date, time);
  publishMessage(messageView);
  scrollWindowMessages();
});
