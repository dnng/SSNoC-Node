var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Analysis = require('../models/AnalysisRest');

module.exports = function(_, io, participants, passport) {
  return {
    getAnalysisPage: function(req, res) {
      res.render("analysis", {userId: req.session.userId, title:"Analysis", user_name:req.session.passport.user.user_name});
    },
    
    getUserClusters: function(req, res) {
    	var timeWindow = req.body.timeWindowInHours;
    	if (timeWindow == "")
    		timeWindow = 0;
    	console.log(timeWindow);
        Analysis.getUserClusters(timeWindow, function(err, clusters) {
            console.log("Clusters: " + clusters);
            if (err)
              return res.redirect('/welcome');
            res.render("analysis", {user_name: req.session.passport.user.user_name, clusters: clusters});
          });
        },
  };
};
