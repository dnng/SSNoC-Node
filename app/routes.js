var User = require('./models/UserRest');
var Status = require('./models/StatusRest');

module.exports = function(app, _, io, participants, passport) {
  var user_controller = require('./controllers/user')(_, io, participants, passport, refreshAllUsers);
  var people_controller = require('./controllers/people')(_, io, participants, passport);
  var profile_controller = require('./controllers/profile')(_, io, participants, passport);
  var wall_controller = require('./controllers/wall')(_, io, participants, passport);

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
  
  app.post("/status", isLoggedIn, profile_controller.postStatusUpdate);

  app.get("/people", isLoggedIn, people_controller.getPeople);
  app.get("/profile", isLoggedIn, profile_controller.getProfile);
  app.get("/wall", isLoggedIn, wall_controller.getStatuses);
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
