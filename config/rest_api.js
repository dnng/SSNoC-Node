var host_url = "http://localhost:8080/ssnoc";

module.exports = {
  'get_all_users' : host_url + '/users',
  'is_password_valid' : host_url + '/user/',
  'get_user' : host_url + '/user/',
  'post_new_user' : host_url + '/user/signup'
};
