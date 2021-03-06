var LocalStrategy = require('passport-local').Strategy;
var WallMessage   = require('../models/WallRest');
var request       = require('request');
var Status        = require('../models/StatusRest');
var Announcement  = require('../models/AnnouncementRest');

module.exports = function(_, io, participants, passport) {
  return {
	getAllMessages: function(req, res) {
        WallMessage.getAllMessages(function(err, messages) {
        console.log("MESSAGES: " + messages);
        if (err)
          return res.redirect('/welcome');
        Announcement.getAllAnnouncements(function(err, announcements) {
        	console.log("ANNOUNCEMENTS: " + announcements);
        	if (err)
        		return res.redirect('/welcome');
        	res.render("wall", {userId: req.session.userId, title:"Messages", user_name:req.session.passport.user.user_name, messages: messages, announcements: announcements});
        	});
        });
    },
    
    postStatusMessage: function(req, res, next) {
        Status.saveNewStatus(req.session.passport.user.user_name, req.body.status, req.body.location, function(err, new_status) {
          if (err)
            return res.redirect('/welcome');
          return res.redirect('/wall');
        });
      },

    postWallMessage: function(req, res, next) {
    	var imagePath = "";
    	var videoPath = "";
    	if (req.files.user_photo.size > 0) 
    	{
    		var tokenized_path = req.files.user_photo.path.split("public");
    		imagePath = tokenized_path[1];
    	}
    	if (req.files.user_video.size > 0)
    	{
    		var tokenized_path = req.files.user_video.path.split("public");
    		videoPath = tokenized_path[1];
    	}
        WallMessage.saveNewWallMessage(req.session.passport.user.user_name, req.body.content, req.body.location, imagePath, videoPath, function(err, new_message) {
          if (err)
          {
        	  console.log(err);
        	  return res.redirect('/welcome');
          }
          return res.redirect('/wall');
        });
     },
     
     postAnnouncementMessage: function(req, res, next) {
         Announcement.saveNewAnnouncement(req.session.passport.user.user_name, req.body.announcement, req.body.location, function(err, new_announcement) {
           if (err)
             return res.redirect('/welcome');
           return res.redirect('/wall');
         });
       }
  };
};

