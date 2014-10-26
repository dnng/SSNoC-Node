var LocalStrategy = require('passport-local').Strategy;
var request = require('request');


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
		  
		  
		  //TO-DO: create a method to fetch and process the stopwords
		  //request('http://www.textfixer.com/resources/common-english-words.txt');
		  
		  var search_string = req.body.search_string;
		  console.log("Search string: " + search_string);		
		  return res.redirect('/welcome');
    }

  };
};


