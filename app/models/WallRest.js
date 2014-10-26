var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function WallMessage(message_id, author, content, status, location, postedAt){
  this.local = {
    message_id : message_id,
    author : author,
    content : content,
    status : status,
    location : location,
    postedAt : postedAt
  };
}

WallMessage.getAllWallMessages = function(callback) {
  request(rest_api.get_all_wall_messages, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var wallMessages = body.map(function(item, idx, arr){
        return new WallMessage(item.messageId, item.author, item.content, item.status, item.location, item.postedAt);
      });

      console.log("@@@@@ in WallMessage.getAllWallMessages succeed messages :" + JSON.stringify(wallMessages));
      callback(null, wallMessages);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};


WallMessage.getAllMessages = function(callback) {
	  request(rest_api.get_all_wall_status_messages, {json:true}, function(err, res, body) {
	    if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode === 200) {
	      var wallMessages = body.map(function(item, idx, arr){
	        return new WallMessage(item.messageId, item.author, item.content, item.status, item.location, item.postedAt);
	      });

	      console.log("@@@@@ in WallMessage.getAllMessages succeed messages :" + JSON.stringify(wallMessages));
	      callback(null, wallMessages);
	      return;
	    }
	    if (res.statusCode !== 200) {
	      callback(null, null);
	      return;
	    }
	  });
	};


WallMessage.saveNewWallMessage = function(author, content, location, callback) {
  console.log("inside save new wall message method with " + author + " " + content + " " + location);
  var options = {
    url : rest_api.post_new_wall_message + author,
    body : {author: author, content: content, location: location},
    json: true
  };

  request.post(options, function(err, res, body) {
    if (err){
      console.log(err);
      callback(err,null);
      return;
    }
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      console.log(res.body);
      callback(res.body, null);
      return;
    }
    var new_wall_message = new WallMessage(body.messageId, body.author, body.content, body.status, body.location, body.postAt);
    callback(null, new_wall_message);
    return;
  });
};

module.exports = WallMessage;

