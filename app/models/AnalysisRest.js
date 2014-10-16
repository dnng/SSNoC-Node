var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Analysis(userNames){
	  this.local = {
	    userNames : userNames
	  };
	}

Analysis.getUserClusters = function(timeWindowInHours,callback) {
	
	request(rest_api.get_user_clusters + timeWindowInHours, {json:true}, function(err, res, body) {
	    if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode === 200) {
	      var clusters = body.map(function(item, idx, arr){
	        return new Analysis(item.userNames);
	      });
	      console.log(clusters);

	      callback(null, clusters);
	      return;
	    }
	    if (res.statusCode !== 200) {
	      callback(null, null);
	      return;
	    }
	  });

};


module.exports = Analysis;