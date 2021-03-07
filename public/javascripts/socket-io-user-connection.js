import {
  socket,
  publishMessage,
  scrollWindowMessages,
} from './socket-io-utilities.js';

/*
 ** New message template generator
 */
const createMessageView = (message, date, time) => {
  const messageView = `
    <div class="messages-content-single 'messages-content-single--server'">
      <div class="messages-content-single-from-when-wrapper">
        <p class="messages-content-single-from">Chat bot</p>
        <p class="messages-content-single-when">${time} / ${date}</p>
      </div>
      <p class="messages-content-single-text">
        ${message}
      </p>
    </div>
  `;
  return messageView;
};

/*
 ** Main socket io, get server response for user connection request
 */
socket.on('userConnection', (serverResponse) => {
  const { target, message, date, time, data, status } = serverResponse;
  const messageView = createMessageView(message, date, time);
  publishMessage(messageView);
  scrollWindowMessages();
});
