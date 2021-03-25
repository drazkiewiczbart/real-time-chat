let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

$('#menu-content-settings-icon').click(() => {
  if (
    !$('#menu-content-settings-icon').hasClass(
      'menu-content-icon-settings--active',
    )
  ) {
    $('#settings').removeClass('settings--hide');
    $('#header-content-title').text('Settings');
    $('#menu-content-settings-icon').addClass(
      'menu-content-icon-settings--active',
    );

    $('#messages').addClass('messages--hide');
    $('#users-in-room').addClass('users-in-room--hide');
    $('#footer').addClass('footer--hide');
    $('#menu-content-users-icon').removeClass(
      'menu-content-icon-users--active',
    );
    $('#menu-content-messages-icon').removeClass(
      'menu-content-icon-message--active',
    );
  }
});

$('#menu-content-messages-icon').click(() => {
  if (
    !$('#menu-content-messages-icon').hasClass(
      'menu-content-icon-message--active',
    )
  ) {
    $('#messages').removeClass('messages--hide');
    $('#header-content-title').text('Messages');
    $('#menu-content-messages-icon').addClass(
      'menu-content-icon-message--active',
    );

    $('#settings').addClass('settings--hide');
    $('#users-in-room').addClass('users-in-room--hide');
    $('#footer').removeClass('footer--hide');
    $('#menu-content-users-icon').removeClass(
      'menu-content-icon-users--active',
    );
    $('#menu-content-settings-icon').removeClass(
      'menu-content-icon-settings--active',
    );
  }
});

$('#menu-content-users-icon').click(() => {
  if (
    !$('#menu-content-users-icon').hasClass('menu-content-icon-users--active')
  ) {
    $('#users-in-room').removeClass('users-in-room--hide');
    $('#header-content-title').text('Users in room');
    $('#menu-content-users-icon').addClass('menu-content-icon-users--active');

    $('#settings').addClass('settings--hide');
    $('#messages').addClass('messages--hide');
    $('#footer').addClass('footer--hide');
    $('#menu-content-messages-icon').removeClass(
      'menu-content-icon-message--active',
    );
    $('#menu-content-settings-icon').removeClass(
      'menu-content-icon-settings--active',
    );
  }
});

$('#settings-content-actions-input-text-name').keyup(() => {
  if ($('#settings-content-actions-input-text-name').val().length !== 0) {
    $('#settings-content-actions-input-button-name').prop('disabled', false);
  } else {
    $('#settings-content-actions-input-button-name').prop('disabled', true);
  }
});

$('#settings-content-actions-input-text').keyup(() => {
  if ($('#settings-content-actions-input-text').val().length !== 0) {
    $('#settings-content-actions-input-button-join').prop('disabled', false);
  } else {
    $('#settings-content-actions-input-button-join').prop('disabled', true);
  }
});

$('#footer-content-form-content-text').keyup(() => {
  if ($('#footer-content-form-content-text').val().length !== 0) {
    $('#footer-content-form-content-button').prop('disabled', false);
  } else {
    $('#footer-content-form-content-button').prop('disabled', true);
  }
});
