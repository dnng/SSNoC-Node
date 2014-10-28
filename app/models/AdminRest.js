var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Citizen(user_name, password, privilege, account_status){
  this.local = {
    citizenName : user_name,
    password : password,
    privilege : privilege,
    accountstatus : account_status
  };
}


Citizen.getCitizen = function(citizen_name, callback) {
  request(rest_api.get_user + citizen_name, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var citizen = new Citizen(body.citizenName, body.password, body.privilege, body.accountstatus);
      callback(null, citizen);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

Citizen.saveNewCitizen = function(citizen_name, password, privilege, accountstatus, callback) {
  var options = {
    url : rest_api.post_new_user,
    body : {citizenName: citizen_name, password: password, privilege : privilege, accountstatus : accountstatus},
    json: true
  };

  request.post(options, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      callback(res.body, null);
      return;
    }
    var new_citizen = new Citizen(body.userName, password, privilege, accountstatus, undefined);
    callback(null, new_citizen);
    return;
  });
};






module.exports = Citizen;
