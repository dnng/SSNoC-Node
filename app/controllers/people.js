module.exports = function(_, io, participants, passport) {
  return {
    getPeople: function(req, res) {
      res.render("people", {userId: req.session.userId, title:"Directory", user_name:req.session.passport.user.user_name});
    }
  };
};
