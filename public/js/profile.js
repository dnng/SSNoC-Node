function init() {
  var serverBaseUrl = document.domain;

  var socket = io.connect(serverBaseUrl);

  var sessionId = '';

  window.my_name = '';

  function updateParticipants(participants) {
    $('#participants_online').html('');
    $('#participants_offline').html('');
    var map = {};
    var userName = '';
    var userEle = '';
    for (var sId in participants.online){
      userName = participants.online[sId].userName;
      if (map[userName] == undefined || map[userName] !== sessionId){
        map[userName] = {sId:sId};
      }
    }
    keys = Object.keys(map);
    keys.sort();

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i];
      var img_ele = '<img src="/img/photo4.png" height=40/>';
      var photo_ele = '<div class="col-xs-3 col-sm-2 col-md-1 col-lg-1"><img src="/img/green-dot.png" height=10/><br/>'+img_ele + '</div>';
      var name_ele = '<div class="col-xs-8 col-sm-9 col-md-10 col-lg-10"><strong>' + name + '</strong></div>';
      var dropdown_symbol = map[name].sId === sessionId ? '':'<i class="glyphicon glyphicon-chevron-down text-muted"></i>';
      var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data-for=".' + name + '">' + dropdown_symbol + '</div>';

      var info_ele = '<div class="row user-row search_item">' + photo_ele + name_ele + dropdown_ele + '</div>';
      var detail_ele = '<div class="row user-info ' + name + '"><a class="btn btn-info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3">Wanna do something?</a><hr/></div></div>';
      if (map[name].sId === sessionId || name === my_name) {
      } else {
        $('#participants_online').append(info_ele);
        $('#participants_online').append(detail_ele);
      }
    }

    participants.all.forEach(function(userObj) {
      if (map[userObj.userName] == undefined) {
        var img_ele = '<img class="img-circle" src="/img/photo4.png" height=40/>';
        var photo_ele = '<div class="offline col-xs-3 col-sm-2 col-md-1 col-lg-1"><img src="/img/grey-dot.png" height=10/><br/>'+img_ele + '</div>';
        var name_ele = '<div class="offline col-xs-8 col-sm-9 col-md-10 col-lg-10"><strong>' + userObj.userName + '</strong><br/></div>';
        var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data-for=".' + userObj.userName + '"><i class="glyphicon glyphicon-chevron-down text-muted"></i></div>';
        var info_ele = '<div class="row user-row search_item">' + photo_ele + name_ele + dropdown_ele + '</div>';
        var detail_ele = '<div class="row user-info ' + userObj.userName + '"><a class="btn btn-info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3">Wanna do something?</a><hr/></div></div>';
        $('#participants_online').append(info_ele);
        $('#participants_online').append(detail_ele);
      }
    });
    $('.user-info').hide();
    $('.dropdown-user').click(function() {
      var dataFor = $(this).attr('data-for');
      var idFor = $(dataFor);
      var currentButton = $(this);
      idFor.slideToggle(400, function() {
        if(idFor.is(':visible'))
          {
            currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
          }
          else
            {
              currentButton.html('<i class="glyphicon glyphicon-chevron-down"></i>');
            }
      })
    });
  }

  socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    $.ajax({
      url:  '/user',
      type: 'GET',
      dataType: 'json'
    }).done(function(data) {
      var name = data.name;
      my_name = data.name;

      socket.emit('newUser', {id: sessionId, name: name});
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

  var panels = $('.user-info');
  panels.hide();
  $('.dropdown-user').click(function() {
    var dataFor = $(this).attr('data-for');
    var idFor = $(dataFor);
    var currentButton = $(this);
    idFor.slideToggle(400, function() {
      if(idFor.is(':visible'))
        {
          currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
        }
        else
          {
            currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
          }
    })
  });
}

$(document).on('ready', init);
