var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var moment = require('moment');
var rest_api = require('../../config/rest_api');
var WallMessage = require('../models/WallRest');
var post_request_limit = 10;
var isPerfTestRunning = false;
var postsCount = 0;
var getsCount = 0;
var testStartTime;
var testEndTime;
var postsPerSecond;
var elapsed_time_in_secs;


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
	  elapsed_time_in_secs = 0;
	  
	  function kickoff() {
		  console.log('Starting');
		  testStartTime = moment();
		  request.post(rest_api.post_setup_perf_test, {json:true}, function(err, res, body) {
			  callback(null, null);
			  });
		  }
	  
//	  function body() {
//		  var options = {
//  			    url : rest_api.post_new_wall_message + author,
//  			    body : {author: author, content: content, location: location},
//  			    json: true
//  			  };
//
//  			  request.post(options, function(err, res, body) {
//  				postsCount++;
//  			    callback(null, null);
//  			    return;
//  			  });
//	  }
	  
	  
	  function async(arg, callback) {

			    	  var options = {
			    			    url : rest_api.post_new_wall_message + author,
			    			    body : {author: author, content: content, location: location},
			    			    json: true
			    			  };
			    	  
			    	  elapsed_time_in_secs = moment().diff(testStartTime) / 1000;
	    				console.log(moment() + "Elapsed time before test #" + arg + ", " + elapsed_time_in_secs);

			    			  request.post(options, function(err, res, body) {
			    				elapsed_time_in_secs = moment().diff(testStartTime) / 1000;
			    				console.log(moment() + "Elapsed time after test #" + arg + ", " + elapsed_time_in_secs);
			    				
			    			    callback(null, null);
			    			    return;
			    			  });
	  }
	  
	  function final(totalCount) { 
		  request.post(rest_api.post_teardown_perf_test, {json:true}, function(err, res, body) {
			  elapsed_time_in_secs = moment().diff(testStartTime) / 1000;
			  postsPerSecond = totalCount / elapsed_time_in_secs
			  console.log('Done: ' + postsPerSecond); 
			  callback(null, postsPerSecond, postsPerSecond);
			  return;
		  });
		  
	  }
	  
	  runs.forEach(function(run) {
		  async(run, function(result){
			  if(run == 0) {
				  kickoff();
			  }
//			  body();
//		    console.log(run);
		    if(run == post_request_limit-1 || elapsed_time_in_secs > testDurationInSecs ) {
		      final(run);
		    }
		  })
		});
	};



Performance.startPerformanceTest2 = function(user_name, testDurationInSecs, callback) {
  var runs = [];
  var x = 0;
  while(x < post_request_limit)
  {
	  runs.push(x++);
  }
  console.log(runs);
  
  function async(arg, callback) {
	  console.log('do something with \''+arg+'\', return 1 sec later');
	  setTimeout(function() { callback(arg * 2); }, 1000);
  }
  
  function final() { console.log('Done'); }
	
  request.post(rest_api.post_setup_perf_test, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 201) {
      isPerfTestRunning = true;
      postsCount = 0;
      getsCount = 0;
      testStartTime = moment().format();
      max_posts_per_second = post_request_limit / testDurationInSecs;
      console.log(isPerfTestRunning + " " + testStartTime + " " + max_posts_per_second);
      
      var author = "lloyd";
      var content = "12345678901234567890";
      var location = "NASA";
      
      for (i = 0; i < post_request_limit; i++) { 
    	  console.log("send request #" + i);
    	  var post_start_time = moment();
    	  var post_end_time = moment();
    	  var post_duration; 
    	  
    	  var options = {
    			    url : rest_api.post_new_wall_message + author,
    			    body : {author: author, content: content, location: location},
    			    json: true
    			  };

    			  request.post(options, function(err, res, body) {
    				
    			    postsCount++;
    			    post_end_time = moment();
    			    post_duration = post_end_time - post_start_time;
    			    console.log("The Post #" + postsCount + ", Duration was: " + post_duration);
    			    
    			    callback(null, null);
    			    return;
    			  });
    	}
      
      callback(null, null);
      return;
    }
    if (res.statusCode !== 201) {
      callback(null, null);
      return;
    }
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
