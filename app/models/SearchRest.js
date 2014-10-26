var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');


function Search(context, search_string, user_name, status, anouncement, public_message, private_message, sender_name, timestamp, location){
	  this.local = {
	    context : context, 
	    search_string : search_string,
	    user_name : user_name,
	    status : status,
	    announcement : announcement,
	    public_message : public_message,
	    private_message : private_message,
	    sender_name : sender_name,
	    timestamp : timestamp,
	    location : location  
	  };
	}

Search.remove_stop_words = function(stop_words_url, search_string, callback) {
	var stop_words = request(stop_words_url);
	//var stop_word_array = stop_words.split(",");
	//console.log("Stop words fetched: " + stop_word_array);
}

module.exports = Search;


/*User.saveNewUser = function(user_name, password, callback) {
	  var options = {
	    url : rest_api.post_new_user,
	    body : {userName: user_name, password: password},
	    json: true
	  };

	  request.post(options, function(err, res, body) {
	    if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode !== 200 && res.statusCode !== 201) {
	      callback(res.body, null);
	      return;
	    }
	    var new_user = new User(body.userName, password, undefined);
	    callback(null, new_user);
	    return;
	  });
	};*/