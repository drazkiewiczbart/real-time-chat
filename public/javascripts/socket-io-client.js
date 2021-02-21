const defaultAction = () => {
  $('.btn-current-value').text('Message');
  $('.join-to-room').text('Join to room');
  $('.leave-room').text('Leave room');
  $('.change-name').text('Change name');
};

const scrollToLastMessage = () => {
  $('.messages-wrapper').scrollTop(
    $('.messages-wrapper')[0].scrollHeight -
      $('.messages-wrapper')[0].clientHeight,
  );
};

const normalizeValue = (actionValue) => {
  const trimOption = actionValue.trim();
  const lowerCaseWord = trimOption.toLowerCase();
  const splitWord = lowerCaseWord.split(' ');
  const splitWordUpper = [];
  splitWordUpper.push(splitWord[0]);
  for (let i = 1; i < splitWord.length; i++) {
    const currentWord = splitWord[i];
    splitWordUpper.push(
      `${currentWord.slice(0, 1).toUpperCase()}${currentWord.slice(1)}`,
    );
  }
  const finalMessage = splitWordUpper.join('');
  return finalMessage;
};

const socket = io();

$('.send-message').submit((event) => {
  event.preventDefault();
  const actionValue = $('.btn-current-value').text();
  const actionValueNormalize = normalizeValue(actionValue);
  const message = $('.input-message').val();
  switch (actionValueNormalize) {
    case 'message': {
      socket.emit('message', message);
      break;
    }
    case 'joinToRoom': {
      socket.emit('joinToRoom', message);
      break;
    }
    case 'leaveRoom': {
      socket.emit('leaveRoom', message);
      break;
    }
    case 'changeName': {
      socket.emit('changeName', message);
      break;
    }
    default:
      socket.emit('message', message);
  }
  defaultAction();
});

const parseServerResponse = (from) => {
  if (from === 'Server') {
    return 'from-server';
  }
};

socket.on('serverResponse', (serverResponse) => {
  const { from, message, date, time } = serverResponse;
  const templateMessage = `
  <div class="row py-3">
    <div class="col message ${parseServerResponse(from)}">
      <div class="row mb-1 pt-4 px-3">
        <div class="col message-data">
          <div class="row">
            <div class="col col-xxl-5">
              <p>
                <span class="author">${from}</span> says:
              </p>
            </div>
            <div class="col col-xxl-7 text-end">
              <p>
                <span class="date">${date}</span>
                <span class="time">${time}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="row pb-4 px-3">
        <div class="col message-content">
          <p>
            ${message}
          </p>
        </div>
      </div>
    </div>
  </div>
  `;
  $(templateMessage).appendTo($('.messages-wrapper'));

  scrollToLastMessage();
});
