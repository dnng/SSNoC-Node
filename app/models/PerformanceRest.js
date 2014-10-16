var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var moment = require('moment');
var rest_api = require('../../config/rest_api');
var WallMessage = require('../models/WallRest');
var post_request_limit = 100;
var isPerfTestRunning = false;
var postsCount = 0;
var getsCount = 0;
var testPostStartTime;
var testGetStartTime;
var testPostEndTime;
var testGetEndTime;
var postsPerSecond;
var getsPerSecond;
var posts_elapsed_time_in_secs;
var gets_elapsed_time_in_secs;


function Performance(testDurationInSecs, requestedAt, startedAt, endedAt, getsPerSecond, postsPerSecond){
  this.local = {
		  testDurationInSecs : testDurationInSecs,
		  requestedAt : requestedAt,
		  startedAt : startedAt,
		  endedAt : endedAt,
		  getsPerSecond : getsPerSecond,
		  postsPerSecond : postsPerSecond
  };
}

Performance.startPerformanceTest = function(user_name, testDurationInSecs, callback) {
	  var runs = [];
	  var x = 0;
	  var author = "lloyd";
      var content = "12345678901234567890";
      var location = "NASA";
	  while(x < post_request_limit)
	  {
		  runs.push(x++);
	  }
	  posts_elapsed_time_in_secs = 0;
	  gets_elapsed_time_in_secs = 0;
	  testPostStartTime
	  testGetStartTime
	  testPostEndTime
	  testGetEndTime
	  
	  
	  function kickoff() {
	      console.log('Starting');
	      isPerfTestRunning = true;
	      testStartTime = moment();
	      postsCount=0;
	      getsCount=0;
	      request.post(rest_api.post_setup_perf_test, {json: true});
	  }
	  
	  function kickoffPost() {
	      console.log('Starting Posts');
	      testPostStartTime = moment();
	  }
	  
	  function kickoffGet() {
	      console.log('Starting Gets');
	      testGetStartTime = moment();
	  }

	  function bodysyncposts(arg) {

	      var options = {
	          url: rest_api.post_new_wall_message + author,
	          body: {
	              author: author,
	              content: content,
	              location: location
	          },
	          json: true
	      };

	      posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
	      console.log(moment() + "Elapsed time before test post#" + arg + ", " + posts_elapsed_time_in_secs);

	      request.post(options);
	      
	      posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
	      console.log(moment() + "Elapsed time after test post#" + arg + ", " + posts_elapsed_time_in_secs);
	  }
	  
	  function bodysyncgets(arg) {
	      gets_elapsed_time_in_secs = moment().diff(testGetStartTime) / 1000;
	      console.log(moment() + "Elapsed time before test get#" + arg + ", " + gets_elapsed_time_in_secs);

	      request(rest_api.get_all_wall_status_messages, {json:true});
	      
	      gets_elapsed_time_in_secs = moment().diff(testGetStartTime) / 1000;
	      console.log(moment() + "Elapsed time after test get#" + arg + ", " + gets_elapsed_time_in_secs);
	  }
	  
	  function finalPost(totalCount) {
		  posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
          postsPerSecond = totalCount / posts_elapsed_time_in_secs
          console.log('Done: Posts Elapsed Time=' + posts_elapsed_time_in_secs + ', PostsPerSec=' + postsPerSecond);
	  }
	  
	  function finalGet(totalCount) {
		  gets_elapsed_time_in_secs = moment().diff(testGetStartTime) / 1000;
          getsPerSecond = totalCount / gets_elapsed_time_in_secs
          console.log('Done: Gets Elapsed Time=' + gets_elapsed_time_in_secs + ', GetsPerSec=' + getsPerSecond);
	  }

	  function final() {
	      request.post(rest_api.post_teardown_perf_test, {json: true});
	      
	      callback(null, postsPerSecond, getsPerSecond);
	      return;
	  }



	  //synchronous
	  //setup
	  kickoff();
	  
	  //testing posts
	  kickoffPost();
	  
	  runs.forEach(function(run) {
	      if(isPerfTestRunning)
	    	  bodysyncposts(run);
	      
	      postsCount++;
	      
	      if (posts_elapsed_time_in_secs > testDurationInSecs) {
	    	  isPerfTestRunning = false;
	      }
	  });
	  
	  finalPost(postsCount);
	  
	  //testing gets
	  kickoffGet();
	  
	  runs.forEach(function(run) {
	      if(isPerfTestRunning)
	    	  bodysyncgets(run);
	      
	      getsCount++;
	      
	      if (gets_elapsed_time_in_secs > testDurationInSecs) {
	    	  isPerfTestRunning = false;
	      }
	  });
	  
	  finalGet(getsCount); 
	  
	  //teardown
	  setTimeout(final(), 1000);
	  
	};



Performance.stopPerformanceTest = function(user_name, callback) {
	  request.post(rest_api.post_teardown_perf_test, {json:true}, function(err, res, body) {
	    if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode === 201) {
	      isPerfTestRunning = false;
	      testEndTime = moment().format();
	      console.log(isPerfTestRunning + " " + testEndTime);
	      
	      callback(null, null);
	      return;
	    }
	    if (res.statusCode !== 201) {
	      callback(null, null);
	      return;
	    }
	  });
	};

Performance.stopMemoryTestAndReturnMemories = function(user_name, callback) {
	  request.post(rest_api.post_stop_mem_test, {json:true}, function(err1, res1, body1) {
	  request(rest_api.get_all_memory_crumbs_1hr, {json:true}, function(err2, res2, body2) {
	    if (err2){
	      callback(err2,null);
	      return;
	    }
	    if (res2.statusCode === 200) {
	      var memories = body2.map(function(item, idx, arr){
	        return new Memory(item.usedVolatileMemory, item.remainingVolatileMemory, item.usedPersistentMemory, item.remainingPersistentMemory, item.onlineUsers, item.createdAt);
	      });

	      callback(null, memories);
	      return;
	    }
	   if (res2.statusCode !== 200) {
	      callback(null, null);
		      return;
		    }
		  });
	  });  
};
	

module.exports = Performance;
