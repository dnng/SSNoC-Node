var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var User = require('../app/models/UserRest');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, {user_name: user.local.name});
  });

  passport.deserializeUser(function(user_info, done) {
    User.getUser(user_info.user_name, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField:'name',
    passwordField:'password',
    passReqToCallback : true
  },
  function(req, name, password, done) {
    process.nextTick(function() {
      User.saveNewUser(name, password, function(err, new_user) {
        if (err)
          return done(null, false, req.flash('signupMessage', 'Signup failed due to: ' + err));
        return done(null, new_user);
      });
    });
  }));
  passport.use('local-login', new LocalStrategy({
    usernameField : 'name',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, name, password, done) {
    User.getUser(name, function(err, user) {
      if (err){
        return done(err);
      }
      if (!user){
        return done(null, false, req.flash('loginMessage', 'User name not found'));
      }
      user.isValidPassword(password, function(isSuccessful){
        if (isSuccessful){
          return done(null, user);
        } else {
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password'));
        }
      });
    });
  }));
};
