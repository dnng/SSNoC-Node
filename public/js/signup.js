function init() {
  function join() {
    var name = $('#name').val();
    $.ajax({
      url:  '/join',
      type: 'POST',
      dataType: 'json',
      data: {name: name}
    }).done(function(data){
      location.href="http://localhost:7777/";
    });
  }

  $('#signupBtn').click(function() {
    if( !validateUserNameAndPassword() ) {
      return false;
    }


    return true;
  });

  $('#alert').hide();
}

$(document).on('ready', init);
