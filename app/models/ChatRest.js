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
Chat.sendMessage = function(author_name, target_name, content, callback) {
  console.log("Sending message from " + author_name + " to " + target_name);
  var options = {
    url: rest_api.send_message + this.local.name + "/" + this.local.name,
    body: {
      author_name : author_name,
      target_name : target_name,
      content     : content
    },
    json: true
  };

  request.post(options, function (err, res, body) {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      console.log(res.body);
      callback(res.body, null);
      return;
    }
    /*
     * TODO: Populate new Chat(body.this, body.that, ...)
     */
    var new_chat = new Chat();
    callback(null, new_status);
    return;
  });
};

/*
 * Retrieve all chat messages between two users
 */
Chat.getAllChatMessagesBetweenUsers = function(author_name, target_name, callback) {
  request(rest_api.get_all_msgs_between_users + author_name + "/" + target_name, {json: true}, function (err, res, body) {
    if (err) {
      callback(err, null);
      return;
    }
    if (res.statusCode === 200) {
      var chat_messages = body.map(function (item, idx, arr) {
        return new Chat(item.author_name, item.target_name, item.message_id, item.posted_at, item.content);
      });

      console.log("@@@@@ in Chat.getAllChatMessagesBetweenUsers succeed:" + JSON.stringify(chat_messages));
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
Chat.getChatBuddies = function(){
  request(rest_api.get_chat_buddies + this.local.name + "/chatbuddies", {json: true}, function (err, res, body) {
    if (err) {
      callback(err, null);
      return;
    }
    if (res.statusCode === 200) {
      var statuses = body.map(function (item, idx, arr) {
        /*
         * TODO: Figure it out what should be returned here
         */
        return new Chat();
      });

      console.log("@@@@@ in Chat.getChatBuddies succeed:" + JSON.stringify(statuses));
      callback(null, statuses);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

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
