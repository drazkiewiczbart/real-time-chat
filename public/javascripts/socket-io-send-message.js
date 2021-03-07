import {
  socket,
  publishMessage,
  scrollWindowMessages,
} from './socket-io-utilities.js';

/*
 ** Restore message input
 */
const restoreMessageInput = () => {
  $('#footer-content-form-content-text').val('');
};

/*
 ** New message template generator
 */
const createMessageView = (from, message, date, time) => {
  const messageView = `
    <div class="messages-content-single 'messages-content-single--server'">
      <div class="messages-content-single-from-when-wrapper">
        <p class="messages-content-single-from">${from}</p>
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
 ** Main socket io, get server response for sendMessage request
 */
socket.on('sendMessage', (serverResponse) => {
  const { from, target, message, date, time, data, status } = serverResponse;

  const messageView = createMessageView(from, message, date, time);
  publishMessage(messageView);
  scrollWindowMessages();
});

/*
 ** Main socket io, send to server request sendMessage
 */
$('#footer-content-form').submit((event) => {
  event.preventDefault();
  const message = $('#footer-content-form-content-text').val();
  socket.emit('sendMessage', message);
  restoreMessageInput();
});

/*
 ** Main socket io, send to server request sendMessage after press Enter
 */
$('#footer-content-form-content-text').keypress((key) => {
  const inputValueLength = $('#footer-content-form-content-text').val().length;

  if (key.keyCode === 13 && !key.shiftKey) {
    if (inputValueLength === 0) {
      key.preventDefault();
      return;
    }

    key.preventDefault();
    const message = $('#footer-content-form-content-text').val();
    socket.emit('sendMessage', message);
    restoreMessageInput();
  }
});
