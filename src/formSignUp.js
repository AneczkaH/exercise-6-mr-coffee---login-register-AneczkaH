/* ^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
Ten regex wymusi następujące reguły:

Co najmniej jedna wielka litera angielska ,(?=.*?[A-Z])
Co najmniej jedna mała angielska litera, (?=.*?[a-z])
Co najmniej jedna cyfra, (?=.*?[0-9])
Co najmniej jedna postać specjalna, (?=.*?[#?!@$%^&*-])
Minimalna długość ośmiu .{8,}(z kotwami) */

$('p.invalid_feedback').hide();

function invalidFeedback() {
  const htmlElement = $(this);
  const inputValue = htmlElement.val();
  const pattern = htmlElement.attr('pattern');
  const regPattern = new RegExp(pattern);

  if (htmlElement.attr('id') === 'confirm_password') {
    if ($('#password').val() !== $(this).val()) {
      $(this).next().show();
    } else {
      $(this).next().hide();
    }
  } else if (inputValue !== null && regPattern.test(inputValue) === false) {
    htmlElement.next().show();
    $('.form_field_login').css('margin-bottom', '10px');
    $('div.form_field_login').css('margin-top', '30px');
  } else {
    htmlElement.next().hide();
    $('div.form_field_login').css('margin-top', '5px');
  }
}

$('input').on('blur', invalidFeedback);

$('#button_register').on('click', (event) => {
  let a = false;
  $('.invalid_feedback').each(function () {
    if ($(this).css('display') === 'block') {
      a = true;
    }
  });

  let b = false;
  $('input').each(function () {
    if ($(this).val() === '') {
      b = true;
    }
  });

  if (a || b) {
    alert('Please fill correct data');
    event.preventDefault();
  }
});
