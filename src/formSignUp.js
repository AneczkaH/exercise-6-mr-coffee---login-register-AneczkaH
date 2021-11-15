/* ^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
Ten regex wymusi następujące reguły:

Co najmniej jedna wielka litera angielska ,(?=.*?[A-Z])
Co najmniej jedna mała angielska litera, (?=.*?[a-z])
Co najmniej jedna cyfra, (?=.*?[0-9])
Co najmniej jedna postać specjalna, (?=.*?[#?!@$%^&*-])
Minimalna długość ośmiu .{8,}(z kotwami) */

function validateForm() {
  const firstname = document.forms.register_form.firstname.value;
  const lastname = document.forms.register_form.lastname.value;
  const mail = document.forms.register_form.email.value;
  const password = document.forms.register_form.password.value;
  const regFirstname = /^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]){3,13}\b/;
  const regLastname = /^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ.'-]){3,20}\b/;
  const regMail = /^([a-z0-9_.-]+@[a-z0-9_.-]+\.[a-z]{2,4})/;
  const regPassword = /^([a-zA0-9]){8,}\b/;

  if (/* name === null || */ regFirstname.test(firstname) === false) {
    alert('Fill correct name-only letters is ok');
    return false;
  } if (/* surname === null || */ regLastname.test(lastname) === false) {
    alert('Fill correct surname-only letters is ok');
    return false;
  } if (mail === null || regMail.test(mail) === false) {
    alert('Fill correct email - should contain: "@" and "."');
    return false;
  } if (regPassword.test(password) === false) {
    alert('The password should have 8 characters');
    return false;
  }
  return true;
}

$('#button_register').on('click', () => {
  
  if (validateForm() === true) {
  } else {
    alert('Please fill correct data');
  }
});


