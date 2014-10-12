var LocalStrategy = require('passport-local').Strategy;
var request       = require('request');
var Status        = require('../models/StatusRest');

module.exports = function(_, io, participants, passport) {
  return {
    getStatuses: function(req, res) {
      Status.getAllStatuses(function(err, statuses) {
        console.log(statuses);
        if (err)
          return res.redirect('/welcome');
        res.render("wall", {userId: req.session.userId, title:"Statuses", user_name:req.session.passport.user.user_name, statuses: statuses});
      });
    }
  };
};

