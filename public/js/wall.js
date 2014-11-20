function init() {
    var serverBaseUrl = document.domain;

    var socket = io.connect(serverBaseUrl);

    var sessionId = '';

    window.my_name = '';

    socket.on('error', function(reason) {
        console.log('Unable to connect to server', reason);
    });

    // check whether browser supports geolocation api
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError, {
            enableHighAccuracy: true
        });
    } else {
        console.log("Your browser is out of fashion, there\'s no geolocation!");
    }

    function positionSuccess(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var acr = position.coords.accuracy;
        console.log("latitude:" + lat + ", longitude:" + lng + ", accuracy:" + acr);
    }

    // handle geolocation api errors
    function positionError(error) {
        var errors = {
            1: "Authorization fails", // permission denied
            2: "Can\'t detect your location", //position unavailable
            3: "Connection timeout" // timeout
        };
        showError("Error:" + errors[error.code]);
    }

    function showError(msg) {
        console.log(msg);
    }

}

$(document).on('ready', init);