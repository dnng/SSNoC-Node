var LocalStrategy = require('passport-local').Strategy;
var request       = require('request');
var Chat          = require('../models/ChatRest');

module.exports = function(_, io, participants, passport) {
  return {
    getAllMessages: function (req, res) {
      var user_name1 = req.session.passport.user.user_name;
      var user_name2 = req.session.passport.user.user_name;
      Chat.getAllChatMessagesBetweenUsers(user_name1, user_name2, function (err, chats) {
    	console.log(chats);
        if (chats !== null) {
          res.json(200, {name: user.local.name});
        }
        res.render("chat", {userId: req.session.userId, title: "Chats", user_name: req.session.passport.user.user_name, chats: chats});
      });
    },
    getStatuses: function (req, res) {
      Status.getAllStatuses(function (err, chats) {
        console.log(chats);
        if (err)
          return res.redirect('/welcome');
        res.render("chat", {userId: req.session.userId, title: "Chats", user_name: req.session.passport.user.user_name, chats: chats});
      });
    }
  };
};

