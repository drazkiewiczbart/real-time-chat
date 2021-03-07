/*
 ** Resize window
 */
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

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
 ** Enable change name button if input has value
 */
$('#settings-content-actions-input-text-name').keyup(() => {
  if ($('#settings-content-actions-input-text-name').val().length !== 0) {
    $('#settings-content-actions-input-button-name').prop('disabled', false);
  } else {
    $('#settings-content-actions-input-button-name').prop('disabled', true);
  }
});

/*
 ** Enable create or join button if input has value
 */
$('#settings-content-actions-input-text').keyup(() => {
  if ($('#settings-content-actions-input-text').val().length !== 0) {
    $('#settings-content-actions-input-button-join').prop('disabled', false);
  } else {
    $('#settings-content-actions-input-button-join').prop('disabled', true);
  }
});

/*
 ** Enable message button if input has value
 */
$('#footer-content-form-content-text').keyup(() => {
  if ($('#footer-content-form-content-text').val().length !== 0) {
    $('#footer-content-form-content-button').prop('disabled', false);
  } else {
    $('#footer-content-form-content-button').prop('disabled', true);
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
 ** Change room name and enable button "leave" if user change room
 */
const changeDisplayRoom = (name) => {
  $('#settings-content-room').text(name);
  $('#settings-content-actions-input-button-leave').prop('disabled', false);
};

/*
 ** Restore display room to default and disable button "leave"
 */
const leaveRoom = () => {
  $('#settings-content-room').text('Private/Default');
  $('#settings-content-actions-input-button-leave').prop('disabled', true);
};

/*
 ** Scroll window to bottom after new message is display
 */
const scrollWindowMessages = () => {
  $('#messages').scrollTop($('#messages')[0].scrollHeight);
};

/*
 ** Clear message windows
 */
const clearMessageWindow = () => {
  $('#messages-content').html('');
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
  $('#settings-content-actions-input-button-join').prop('disabled', true);
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
  $('#settings-content-actions-input-button-name').prop('disabled', true);

  hideSettings();
});

/*
 ** New message template generator
 */
const createMessageView = (from, message, date, time) => {
  const isServerAuthor =
    from === 'Chat bot' ? 'messages-content-single--server' : '';

  const templateMessage = `
    <div class="messages-content-single ${isServerAuthor}">
      <div class="messages-content-single-from-when-wrapper">
        <p class="messages-content-single-from">${from}</p>
        <p class="messages-content-single-when">${time} / ${date}</p>
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

  if (request === 'Change name' && isRequestSuccess) {
    changeDisplayName(requestMessage);
  }

  if (request === 'Join to room' && isRequestSuccess) {
    clearMessageWindow();
    changeDisplayRoom(requestMessage);
  }

  if (request === 'Leave room' && isRequestSuccess) {
    clearMessageWindow();
    leaveRoom();
  }

  const newMessage = createMessageView(from, message, date, time);
  $(newMessage).appendTo($('#messages-content'));

  scrollWindowMessages();
};

/*
 ** Main socket io, get server response
 */
socket.on('serverResponse', (serverResponse) => {
  publishMessage(serverResponse);
});
