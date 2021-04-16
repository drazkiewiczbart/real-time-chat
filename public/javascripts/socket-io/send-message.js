import { socket, publishMessage, scrollWindowMessages, createMessageView } from './utilities.js';

const restoreMessageInput = () => {
  $('#footer-content-form-content-text').val('');
};

socket.on('sendMessage', (serverResponse) => {
  const { message, from } = serverResponse;

  const messageView = createMessageView(message, from);

  publishMessage(messageView);

  scrollWindowMessages();
});

$('#footer-content-form').submit((event) => {
  event.preventDefault();

  const message = $('#footer-content-form-content-text').val();

  socket.emit('sendMessage', message);

  restoreMessageInput();
});

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
