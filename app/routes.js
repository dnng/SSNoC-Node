var User          = require('./models/UserRest');

module.exports = function(app, _, io, participants, passport) {
  var user_controller = require('./controllers/user')(_, io, participants, passport, refreshAllUsers);
  var people_controller = require('./controllers/people')(_, io, participants, passport);
  var profile_controller = require('./controllers/profile')(_, io, participants, passport);
  var wall_controller = require('./controllers/wall')(_, io, participants, passport);
  var chat_controller = require('./controllers/chat')(_, io, participants, passport);
  var monitor_controller = require('./controllers/monitor')(_, io, participants, passport);
  var analysis_controller = require('./controllers/analysis')(_, io, participants, passport);
  var search_controller = require('./controllers/search')(_, io, participants, passport);
  var admin_controller = require('./controllers/admin')(_, io, participants, passport);

  app.get("/", user_controller.getLogin);

  app.post("/signup", user_controller.postSignup);

  app.get("/welcome", isLoggedIn, user_controller.getWelcome);

  app.get("/user", isLoggedIn, user_controller.getUser);
  app.get("/signup", user_controller.getSignup);
  app.get("/logout", isLoggedIn, user_controller.getLogout);
  app.post("/login", passport.authenticate('local-login', {
    successRedirect : '/people',
    failureRedirect : '/',
    failureFlash: true
  }));

  app.post("/status", isLoggedIn, profile_controller.postStatusMessage);

  app.get("/people", isLoggedIn, people_controller.getPeople);
  app.get("/profile", isLoggedIn, profile_controller.getProfile);
  app.get("/wall", isLoggedIn, wall_controller.getAllMessages);
  app.post("/wall", isLoggedIn, wall_controller.postWallMessage);
  app.post("/announcement", isLoggedIn, wall_controller.postAnnouncementMessage);
  app.get("/chat", isLoggedIn, chat_controller.getAllMessages);
  app.post("/chat", isLoggedIn, chat_controller.sendMessage);
  app.get("/monitor", isLoggedIn, monitor_controller.getMonitorPage);
  app.get("/analysis", isLoggedIn, analysis_controller.getAnalysisPage);
  app.post("/analysis", isLoggedIn, analysis_controller.getUserClusters);
  app.post("/startmem", isLoggedIn, monitor_controller.startMemoryTest);
  app.post("/stopmem", isLoggedIn, monitor_controller.stopMemoryTest);
  app.post("/startperf", isLoggedIn, monitor_controller.startPerformanceTest);
  app.post("/stopperf", isLoggedIn, monitor_controller.stopPerformanceTest);
  app.post("/search", isLoggedIn, search_controller.performSearch);
  app.get("/admin", isLoggedIn, admin_controller.getAdminPage);
  app.post("/admin", isLoggedIn, admin_controller.getUser);
  app.post("/update", isLoggedIn, admin_controller.updateUser);
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

function refreshAllUsers(participants, callback) {
  participants.all = [];
  User.getAllUsers(function(err, users) {
    users.forEach(function(user) {
      participants.all.push({'userName' : user.local.name});
    });
    callback();
  });
}

