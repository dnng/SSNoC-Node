var LocalStrategy = require('passport-local').Strategy;
var WallMessage   = require('../models/WallRest');
var request       = require('request');
var Status        = require('../models/StatusRest');

module.exports = function(_, io, participants, passport) {
  return {
	getAllWallMessages: function(req, res) {
        WallMessage.getAllWallMessages(function(err, messages) {
        console.log("MESSAGES: " + messages);
        if (err)
          return res.redirect('/welcome');
        res.render("wall", {userId: req.session.userId, title:"Messages", user_name:req.session.passport.user.user_name, messages: messages});
      });
    },
    
    postStatusMessage: function(req, res, next) {
        Status.saveNewStatus(req.session.passport.user.user_name, req.body.message, req.body.status, req.body.location, function(err, new_user) {
          if (err)
          {
        	  console.log(err);
        	  return res.redirect('/welcome');
          }
          return res.redirect('/wall');
        });
     },

    postWallMessage: function(req, res, next) {
        WallMessage.saveNewWallMessage(req.session.passport.user.user_name, req.body.content, req.body.status, req.body.location, function(err, new_user) {
          if (err)
          {
        	  console.log(err);
        	  return res.redirect('/welcome');
          }
          return res.redirect('/wall');
        });
     }
  };
};

