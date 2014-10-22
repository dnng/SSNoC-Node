var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var moment = require('moment');
var async = require('async');
var rest_api = require('../../config/rest_api');
var WallMessage = require('../models/WallRest');

var isPerfTestRunning = false; 

var post_request_limit = 1000;
var get_request_limit = 1000;

var postsCount = 0;
var getsCount = 0;

var testPostStartTime = 0;
var testGetStartTime = 0;
var testPostEndTime = 0;
var testGetEndTime = 0;

var postsPerSecond = 0;
var getsPerSecond = 0;

var posts_elapsed_time_in_secs;
var gets_elapsed_time_in_secs;

var max_test_duration = 600;


function Performance(testDurationInSecs, getsPerSecond, postsPerSecond){
  this.local = {
		  testDurationInSecs : testDurationInSecs,
		  getsPerSecond : getsPerSecond,
		  postsPerSecond : postsPerSecond
  };
}

Performance.startPerformanceTest = function(user_name, testDurationInSecs, callback) {
	  var runs = [];
	  var x = 0;
	  while(x < post_request_limit)
	  {
		  runs.push(x++);
	  }
	
	  var author = "lloyd";
      var content = "12345678901234567890";
      var location = "NASA";
	  
      postsCount = 0;
      getsCount = 0;
      postsPerSecond = 0;
      getsPerSecond = 0;
      
	  posts_elapsed_time_in_secs = 0;
	  gets_elapsed_time_in_secs = 0;
	  
	  testPostStartTime = 0;
	  testGetStartTime = 0;
	  testPostEndTime = 0;
	  testGetEndTime = 0;
	  
	  
	  function kickoff() {
	      console.log('Starting Performance Test');
	      printTimestamp();
	      request.post(rest_api.post_setup_perf_test, {json: true});
	      isPerfTestRunning = true;
	      //callback();
	  }
	  
	  function kickoffPost() {
	      console.log('Starting Posts');
	      printTimestamp();
	      testPostStartTime = moment();
	      posts_elapsed_time_in_secs = 0;
	      postsCount = 0;
	      //callback();
	  }
	  
	  function kickoffGet() {
	      console.log('Starting Gets');
	      printTimestamp();
	      testGetStartTime = moment();
	      gets_elapsed_time_in_secs = 0;
	      getsCount = 0;
	      //callback();
	  }
	  
	  
	  function singlePost(postCount) {
		  var options = {
		          url: rest_api.post_new_wall_message + author,
		          body: {
		              author: author,
		              content: content,
		              location: location
		          },
		          json: true
		      };
		  
		  request.post(options, function(err, res, body) {
			posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
		    console.log(moment() + "Elapsed time after test post#" + postCount + ", " + posts_elapsed_time_in_secs);
		  })
		}
	  
	  
	  //asynchronous stuff
	  function postsLoop() {
		  var options = {
		          url: rest_api.post_new_wall_message + author,
		          body: {
		              author: author,
		              content: content,
		              location: location
		          },
		          json: true
		      };
		  
		  if (!isPerfTestRunning || posts_elapsed_time_in_secs > testDurationInSecs || postsCount > post_request_limit) 
			  return;
		  request.post(options, function(err, res, body) {
			console.log(moment() + "Elapsed time before test post#" + postsCount + ", " + posts_elapsed_time_in_secs);
		    postsLoop(callback);
		    posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
		    console.log(moment() + "Elapsed time after test post#" + postsCount + ", " + posts_elapsed_time_in_secs);
		    postsCount++;
		  })
		}
	  
	  function getsLoop() {
		  if (!isPerfTestRunning || gets_elapsed_time_in_secs > testDurationInSecs || getsCount > get_request_limit) 
			  return;
		  request(rest_api.get_all_wall_status_messages, {json:true}, function(err, res, body) {
			console.log(moment() + "Elapsed time before test get#" + getsCount + ", " + gets_elapsed_time_in_secs);
		    getsLoop(callback);
		    gets_elapsed_time_in_secs = moment().diff(testGetStartTime) / 1000;
		    console.log(moment() + "Elapsed time after test get#" + getsCount + ", " + gets_elapsed_time_in_secs);
		    getsCount++;
		  })
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
	  
	  function wrapupPost(totalCount) {
		  posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
          postsPerSecond = totalCount / posts_elapsed_time_in_secs
          console.log('Done: Posts Elapsed Time=' + posts_elapsed_time_in_secs + ', PostsPerSec=' + postsPerSecond);
          callback();
	  }
	  
	  function wrapupGet(totalCount) {
		  gets_elapsed_time_in_secs = moment().diff(testGetStartTime) / 1000;
          getsPerSecond = totalCount / gets_elapsed_time_in_secs
          console.log('Done: Gets Elapsed Time=' + gets_elapsed_time_in_secs + ', GetsPerSec=' + getsPerSecond);
          callback();
	  }

	  function wrapup() {
	      request.post(rest_api.post_teardown_perf_test, {json: true});
	      printTimestamp();
	      //write stuff to file here?
	      callback(null, postsPerSecond, getsPerSecond);
	      return;
	  }
	  
	  function printTimestamp() {
		  console.log("###The time now is:" + moment().format());
	  }


//	  //setup
//	  kickoff();
//	  
//	  //testing posts
//	  kickoffPost(postsLoop(wrapupPost(postsCount)));
//	   
//	  //testing gets
//	  kickoffGet(getsLoop(wrapupGet(getsCount)));
//	  
//	  //teardown
//	  wrapup();
	  
//	  kickoff();
	  
	  var options = {
	          url: rest_api.post_new_wall_message + author,
	          body: {
	              author: author,
	              content: content,
	              location: location
	          },
	          json: true
	      };
	  
	  
	  
	  var y = 0;
	  var runCounts = [];
	  
	  
	  
      gets_elapsed_time_in_secs = 0;
      posts_elapsed_time_in_secs = 0;
      
	  while(y < post_request_limit)
	  {
		  runCounts.push(y++);
	  }
//	  		testPostStartTime = moment();
//	
//		    async.forEachLimit(runCounts, 100, function(runCount, callback) {
//		    	if (!isPerfTestRunning || posts_elapsed_time_in_secs > testDurationInSecs) 
//					  return;
//		    	request.post(options, function(err, res, body) {
//		    		posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
//		    	    console.log(moment() + "Elapsed time after test post#" + runCount + ", " + posts_elapsed_time_in_secs);
//		    	    callback();
//		    	  })
//		    	
//		    }, function(err) {
//		        if (err) return next(err);
//		        
//		        posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
//	    	    postsPerSecond = totalCount / posts_elapsed_time_in_secs
//	            console.log('Done: Posts Elapsed Time=' + posts_elapsed_time_in_secs + ', PostsPerSec=' + postsPerSecond);
//		    });
//		    
//		    testGetStartTime = moment();
//		    
//		    async.forEachLimit(runCounts, 100, function(runCount, callback) {
//		    	if (!isPerfTestRunning || gets_elapsed_time_in_secs > testDurationInSecs) 
//					  return;
//		    	request(rest_api.get_all_wall_status_messages, {json:true}, function(err, res, body) {
//		    		gets_elapsed_time_in_secs = moment().diff(testGetStartTime) / 1000;
//		    	    console.log(moment() + "Elapsed time after test get#" + runCount + ", " + gets_elapsed_time_in_secs);
//		    	    callback();
//		    	  })
//		    	
//		    }, function(err) {
//		        if (err) return next(err);
//		        
//		        gets_elapsed_time_in_secs = moment().diff(testgetStartTime) / 1000;
//	    	    getsPerSecond = totalCount / gets_elapsed_time_in_secs
//	            console.log('Done: Gets Elapsed Time=' + gets_elapsed_time_in_secs + ', GetsPerSec=' + getsPerSecond);
//		    });
//	
//	  wrapup();
	  
//	  async.series([
//	                kickoff(),
//	                kickoffPost(),
//	                postsLoop(),
//	                wrapupPost(postsCount),
//	                kickoffGet(),
//	                getsLoop(),
//	                wrapupGet(getsCount),
//	                wrapup()
//	            ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
//	                if (err) return next(err);
//	                callback(null, postsPerSecond, getsPerSecond);
//	            });
	  
	  
	  
	  async.series([
	                function(callback) {
	                
	                	kickoff();
	                	callback();
	                }
	                ,
	                function(callback) {
	                	kickoffPost();
	                	callback();
	                }
	                ,
	                function(callback) {
	                	
	                	async.forEachLimit(runCounts, 10, function(runCount, callback) {
	        		    	if (!isPerfTestRunning || posts_elapsed_time_in_secs > testDurationInSecs) {
	        		    		callback();
	        		    		return;
	        		    	}
	        		    	request.post(options, function(err, res, body) {
	        		    		posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
	        		    		postsCount = runCount;
	        		    	    console.log(moment() + "Elapsed time after test post#" + runCount + ", " + posts_elapsed_time_in_secs);
	        		    	    callback();
	        		    	  })
	        		    	
	        		    }, function(err) {
	        		        if (err) return next(err);
	        		        
	        		        posts_elapsed_time_in_secs = moment().diff(testPostStartTime) / 1000;
	        	    	    postsPerSecond = postsCount / posts_elapsed_time_in_secs
	        	            console.log('Done: Posts Elapsed Time=' + posts_elapsed_time_in_secs + ', PostsPerSec=' + postsPerSecond);
	        	    	    callback();
	        		    })
	                },
	                function(callback) {
	                	kickoffGet();
	                	callback();
	                }
	                ,
	                function(callback) {
	                	
	                	async.forEachLimit(runCounts, 10, function(runCount, callback) {
	        		    	if (!isPerfTestRunning || gets_elapsed_time_in_secs > testDurationInSecs) {
	        		    		callback();
	        		    		return;
	        		    	}
	        		    	request(rest_api.get_all_wall_status_messages, {json:true}, function(err, res, body) {
	        		    		gets_elapsed_time_in_secs = moment().diff(testGetStartTime) / 1000;
	        		    		getsCount = runCount;
	        		    	    console.log(moment() + "Elapsed time after test get#" + runCount + ", " + gets_elapsed_time_in_secs);
	        		    	    callback();
	        		    	  })
	        		    	
	        		    }, function(err) {
	        		        if (err) return next(err);
	        		        
	        		        gets_elapsed_time_in_secs = moment().diff(testGetStartTime) / 1000;
	        	    	    getsPerSecond = getsCount / gets_elapsed_time_in_secs
	        	            console.log('Done: Gets Elapsed Time=' + gets_elapsed_time_in_secs + ', GetsPerSec=' + getsPerSecond);
	        	    	    callback();
	        		    })	
	                }
	            ], function(err) { //This function gets called after the two series tasks have called their "task callbacks"
	                if (err) return next(err);
	                //Here locals will be populated with 'user', 'posts' and 'photos
	                request.post(rest_api.post_teardown_perf_test, {json: true});
	                callback(null, postsPerSecond, getsPerSecond);
	            });
	  
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
