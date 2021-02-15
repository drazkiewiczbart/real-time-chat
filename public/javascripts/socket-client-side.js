const form = document.querySelector('form');
const input = document.querySelector('input');
const ul = document.querySelector('ul');
const socket = io();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('clientMsg', input.value);
});

socket.on('serverMsg', (serverMsg) => {
  const li = document.createElement('li');
  li.innerText = serverMsg;
  ul.appendChild(li);
});
