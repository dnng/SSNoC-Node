var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Memory(used_volatile_mem, rem_volatile_mem, used_persistent_mem, rem_persistent_mem, online_users, created_at){
  this.local = {
    used_volatile_mem : used_volatile_mem,
    rem_volatile_mem : rem_volatile_mem,
    used_persistent_mem : used_persistent_mem,
    rem_persistent_mem : rem_persistent_mem,
    online_users : online_users,
    created_at : created_at
  };
}

Memory.startMemoryTest = function(user_name, callback) {
  request.post(rest_api.post_start_mem_test, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 201) {
      callback(null, null);
      return;
    }
    if (res.statusCode !== 201) {
      callback(null, null);
      return;
    }
  });
};

Memory.stopMemoryTest = function(user_name, callback) {
	  request.post(rest_api.post_stop_mem_test, {json:true}, function(err, res, body) {
	    if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode === 201) {
	      callback(null, null);
	      return;
	    }
	    if (res.statusCode !== 201) {
	      callback(null, null);
	      return;
	    }
	  });
	};

	Memory.stopMemoryTestAndReturnMemories = function(user_name, callback) {
		  request.post(rest_api.post_stop_mem_test, {json:true}, function(err1, res1, body1) {
		  request(rest_api.get_all_memory_crumbs_1hr, {json:true}, function(err2, res2, body2) {
		    if (err2){
		      callback(err2,null);
		      return;
		    }
		    if (res2.statusCode === 200) {
		      var memories = body2.map(function(item, idx, arr){
		        return new Memory(item.usedVolatileMemory, item.remainingVolatileMemory, item.usedPersistentMemory, item.remainingPersistentMemory, item.onlineUsers, item.createAt);
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
	
Memory.getAllMemoryCrumbs = function(callback) {
  request(rest_api.get_all_memory_crumbs_1hr, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var memories = body.map(function(item, idx, arr){
        return new Memory(item.usedVolatileMemory, item.remainingVolatileMemory, item.usedPersistentMemory, item.remainingPersistentMemory, item.onlineUsers, item.createAt);
      });

      callback(null, memories);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

module.exports = Memory;
