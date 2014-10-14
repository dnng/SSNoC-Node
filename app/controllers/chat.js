var LocalStrategy = require('passport-local').Strategy;
var request       = require('request');
var Chat          = require('../models/ChatRest');
var url           = require('url');

module.exports = function(_, io, participants, passport) {
  return {
    getAllMessages: function (req, res) {
      var url_parts  = url.parse(req.url, true);
      var query      = url_parts.query;
      var author_name = query.author_name;
      var target_name = query.target_name;
      console.log("app.controllers.chat: DEBUG :");
      console.log(query);
      console.log(author_name);
      console.log(target_name);
      Chat.getAllChatMessagesBetweenUsers(author_name, target_name, function (err, chats) {
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

