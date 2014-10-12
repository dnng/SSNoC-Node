var bcrypt   = require('bcrypt-nodejs');
var request  = require('request');
var rest_api = require('../../config/rest_api');

function Chat(author_name, target_name, message_id, posted_at, content) {
  this.local = {
    author_name : author_name,
    target_name : target_name,
    message_id  : message_id,
    posted_at   : posted_at,
    content     : content
  };
}

/*
 * TODO: Implement sendMessage
 * Send a chat message to another user
 */
Chat.sendMessage = function(){};

/*
 * Retrieve all chat messages between two users
 */
Chat.getAllChatMessagesBetweenUsers = function() {
  /*
   * TODO: The URI should be composed of /messages/author_name/target_name
   * Since we still don't have an UI definition, we are using this.local.name twice.
   * WARNING: Need to revisit this!
   */
  request.post(rest_api.get_all_msgs_between_users + this.local.name + "/" + this.body.name, {json: true}, function (err, res, body) {
    if (err) {
      callback(err, null);
      return;
    }
    if (res.statusCode === 200) {
      var chat_messages = body.map(function (item, idx, arr) {
        return new Chat(item.author_name, item.target_name, item.message_id, item.posted_at, item.content);
      });

      console.log("@@@@@ in Chat.getAllChatMessagesBetweenUsers succeed :" + JSON.stringify(chat_messages));
      callback(null, chat_messages);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

/*
 * TODO: Implement getChats
 * Retrieve all users with whom a user has chatted with
 */
Chat.getChats    = function(){};

/*
 *  User.generateHash = function(password) {
 *  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
 *  };
 *
 * User.prototype.isValidPassword = function(password, callback) {
 *   request.post(rest_api.is_password_valid + this.local.name + '/authenticate', {json:true, body:{password:password}}, function(err, res, body) {
 *     if (err || res.statusCode !== 200){
 *       callback(false);
 *       return;
 *     }
 *
 *     callback(true);
 *   });
 * };
 *
 * User.getUser = function(user_name, callback) {
 *   request(rest_api.get_user + user_name, {json:true}, function(err, res, body) {
 *     if (err){
 *       callback(err,null);
 *       return;
 *     }
 *     if (res.statusCode === 200) {
 *       var user = new User(body.userName, body.password);
 *       callback(null, user);
 *       return;
 *     }
 *     if (res.statusCode !== 200) {
 *       callback(null, null);
 *       return;
 *     }
 *   });
 * };
 *
 * User.getAllUsers = function(callback) {
 *   request(rest_api.get_all_users, {json:true}, function(err, res, body) {
 *     if (err){
 *       callback(err,null);
 *       return;
 *     }
 *     if (res.statusCode === 200) {
 *       var users = body.map(function(item, idx, arr){
 *         return new User(item.userName, item.password);
 *       });
 *
 *       users.sort(function(a,b) {
 *         return a.userName < b.userName;
 *       });
 *
 *       console.log("@@@@@ in User.getAllUser succeed users :" + JSON.stringify(users));
 *       callback(null, users);
 *       return;
 *     }
 *     if (res.statusCode !== 200) {
 *       callback(null, null);
 *       return;
 *     }
 *   });
 * };
 *
 * User.saveNewUser = function(user_name, password, callback) {
 *   var options = {
 *     url : rest_api.post_new_user,
 *     body : {userName: user_name, password: password},
 *     json: true
 *   };
 *
 *   request.post(options, function(err, res, body) {
 *     if (err){
 *       callback(err,null);
 *       return;
 *     }
 *     if (res.statusCode !== 200 && res.statusCode !== 201) {
 *       callback(res.body, null);
 *       return;
 *     }
 *     var new_user = new User(body.userName, password, undefined);
 *     callback(null, new_user);
 *     return;
 *   });
 * };
 */

module.exports = Chat;
