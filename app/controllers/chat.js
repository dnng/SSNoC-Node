var LocalStrategy = require('passport-local').Strategy;
var request       = require('request');
var Chat          = require('../models/ChatRest');

module.exports = function(_, io, participants, passport) {
  return {
    getAllMessages: function (req, res) {
      var user_name1 = req.session.passport.user.user_name;
      var user_name2 = req.session.passport.user.user_name;
      Chat.getAllChatMessagesBetweenUsers(user_name1, user_name2, function (err, user) {
        if (user !== null) {
          res.json(200, {name: user.local.name});
        }
        res.render("")
      });
    },
    getStatuses: function (req, res) {
      Status.getAllStatuses(function (err, statuses) {
        console.log(statuses);
        if (err)
          return res.redirect('/welcome');
        res.render("wall", {userId: req.session.userId, title: "Statuses", user_name: req.session.passport.user.user_name, statuses: statuses});
      });
    }
  };
};

