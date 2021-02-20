const socket = io();

$('form').submit((event) => {
  event.preventDefault();
  socket.emit('clientRequest', $('input').val());
});

socket.on('serverResponse', (serverResponse) => {
  const { name, message, date, time } = serverResponse;
  console.log(serverResponse);
  const isServerMessage = name === 'Chat bot' ? 'from-server' : '';
  const templateMessage = `
  <div class="row py-3">
    <div class="col message ${isServerMessage}">
      <div class="row mb-1 pt-3 px-3">
        <div class="col message-data">
          <div class="row">
            <div class="col col-xxl-5">
              <p>
                <span class="author">${name}</span> says:
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
      <div class="row pb-3 px-3">
        <div class="col message-content">
          <p>
            ${message}
          </p>
        </div>
      </div>
    </div>
  </div>
  `;
  $(templateMessage).appendTo($('#messages-wrapper'));

  $('#messages-wrapper').scrollTop(
    $('#messages-wrapper')[0].scrollHeight -
      $('#messages-wrapper')[0].clientHeight,
  );
});
