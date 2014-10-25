var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Status = require('../models/StatusRest');

module.exports = function(_, io, participants, passport) {
  return {
	  performSearch: function(req, res) {
		  console.log("Search in: " + req.param("search") + req.param("context"));
    }

  };
};

