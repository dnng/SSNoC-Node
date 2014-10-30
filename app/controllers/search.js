var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Search = require('../models/SearchRest');

module.exports = function(_, io, participants, passport) {
  return {
	  getResultsPage: function(req, res) {
		  console.log("Search Results: ");
		  res.render("analysis", {userId: req.session.userId, title:"Analysis", user_name:req.session.passport.user.user_name});		  
	  },
	  
	  performSearch: function(req, res) {
		  console.log("Search request: " + req.param("search_string") + " in " + req.param("context") + " by " + req.session.passport.user.user_name);
		  var context = req.body.context;
		  console.log("Context: " + context);
		  		  	   
		  var search_string = req.body.search_string;
		  console.log("Search string: " + search_string);
		 
		  // TO-DO: fill in details for stop words
		  Search.remove_stop_words('http://www.textfixer.com/resources/common-english-words.txt', search_string, res.redirect('/wall'));
		  //TO-DO: handle spaces better
		  var search_tokens = search_string.split(/[\s+,]+/);
		  search_tokens.forEach(function(val, index, array) {
			  	val.trim();
				console.log(index + ': ' + val);
			})
		  console.log ("search tokens: " + search_tokens);
		  
		  console.log("context: " + context);
		  switch (context) {
		  case 'Messages':
			  console.log("*****List of public messages");
			  Search.getAllMessages(search_tokens);
			  break;
		  case 'Directory':
			  console.log("*****List of Citizens");
			  Search.getAllUsers(search_tokens);
			  break;
		  case 'Chats':
			  console.log("*****List of private messages");
			  Search.getAllChatMessagesBetweenUsers(search_tokens);
			  break;
		  case 'Monitor':
			  console.log("*****Monitor - noop");
			  break;
		  case 'Analysis':
			  console.log("******Analysis - noop");
			  break;		  
		  }
		  return res.redirect('/welcome');
		  
    }

  };
};


