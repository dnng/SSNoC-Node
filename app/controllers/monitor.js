var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Monitor = require('../models/MonitorRest');

module.exports = function(_, io, participants, passport) {
  return {
    getMonitorPage: function(req, res) {
      res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
    },
    
    startPerfTest: function(req, res) {
      res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
    },

    stopPerfTest: function(req, res) {
      res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
    }
  };
};

