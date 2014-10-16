var host_url = "http://localhost:1234/ssnoc";

module.exports = {
  'get_all_users'                  : host_url + '/users',
  'is_password_valid'              : host_url + '/user/',
  'get_user'                       : host_url + '/user/',
  'post_new_user'                  : host_url + '/user/signup',
  'post_new_status'                : host_url + '/status/new',
  'get_all_statuses'               : host_url + '/status',
  'get_all_wall_messages'          : host_url + '/messages/wall',
  'get_all_wall_status_messages'   : host_url + '/messages/wallstatus',
  'post_new_wall_message'          : host_url + '/message/',
  'send_message'                   : host_url + '/message/',
  'get_all_msgs_between_users'     : host_url + '/messages/',
  'get_chat_buddies'               : host_url + '/message/',
  'get_user_clusters'              : host_url + '/usergroups/unconnected',
  'post_start_mem_test'            : host_url + '/memory/start',
  'post_stop_mem_test'             : host_url + '/memory/stop',
  'get_all_memory_crumbs_24hr'     : host_url + '/memory',
  'get_all_memory_crumbs_1hr'      : host_url + '/memory/interval/1'
};
