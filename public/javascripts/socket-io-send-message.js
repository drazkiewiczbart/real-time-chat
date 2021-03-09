import {
  socket,
  publishMessage,
  scrollWindowMessages,
  createMessageView,
} from './socket-io-utilities.js';

/*
 ** Restore message input
 */
const restoreMessageInput = () => {
  $('#footer-content-form-content-text').val('');
};

/*
 ** Main socket io, get server response for sendMessage request
 */
socket.on('sendMessage', (serverResponse) => {
  const {
    from,
    requestAuthor,
    message,
    date,
    time,
    data,
    status,
  } = serverResponse;

  const messageView = createMessageView(message, date, time, from);
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
