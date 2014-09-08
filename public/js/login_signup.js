/**
 *  This is a utility function to validate user name
 *  and password fields on both Login and Signup pages.
 */
function validateUserNameAndPassword() {
  if($('#userName').val().trim() == "") {
    $('#alert').text('Please provide a username to continue');
    $('#alert').show();
    $('#passport_alert').remove();
    return false;
  }

  if( ($('#passwd').val().trim() == "")) {
    $('#alert').text("Please provide a password to continue");
    $('#alert').show();
    $('#passport_alert').remove();
    return false;
  }

  if( $('#passwdRe').val().trim() == "" ) {
    $('#alert').text("Please re-enter password to continue");
    $('#alert').show();
    $('#passport_alert').remove();
    return false;
  }

  if( $('#passwd').val() != $('#passwdRe').val() ) {
    $('#alert').text('Passwords do not match');
    $('#alert').show();
    $('#passport_alert').remove();
    return false;
  }

  return true;
}
