var host_url = "http://localhost:8080/ssnoc";

module.exports = {
  'get_all_users'              : host_url + '/users',
  'is_password_valid'          : host_url + '/user/',
  'get_user'                   : host_url + '/user/',
  'post_new_user'              : host_url + '/user/signup',
  'post_new_status'            : host_url + '/status/new',
  'get_all_statuses'           : host_url + '/statuses',
  'post_new_wallmessage'       : host_url + '/wall'
  'send_message'               : host_url + '/message/',
  'get_all_msgs_between_users' : host_url + '/message/',
  'get_chat_buddies'           : host_url + '/message/',
};
