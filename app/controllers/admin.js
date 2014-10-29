var LocalStrategy = require('passport-local').Strategy;
var User   = require('../models/UserRest');
var request       = require('request');

module.exports = function(_, io, participants, passport) {
  return {
	getAdminPage: function(req, res) {
        User.getAllUsers(function(err, users) {
        console.log("USERS: " + users);
        if (err)
          return res.redirect('/welcome');
        res.render("admin", {userId: req.session.userId, title:"Users", user_name:req.session.passport.user.user_name, users: users});
        });
    },
    
    getUser: function(req, res, next) {
        User.getUser(req.session.passport.user.user_name, function(err, user) {
          if (err)
            return res.redirect('/welcome');
          res.render("admin", {userId: req.session.userId, title:"Users", user_name:req.session.passport.user.user_name, user_details: user});
        });
      },

    updateUser: function(req, res, next) {
        User.updateUser(req.body.existing_user, req.body.user_name, req.body.password, req.body.privilege_level, req.body.account_status, function(err, updated_user) {
          if (err)
          {
        	  console.log(err);
        	  return res.redirect('/welcome');
          }
          return res.redirect('/admin');
        });
     }
  };
};
