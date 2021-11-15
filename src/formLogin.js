$('.register').hide();

$('p').first().on('click', () => {
  $('.register').slideToggle('normal');
});
