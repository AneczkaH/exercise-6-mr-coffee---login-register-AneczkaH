// when the page is ready the modal is hidden

$('.new_schedules_of_logged_user').hide();
//$('.modal').hide();
//$('.invalid_feedback').hide();

// when click the btn id ="button_Envoyer"

/*^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
Ten regex wymusi następujące reguły:

Co najmniej jedna wielka litera angielska ,(?=.*?[A-Z])
Co najmniej jedna mała angielska litera, (?=.*?[a-z])
Co najmniej jedna cyfra, (?=.*?[0-9])
Co najmniej jedna postać specjalna, (?=.*?[#?!@$%^&*-])
Minimalna długość ośmiu .{8,}(z kotwami)*/

function validateForm() {
  const firstname = document.forms.register_form.firstname.value;
  const lastname = document.forms.register_form.lastname.value;
  const mail = document.forms.register_form.mail.value;
  const password = document.forms.register_form.password.value;
  const regFirstname = /^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]){3,13}\b/;
  const regLastname = /^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ.'-]){3,20}\b/;
  const regMail = /^([a-z0-9_.-]+@[a-z0-9_.-]+\.[a-z]{2,4})/;
  const regPassword = /^([a-zA0-9]){8,}\b/;

  if (/* name === null || */ regFirstname.test(firstname) === false) {
    alert('Fill correct name-only letters is ok');
    /* allert najlepiej byloby zamienić na feedback z podpowiedzią
    ewentualnie wpisywać jako error do tablicy i walidacje uzależnić
    od tego czy jest coś w tablicy */
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

/*function invalidFeedback() {
  const telephone = document.forms.contact_form.telephone.value;
  const regTelephone = /^(\+\d{2})? ?\d{3}[- ]?\d{3}[- ]?\d{3}$/;
  if (telephone !== null && regTelephone.test(telephone) === false) {
    $('.invalid_feedback').show();
    $('#telephone.form_input_field').css('margin-bottom', '5px');
  } else {
    $('.invalid_feedback').hide();
    $('#telephone.form_input_field').css('margin-bottom', '20px');
  }
} */


    
$('#add_my_schedules').on('click', () => {  
    $('.new_schedules_of_logged_user').show();
});

//$('input#telephone').on('blur', invalidFeedback);

// if field fill corect show the modal class="modal_content" and console log entered data in console
// po przeniesieniu button do wnętrza <form> zmienić on na submit i dodać event.preventDefault();
$('#button_register').on('click', () => {
  if (validateForm() === true) {
      $('#grayBox_form_register').on('submit', function (event){
        event.preventDefault();
      });
    
    //$('.modal').fadeIn(400);
  } else {
    alert('Please fill correct data');
  }
});

// if field fill incorrect nothing happens

// when click the btn (id ="button_fermer") hidde modal (class="modal_content")
/*$('#button_fermer').on('click', () => {
  $('.modal').fadeOut(300);
}); */