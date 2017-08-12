//./middleware/index.js
//all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
          res.redirect("back");
        }else{
          if(foundCampground.author.id.equals(req.user._id)){
            next();
          }else { 
            res.redirect("back");
          }
        }
      });
    }else{
      res.redirect("back");
    }
  };

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          req.flash("warning","Sorry, it looks like we had some problems, please try again.");
        res.redirect("back");
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else { 
          req.flash("error","Sorry but you are not allowed to do this.");
          res.redirect("back");
        }
      }
    });
  }else{
    req.flash("error","Please login to complete this action");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","Please login to complete this action");
  res.redirect("/login");
};


module.exports = middlewareObj;



