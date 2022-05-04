$('.new_schedules_of_logged_user').hide();

// $('#add_my_schedules').on('click', () => {
//   $('.new_schedules_of_logged_user').fadeIn(300);
// });

$('#add_my_schedules').first().click(() => {
  $('.new_schedules_of_logged_user').slideToggle('normal');
});
// $( "button" ).last().click(function() {
// $( '.new_schedules_of_logged_user' ).last().fadeToggle( "fast");
// , function() {$( "#log" ).append( "<div>finished</div>" );
// });
// });
