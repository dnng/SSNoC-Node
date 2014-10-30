var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var User = require('../models/UserRest');
var async = require('async');

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

Search.remove_stop_words = function(stop_words_url, search_string) {
	var stop_words = request(stop_words_url);
	var stop_word_array = stop_words.split(",");
	console.log("Stop words fetched: " + stop_word_array);
}

function status_to_process(token, flag){
	this.local = {
			token : token,
			enabled : flag
	};
}

Search.getAllUsers = function(search_tokens, callback) {
	console.log("Processing statuses:\n");
	// remove status strings from search tokens and store in  
	var user_names = [];
	
	//To-DO use a map instead
	var ok_status = false;
	var help_status = false;
	var emergency_status = false;
	
	var status_tokens = new status_to_process(token, flag);
	search_tokens.forEach(function(token, index, array) {
		switch (token) {
			case 'OK':				
			case 'Help':				
			case 'Emergency':
				// ??
				status_tokens.put(token, true);
				break;
			default:
				user_names.push(token);		
		}
	});
	
	// process the statuses
	Object.keys(status_tokens).forEach(function(key) {
		  var val = status_tokens[key];
		  console.log ("Statuses to process: " + val);
		});
	
	
	
	console.log("Processing user names:\n");

	if(typeof user_names != 'undefined') {

		var search_operation = [];
		user_names.forEach(function(val, index, array) {
			search_operation.push(function (callback) {
				User.getUser(val, function(err, user) {
					if (user !== null) {
						console.log("fetched user details: " + user.local.name);
					}
					callback(null, user);
				});
			});
		});

		async.parallel(search_operation, function (error, results) {
			var users = [];
			for (var i =0; i < results.length; i++) {
				if (results[i]) {
					users.push(results[i]);
				}
			}
			callback(null, users);
		});
	}
	else {
		console.log("none found");
	}
}

module.exports = Search;

