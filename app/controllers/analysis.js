var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Analysis = require('../models/AnalysisRest');
var Clusters = require('../models/AnalysisRest');

module.exports = function(_, io, participants, passport) {
  return {
    getAnalysisPage: function(req, res) {
      res.render("analysis", {userId: req.session.userId, title:"Analysis", user_name:req.session.passport.user.user_name});
    },
    
    getUserClusters: function(req, res) {
        Clusters.getUserClusters(function(err, clusternames) {
            console.log("Clusternames: " + clusternames);
            if (err)
              return res.redirect('/welcome');
            res.render("analysis", {req.session.passport.user.user_name});
          });
        },
  };
};
