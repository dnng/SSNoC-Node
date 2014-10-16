var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Clusters(timeWindow, userClusters){
	  this.local = {
        timeWindow : timeWindow,
	    userClusters : userClusters
	  };
	}

Clusters.getUserClusters = function(timeWindow,callback) {
	  request(rest_api.get_user_clusters, {json:true, body:{timeWindow:timeWindow}}, function(err, res, body) {
        if (err){
          callback(err,null);
          return;
        }
	    if (res.statusCode === 200) {
		  var clusters = new Clusters(body.userClusters, body.timeWindow);
		  callback(null, clusters);
		  return;
	    }
		if (res.statusCode !== 200) {
		  callback(null, null);
		  return;
	        	}
	          });
	        };


