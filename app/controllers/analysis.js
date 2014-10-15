var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Analysis = require('../models/AnalysisRest');

module.exports = function(_, io, participants, passport) {
  return {
    getAnalysisPage: function(req, res) {
      res.render("analysis", {userId: req.session.userId, title:"Analysis", user_name:req.session.passport.user.user_name});
    },
    
  };
};
