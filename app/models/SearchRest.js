var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var User = require('../models/UserRest');
var async = require('async');
var WallMessage = require('../models/WallRest');
var Chat = require('../models/ChatRest');
var Announcement = require('../models/AnnouncementRest');

var stop_words = [ "a", "able", "about", "across", "after", "all", "almost",
		"also", "am", "among", "an", "and", "any", "are", "as", "at", "be",
		"because", "been", "but", "by", "can", "cannot", "could", "dear",
		"did", "do", "does", "either", "else", "ever", "every", "for", "from",
		"get", "got", "had", "has", "have", "he", "her", "hers", "him", "his",
		"how", "however", "i", "if", "in", "into", "is", "it", "its", "just",
		"least", "let", "like", "likely", "may", "me", "might", "most", "must",
		"my", "neither", "no", "nor", "not", "of", "off", "often", "on",
		"only", "or", "other", "our", "own", "rather", "said", "say", "says",
		"she", "should", "since", "so", "some", "than", "that", "the", "their",
		"them", "then", "there", "these", "they", "this", "tis", "to", "too",
		"twas", "us", "wants", "was", "we", "were", "what", "when", "where",
		"which", "while", "who", "whom", "why", "will", "with", "would", "yet",
		"you", "your" ];

function Search(context, search_string, user_name, status, anouncement,
		public_message, private_message, sender_name, timestamp, location) {
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

function status_to_process(token, flag) {
	this.local = {
		token : token,
		enabled : flag
	};
}

Search.strip_stop_words = function(search_tokens, callback) {
	console.log("Processing search tokens: " + search_tokens);
	var filtered_search_tokens = [];
	search_tokens.forEach(function(val, index, array) {
		if (stop_words.indexOf(val) < 0)
			filtered_search_tokens.push(val);
	});

	console.log("Filtered search tokens: " + filtered_search_tokens);
	callback(filtered_search_tokens);
}

Search.getAllUsers = function(search_tokens, callback) {
	console.log("Processing statuses:\n");
	// remove status strings from search tokens and store in  
	var user_names = [];
		
	var ok_status = false;
	var help_status = false;
	var emergency_status = false;

	var status_tokens = {};
	search_tokens.forEach(function(element, index, array) {
		switch (element) {
		case 'OK':				
		case 'HELP':				
		case 'EMERGENCY':
			status_tokens[element] = true;
			break;
		default:
			user_names.push(element);		
		}
	});

	var users = [];
	console.log("Fetching status messages");
	WallMessage.getAllMessages(function(err, messages) {
        console.log("STATUS MESSAGES: " + messages);
        messages.forEach(function(element, index, array){
        	console.log("Searching " + element["local"]["content"] + " " + status_tokens[element["local"]["content"]]);
        	if (status_tokens[element["local"]["content"]]) {
        		users.push(element);
        		}
        	});
         search_people(user_names, users, callback);        
        });

}

function search_people(user_names, users, callback) {
	console.log("Processing user names:\n");

	if (typeof user_names != 'undefined') {

		var search_operation = [];
		user_names.forEach(function(val, index, array) {
			search_operation.push(function(callback) {
				User.getUser(val,
						function(err, user) {
							if (user !== null) {
								console.log("fetched user details: "
										+ user.local.name);
							}
							callback(null, user);
						});
			});
		});

		async.parallel(search_operation, function(error, results) {
			
			console.log("Got " + results.length + " user results");
			for (var i = 0; i < results.length; i++) {
				if (results[i]) {
					users.push(results[i]);
				}
			}
			callback(null, users);
		});
	} else {
		console.log("none found");
	}
}

///Public Message
Search.getAllMessages = function(filtered_search_tokens, callback) {
	var search_results = [];
	if (filtered_search_tokens.length < 1) {
		//no search results
		callback(search_results);
	}

	WallMessage.getAllMessages(function(err, public_message) {
				console
						.log("--------------------------------------------------------");
				console
						.log("---------------------In getAllmessages---------------------");
				console
						.log("--------------------------------------------------------");
				if (err) {
					return res.redirect('/welcome');
				}
				public_message.forEach(function(public_message) {
					for (i = 0; i < filtered_search_tokens.length; i++) {
						if (public_message.local.content
								.indexOf(filtered_search_tokens[i]) > -1) {
							search_results.push(public_message);
							break;
						}
					}
				});
				console.log("Search Results::Search::"
						+ JSON.stringify(search_results));
				callback(search_results);
			});
}

//Private Message
Search.getAllChatMessagesBetweenUsers = function(author_name, target_name, filtered_search_tokens,
		callback) {
	var message_results = [];
	if (filtered_search_tokens.length < 1) {
		//no search results
		callback(message_results);
	}

	Chat.getAllChatMessagesBetweenUsers(author_name, target_name, function(err, private_message) {
				console
						.log("--------------------------------------------------------");
				console
						.log("---------------------In getAllPrivateMessages---------------------");
				console
						.log("--------------------------------------------------------");
				if (err) {
					return res.redirect('/welcome');
				}
				private_message.forEach(function(private_message) {
					for (i = 0; i < filtered_search_tokens.length; i++) {
						if (private_message.local.content
								.indexOf(filtered_search_tokens[i]) > -1) {
							message_results.push(private_message);
							break;
						}
					}
				});
				console.log("Search Results::Search::"
						+ JSON.stringify(message_results));
				callback(message_results);
			});
}

///Announcements
Search.searchAllAnnouncements = function(filtered_search_tokens, callback) {
	var announcement_results = [];
	if (filtered_search_tokens.length < 1) {
		//no search results
		callback(announcement_results);
	}

	//pull out all announcements and filter them
	Announcement.getAllAnnouncements(function(err, announcements) {
		console.log("ANNOUNCEMENTS: " + announcements);
		if (err) {
			return res.redirect('/welcome');
		}

		announcements.forEach(function(announcement) {
			for (i = 0; i < filtered_search_tokens.length; i++) {
				if (announcement.local.content
						.indexOf(filtered_search_tokens[i]) > -1) {
					announcement_results.push(announcement);
					break;
				}
			}
		});
		console.log("Search Results::Announcements::"
				+ JSON.stringify(announcement_results));
		callback(announcement_results);
	});
}

module.exports = Search;

process.argv.forEach(function(val, index, array) {
	console.log("------");
	console.log(index + ': ' + val);
});
