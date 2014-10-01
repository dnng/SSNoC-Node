module.exports = function(_, io, participants, passport) {
  return {
    getStatuses: function(req, res) {
      res.render("wall", {userId: req.session.userId, title:"Statuses", user_name:req.session.passport.user.user_name});
    }
  };
};
