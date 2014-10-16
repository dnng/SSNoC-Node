var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var moment = require('moment');
var Memory = require('../models/MemoryRest');
var Performance = require('../models/PerformanceRest');

module.exports = function(_, io, participants, passport) {
  return {
    getMonitorPage: function(req, res) {
      res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
    },
    
    startPerformanceTest: function(req, res) {
    	Performance.startPerformanceTest(req.session.passport.user.user_name, req.body.testDurationInSecs, function(err, postsPerSecond, getsPerSecond) {
    		console.log("Back in controller with postsPerSecond:" + postsPerSecond );
            if (err)
              return res.redirect('/welcome');
            res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name, postsPerSecond: postsPerSecond, getsPerSecond : getsPerSecond});
       }); 
    },

    stopPerformanceTest: function(req, res) {
    	Performance.stopPerformanceTest(req.session.passport.user.user_name, function(err, messages) {
            if (err)
              return res.redirect('/welcome');
            res.render("monitor", {userId: req.session.userId, title:"Monitor", user_name:req.session.passport.user.user_name});
       }); 
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

