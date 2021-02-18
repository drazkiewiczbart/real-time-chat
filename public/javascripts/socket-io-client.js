const socket = io();

$('form').submit((event) => {
  event.preventDefault();
  socket.emit('clientMsg', $('input').val());
});

socket.on('serverMsg', (serverMsg) => {
  const [author, message, data, time] = serverMsg;
  const templateMessage = `
  <div class="row py-3">
    <div class="col message">
      <div class="row mb-1 pt-3 px-3">
        <div class="col message-data">
          <p>
            <span class="data">${data}</span>
            <span class="time">${time}</span>
            <span class="author">${author}</span> says:
          </p>
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
