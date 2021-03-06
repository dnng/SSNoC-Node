var express  = require("express");
var app      = express();
var http     = require("http").createServer(app);
var io       = require("socket.io").listen(http);
var _        = require("underscore");
var passport = require('passport');
var flash    = require('connect-flash');
var User     = require('./app/models/UserRest');

var participants = {
  online : {},
  all : []
};

process.chdir(__dirname);

require('./config/passport')(passport);

app.set("ipaddr", "0.0.0.0");
app.set("port", 3000);
app.set("views", __dirname + "/app/views");
app.set("view engine", "jade");
app.use(express.logger('dev'));
app.use(express.static("public", __dirname + "/public"));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/user_uploads" }))
app.use(express.cookieParser());
app.use(express.session({secret : 'ssnocwebapplication', cookie : {maxAge : 3600000*24*10 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

User.getAllActiveUsers(function(err, users) {
  if (!err && users && users.length > 0) {
    users.forEach(function(user) {
      console.log("Retrived user is:" + JSON.stringify(user));
      participants.all.push({userName : user.local.name, lastStatus : user.local.lastStatus});
    });
  }
  require('./app/routes')(app, _, io, participants, passport);
  require('./app/socket')(_, io, participants);
});

http.listen(app.get("port"), app.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

