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
  var date = new Date();
  //var current_hour = date.getHours();
  var options = {
    url: rest_api.send_message + author_name + "/" + target_name,
    body: {
      author_name : author_name,
      target_name : target_name,
      posted_at   : date,
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

module.exports = Chat;
