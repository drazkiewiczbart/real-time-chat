const selectAction = function () {
  const selectedItem = $(this);
  const selectedItemValue = $(this).text();
  const currentOption = $('.btn-current-value');
  const currentOptionValue = currentOption.text();
  $('.btn-current-value').text(selectedItemValue);
  $(selectedItem).text(currentOptionValue);
};

$('.dropdown-item').click(selectAction);
