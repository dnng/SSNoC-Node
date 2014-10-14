var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Monitor = require('../models/MonitorRest');

module.exports = function(_, io, participants, passport) {
  return {
    getMonitorPage: function(req, res) {
      res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
    },

    postStatusUpdate: function(req, res, next) {
      Status.saveNewStatus(req.session.passport.user.user_name, req.body.status, req.body.location, function(err, new_user) {
        if (err)
          return res.redirect('/welcome');
        return res.redirect('/wall');
      });
      }
  };
};

