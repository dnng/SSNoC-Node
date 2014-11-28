var User = require('../models/UserRest');

module.exports = function(_, io, participants, passport) {
  return {
    getPeople: function(req, res) {
    	var user_name = req.session.passport.user.user_name;
        User.getUser(user_name, function(err, user) {
          if (user !== null) {
        	  console.log(res);
        	  res.render("people", { messages: req.flash('search_alert'), userId: req.session.userId, title:"Directory", user_name:req.session.passport.user.user_name, lastStatus:user.local.lastStatus});        	  
          }
        });
     }
  };
};
