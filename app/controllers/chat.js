var LocalStrategy = require('passport-local').Strategy;
var request       = require('request');
var Chat          = require('../models/ChatRest');
var url           = require('url');

module.exports = function(_, io, participants, passport) {
  return {
    getAllMessages: function (req, res) {
      console.log("REQUEST1: " + req.param("author_name") + req.param("target_name"));
      var author_name = req.param("author_name");
      var target_name = req.param("target_name");
      console.log("REQUEST2: " + author_name + target_name);
      Chat.getAllChatMessagesBetweenUsers(author_name, target_name, function (err, chats) {
        if (chats == null) {
          res.json(200, {author_name: author_name, target_name: target_name});
        }
        res.render("chat", {userId: req.session.userId, title: "Chats", author_name: author_name, target_name : target_name, chats: chats});
      });
    },
    
    sendMessage: function(req, res, next) {
    	Chat.sendMessage(req.body.author_name, req.body.target_name, req.body.message, function (err, chats) {
          if (err)
          {
        	  console.log(err);
        	  return res.redirect('/welcome');
          }
          var backURL=req.header('Referer')
          return res.redirect(backURL);
        });
     }
  };
};

