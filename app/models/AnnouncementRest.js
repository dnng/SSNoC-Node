var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Announcement(message_id, author, content, location, postedAt){
	  this.local = {
	    message_id : message_id,
	    author : author,
	    content : content,
	    location : location,
	    postedAt : postedAt
	  };
	}

Announcement.getAllAnnouncements = function(callback) {
	  request(rest_api.get_all_announcements, {json:true}, function(err, res, body) {
	    if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode === 200) {
	      var announcements = body.map(function(item, idx, arr){
	        return new Announcement(item.messageId, item.author, item.content, item.location, item.postedAt);
	      });

	      console.log("@@@@@ in Announcement.getAllAnnouncements succeed announcements :" + JSON.stringify(announcements));
	      callback(null, announcements);
	      return;
	    }
	    if (res.statusCode !== 200) {
	      callback(null, null);
	      return;
	    }
	  });
	};

Announcement.saveNewAnnouncement = function(author, content, location, callback) {
	  console.log("inside save new announcement method with " + author + " " + content + " " + location);
	  var options = {
	    url : rest_api.post_new_announcement,
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
	    var new_announcement = new Announcement(body.messageId, body.author, body.content, body.status, body.location, body.postAt);
	    callback(null, new_announcement);
	    return;
	  });
	};

module.exports = Announcement;

