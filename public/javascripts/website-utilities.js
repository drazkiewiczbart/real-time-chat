/*
 ** Switch between message and settings window
 */
$('#menu-content-settings-icon').click(() => {
  if ($('#menu-content-messages-icon').hasClass('menu-content-icon--active')) {
    $('#menu-content-messages-icon').toggleClass('menu-content-icon--active');
    $('#messages').toggleClass('messages--hide');
    $('#menu-content-settings-icon').toggleClass('menu-content-icon--active');
    $('#settings').toggleClass('settings--hide');
    $('#header-content-title').text('Settings');
    $('#footer').toggleClass('footer--hide');
  }
});

$('#menu-content-messages-icon').click(() => {
  if ($('#menu-content-settings-icon').hasClass('menu-content-icon--active')) {
    $('#menu-content-messages-icon').toggleClass('menu-content-icon--active');
    $('#messages').toggleClass('messages--hide');
    $('#menu-content-settings-icon').toggleClass('menu-content-icon--active');
    $('#settings').toggleClass('settings--hide');
    $('#header-content-title').text('Messages');
    $('#footer').toggleClass('footer--hide');
  }
});

/*
 ** Hide settings window
 */
const hideSettings = () => {
  $('#menu-content-messages-icon').toggleClass('menu-content-icon--active');
  $('#menu-content-settings-icon').toggleClass('menu-content-icon--active');
  $('#header-content-title').text('Messages');
  $('#settings').toggleClass('settings--hide');
  $('#messages').toggleClass('messages--hide');
  $('#footer').toggleClass('footer--hide');
};

/*
 ** Change display name if user change name
 */
const changeDisplayName = (name) => {
  $('#settings-content-name').text(name);
};

/*
 ** Change room name if user change room
 */
const changeDisplayRoom = (name) => {
  $('#settings-content-room').text(name);
};

/*
 ** Restore display room to default
 */
const leaveRoom = () => {
  $('#settings-content-room').text('Default');
};

/*
 ** Scroll window to bottom after new message is display
 */
const scrollWindowMessages = () => {
  $('#messages').scrollTop($('#messages')[0].scrollHeight);
};

/*
 ** Socket io
 */
const socket = io();

/*
 ** Send message
 */
$('#footer-content-form').submit((event) => {
  event.preventDefault();
  const message = $('#footer-content-form-content-text').val();
  socket.emit('message', message);
  $('#footer-content-form-content-text').val('');
});

/*
 ** Send message after Enter key press
 */
$('#footer-content-form-content-text').keypress((key) => {
  if (key.keyCode === 13 && !key.shiftKey) {
    key.preventDefault();
    const message = $('#footer-content-form-content-text').val();
    socket.emit('message', message);
    $('#footer-content-form-content-text').val('');
    $('#footer-content-form-content-text').trim();
  }
});

/*
 ** Leave room
 */
$('#settings-content-actions-input-button-leave').click(() => {
  socket.emit('leaveRoom');
  hideSettings();
});

/*
 ** Join to room
 */
$('#settings-content-actions-input-button-join').click((event) => {
  event.preventDefault();
  const message = $('#settings-content-actions-input-text').val();
  socket.emit('joinToRoom', message);
  $('#settings-content-actions-input-text').val('');
  hideSettings();
});

/*
 ** Change name
 */
$('#settings-content-actions-input-button-name').click((event) => {
  event.preventDefault();
  const message = $('#settings-content-actions-input-text-name').val();
  socket.emit('changeName', message);
  $('#settings-content-actions-input-text-name').val('');
  hideSettings();
});

/*
 ** New message template generator
 */
const createMessageView = (from, message, date, time) => {
  const isServerAuthor =
    from === 'Server' ? 'messages-content-single--server' : '';

  const templateMessage = `
    <div class="messages-content-single ${isServerAuthor}">
      <div class="messages-content-single-from-when-wrapper">
        <p class="messages-content-single-from">${from}</p>
        <p class="messages-content-single-when">${time} ${date}</p>
      </div>
      <p class="messages-content-single-text">
        ${message}
      </p>
    </div>
  `;
  return templateMessage;
};

/*
 ** Generate response for user
 */
const publishMessage = (serverResponse) => {
  const {
    from,
    message,
    date,
    time,
    request,
    requestMessage,
    isRequestSuccess,
  } = serverResponse;
  const newMessage = createMessageView(from, message, date, time);
  $(newMessage).appendTo($('#messages-content'));

  if (request === 'Change name' && isRequestSuccess) {
    changeDisplayName(requestMessage);
  }

  if (request === 'Join to room' && isRequestSuccess) {
    changeDisplayRoom(requestMessage);
  }

  if (request === 'Leave room' && isRequestSuccess) {
    leaveRoom();
  }

  scrollWindowMessages();
};

/*
 ** Main socket io, get server response
 */
socket.on('serverResponse', (serverResponse) => {
  publishMessage(serverResponse);
});
