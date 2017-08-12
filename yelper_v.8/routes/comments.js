var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

//Comments - New
router.get("/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err) {
      console.log(err);
    }else {
      res.render("comments/new", {campground:foundCampground});
      }
  });
});

//Comments - Create
router.post("/", isLoggedIn, function(req, res) {
    //loook up campgound using id
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          //add username and id
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          //connect new comment to campground
          foundCampground.comments.push(comment);
          foundCampground.save();
          console.log(comment);
          //redirect to campground show page
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;