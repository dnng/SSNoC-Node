function init() {
  var serverBaseUrl = document.domain;
  var socket        = io.connect(serverBaseUrl);
  var sessionId     = '';
  window.my_name    = '';

  function updateParticipants(participants) {
    $('#participants_online').html('');
    $('#participants_offline').html('');
    var map      = {};
    var userName = '';
    var status = '';
    var userEle  = '';
    for (var sId in participants.online){
      console.log("online participant is " + JSON.stringify(participants.online[sId]));
      userName = participants.online[sId].userName;
      status = participants.online[sId].lastStatus;
      if (map[userName] == undefined || map[userName] !== sessionId){
        map[userName] = {sId:sId, status:status};
        console.log("Map is " + JSON.stringify(map[userName]));
      }
    }
    keys = Object.keys(map);
    keys.sort();

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i];
      console.log("Map of User is " + JSON.stringify(map[name]));
      var user_status = map[name].status;
      if (user_status == undefined)
    	  user_status = '';
      var img_ele = '<img src="/img/photo4.png" height=40/>';
      var photo_ele = '<div class="col-xs-3 col-sm-2 col-md-1 col-lg-1"><img src="/img/green-dot.png" height=10/><br/>'+img_ele + '</div>';
      var name_ele = '<div class="col-xs-8 col-sm-9 col-md-10 col-lg-10"><strong>' + name + '</strong></div>';
      var status_ele = '<div class="col-xs-8 col-sm-9 col-md-10 col-lg-10"><strong>' + user_status + '</strong></div>';
      if(user_status == 'OK')
          var status_ele = '<div class="col-xs-8 col-sm-9 col-md-10 col-lg-10"><img src="/img/green.png" height="30"><strong>&nbsp;' + user_status + '</strong><br/></div>';
      else if(user_status == 'HELP')
          var status_ele = '<div class="col-xs-8 col-sm-9 col-md-10 col-lg-10"><img src="/img/yellow.png" height="30"><strong>&nbsp;' + user_status + '</strong><br/></div>';
      else if(user_status == 'EMERGENCY')
          var status_ele = '<div class="col-xs-8 col-sm-9 col-md-10 col-lg-10"><img src="/img/red.png" height="30"><strong>&nbsp;' + user_status + '</strong><br/></div>';
      var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data-for=".' + name + '">' + '</div>';
      var info_ele = '<div class="row user-row search_item">' + photo_ele + name_ele + status_ele + dropdown_ele + '</div>';
      var detail_ele = '<div class="row user-info ' + name + '"><a href="/chat?author_name='+author_name+'&target_name='+name+'" class="btn btn-info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3">Wanna Chat?</a><hr/></div></div>';
      if (map[name].sId === sessionId || name === my_name) {
      } else {
        $('#participants_online').append(info_ele);
        $('#participants_online').append(detail_ele);
      }
    }

    participants.all.forEach(function(userObj) {
      if (map[userObj.userName] == undefined) {
    	  console.log("userObj:[" + userObj.userName + ", " + userObj.lastStatus + "], map:" + map[userObj.userName]);
    	var offline_status = userObj.lastStatus;
    	if (offline_status == undefined)
    		offline_status = '';
        var img_ele = '<img class="img-circle" src="/img/photo4.png" height=40/>';
        var photo_ele = '<div class="offline col-xs-3 col-sm-2 col-md-1 col-lg-1"><img src="/img/grey-dot.png" height=10/><br/>'+img_ele + '</div>';
        var name_ele = '<div class="offline col-xs-8 col-sm-9 col-md-10 col-lg-10"><strong>' + userObj.userName + '</strong><br/></div>';
        var status_ele = '<div class="offline col-xs-8 col-sm-9 col-md-10 col-lg-10"><strong>' + offline_status + '</strong><br/></div>';
        if(offline_status == 'OK')
            var status_ele = '<div class="offline col-xs-8 col-sm-9 col-md-10 col-lg-10"><img src="/img/green.png" height="30"><strong>&nbsp;' + offline_status + '</strong><br/></div>';
        else if(offline_status == 'HELP')
            var status_ele = '<div class="offline col-xs-8 col-sm-9 col-md-10 col-lg-10"><img src="/img/yellow.png" height="30"><strong>&nbsp;' + offline_status + '</strong><br/></div>';
        else if(offline_status == 'EMERGENCY')
            var status_ele = '<div class="offline col-xs-8 col-sm-9 col-md-10 col-lg-10"><img src="/img/red.png" height="30"><strong>&nbsp;' + offline_status + '</strong><br/></div>';
        var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data-for=".' + userObj.userName + '"><i class="glyphicon glyphicon-chevron-down text-muted"></i></div>';
        var info_ele = '<div class="row user-row search_item">' + photo_ele + name_ele + status_ele + '</div>';
        var detail_ele = '<div class="row user-info ' + userObj.userName + '"><a href="/chat?author_name='+author_name+'&target_name='+userObj.userName+'" class="btn btn-info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3">Wanna Chat?</a><hr/></div></div>';
        $('#participants_online').append(info_ele);
        $('#participants_online').append(detail_ele);
      }
    });
    
  }

  socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    $.ajax({
      url:  '/user',
      type: 'GET',
      dataType: 'json'
    }).done(function(data) {
      console.log("The data on connect is: " + JSON.stringify(data));
      var name = data.name;
      var lastStatus = data.lastStatus;
      socket.emit('newUser', {id: sessionId, name: name, lastStatus: lastStatus});
    });
  });

  socket.on('newConnection', function (data) {
    updateParticipants(data.participants);
  });

  socket.on('userDisconnected', function(data) {
    updateParticipants(data.participants);
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });
}

$(document).on('ready', init);
