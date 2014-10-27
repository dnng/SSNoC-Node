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
	//var stop_word_array = stop_words.split(",");
	//console.log("Stop words fetched: " + stop_word_array);
}

Search.getAllUsers = function(user_names, callback) {
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

///Public Message
Search.getAllMessages = function(public_message) {
	console.log("--------------------------------------------------------");
	console.log("---------------------In getAllmessages---------------------");
	console.log("--------------------------------------------------------");
	var search_results;
	console.log("Processing public_message:\n");
	console.log(public_message);
	if (typeof public_message != 'undefined') {
		// TO-DO check if Array.forEach works async
		public_message.forEach	(
			function(val, index, array) {
				console.log('\nval: '+val+ '\nindex: '+index +'\narray: '+array);
				console.log(index + ': ' + val);
			
				// fetch user details
				WallMessage.getAllMessages(
				function(err, wallMessage){
				//	if (messageid!==Null){
						console.log("fetched user details:wallMessage");
				//}
				}
				);
			}
		);
	} else {
		console.log("none found");
	}
}


//Private Message
Search.getAllChatMessagesBetweenUsers = function(private_message) {
	console.log("--------------------------------------------------------");
	console.log("---------------------In getAllPrivatemessages---------------------");
	console.log("--------------------------------------------------------");
	var search_results;
	console.log("Processing private_message:\n");
	console.log(private_message);
	if (typeof private_message != 'undefined') {
		// TO-DO check if Array.forEach works async
		private_message.forEach	(
			function(val, index, array) {
				console.log('\nval: '+val+ '\nindex: '+index +'\narray: '+array);
				console.log(index + ': ' + val);
			
				// fetch user details
				Chat.getAllChatMessagesBetweenUsers(
				author_name, target_name,function(err,chats) {
					if (author_name!==Null){
						console.log("fetched message details: " + chats);
				} 
				}
				);
			}
		);
	} else {
		console.log("none found");
	}
}
module.exports = Search;

process.argv.forEach(function(val, index, array) {
	console.log("------");
	console.log(index + ': ' + val);
});


