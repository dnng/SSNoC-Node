var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Memory = require('../models/MemoryRest');

module.exports = function(_, io, participants, passport) {
  return {
    getMonitorPage: function(req, res) {
      res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
    },
    
    startPerformanceTest: function(req, res) {
        res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
    },

    stopPerformanceTest: function(req, res) {
        res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
    }, 
    
    startMemoryTest: function(req, res) {
    	Memory.startMemoryTest(req.session.passport.user.user_name, function(err, messages) {
            if (err)
              return res.redirect('/welcome');
            res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
       }); 
    },

    stopMemoryTest: function(req, res) {
    	Memory.stopMemoryTestAndReturnMemories(req.session.passport.user.user_name, function(err, memories) {
            console.log("MEMORY CRUMBS: " + memories);
            if (err)
              return res.redirect('/welcome');
            res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name, memories: memories});
       });
    } 
    
  };
};

