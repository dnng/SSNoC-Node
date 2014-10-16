var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Clusters(clusteruser_id){
	  this.local = {
        clusteruser_id : clusteruser_id
	  };
	}

Clusters.getUserClusters = function(timeWindow,callback) {
	  request(rest_api.get_user_clusters(timeWindow), {json:true}, function(err, res, body) {
		rest_api.get_user_clusters = function(timeWindow){
			return host_url + '/usergroups/unconnected/' + timeWindow;
			}
		  if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode === 200) {
	      var userClusters = body.map(function(item, idx, arr){
	        return new Clusters(item.clusteruserId);
	      });

	      console.log("@@@@@ in Status.getUserClusters succeed statuses :" + JSON.stringify(wallMessages));
	      callback(null, userClusters);
	      return;
	    }
	    if (res.statusCode !== 200) {
	      callback(null, null);
	      return;
	    }
	  });
	};
