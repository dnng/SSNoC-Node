var LocalStrategy = require('passport-local').Strategy;
var WallMessage   = require('../models/WallRest');
var request       = require('request');
var Status        = require('../models/StatusRest');

module.exports = function(_, io, participants, passport) {
  return {
    getStatuses: function(req, res) {
        WallMessage.getAllWallMessage(function(err, statuses) {
        console.log(statuses);
        if (err)
          return res.redirect('/welcome');
        res.render("wall", {userId: req.session.userId, title:"Statuses", user_name:req.session.passport.user.user_name, statuses: statuses});
      });
    },

    postWallUpdate: function(req, res, next) {
        WallMessage.saveNewWallMessage(req.session.passport.user.user_name, req.body.message, req.body.status, req.body.location, function(err, new_user) {
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

