function init() {
  function join() {
    var name = $('#name').val();
    $.ajax({
      url:  '/join',
      type: 'POST',
      dataType: 'json',
      data: {name: name}
    }).done(function(data){
      location.href="http://54.183.85.61:7777/";
    });
  }

  $('#signupBtn').click(function() {
    if( !validateUserNameAndPassword() ) {
      return false;
    }
  });
  $('#alert').hide();
}

$(document).on('ready', init);
