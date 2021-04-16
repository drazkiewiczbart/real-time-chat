import { socket, hideSettings, publishMessage, scrollWindowMessages,createMessageView } from './utilities.js';

const restoreChangeNameInput = () => {
  $('#settings-content-actions-input-text-name').val('');
  $('#settings-content-actions-input-button-name').prop('disabled', true);
};

const changeDisplayName = (name) => {
  $('#settings-content-name').text(name);
};

socket.on('changeName', (serverResponse) => {
  const { status, requestAuthor, message, data } = serverResponse;

  if (status && requestAuthor === socket.id) changeDisplayName(data);

  const messageView = createMessageView(message);

  publishMessage(messageView);

  scrollWindowMessages();
});

$('#settings-content-actions-input-button-name').click((event) => {
  event.preventDefault();

  const newName = $('#settings-content-actions-input-text-name').val();

  socket.emit('changeName', newName);

  hideSettings();

  restoreChangeNameInput();
});
