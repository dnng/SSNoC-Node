var Admin = require('../models/AdminRest');

module.exports = function(_, io, participants, passport) {
  return {
      getAdminPage: function(req, res) {
        res.render("citizen", {userId: req.session.userId, title:"Directory", user_name:req.session.passport.user.user_name, password:req.session.passport.user.password, privilege:req.session.passport.user.privilege, accountStatus:req.session.passport.user.account_status});
	      }
	    };
	  };

	  getUser : function(req, res) {
        var user_name = req.session.passport.user.user_name;
        User.getUser(user_name, function(err, user) {
          if (user !== null) {
            res.json(200, {name:user.local.name});
          }
        });
      }
	  
      updateCitizen: function(req, res, next) {
	    Citizen.saveCitizenNewInformation(req.session.passport.user.user_name, req.session.passport.user.password, req.session.passport.user.privilege, req.session.passport.user.account_status function(err, new_user) {
	      if (err)
	        return res.redirect('/welcome');
	      return res.redirect('/administor');
	    });
	  },

// getAllCitizen
// updateCitizen
