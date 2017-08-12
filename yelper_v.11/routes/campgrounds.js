//../routes/campground.js

var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX - GET ALL CAMPGROUNDS FROM DB
router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
    res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
  });
});

//CREATE
router.post("/", middleware.isLoggedIn,function(req, res){
  //GET DATA FROM FORM AND ADD TO CAMPGROUNDS ARRAY
  var name= req.body.name;
  var image= req.body.image;
  var desc= req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground= {name: name, image: image, description: desc, author: author};
  Campground.create(newCampground, function(err, newlyCreated){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW
router.get("/new", middleware.isLoggedIn,function(req, res){
    res.render("campgrounds/new");
});

//SHOW - Shows additional info about one campground
router.get("/:id", function(req, res){
  //find the campground with the provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      // console.log(foundCampground);
        //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
    }    
  });
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground){
     if(err){
      console.log(err);
    } else {
    res.render("campgrounds/edit",{campground:foundCampground});
    }
    });
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
    if(err){
      req.flash("warning","Sorry, it looks like we had some problems, please try again.");
      res.redirect("/campgrounds");
    } else {
      res.flash("success","You have updated your campground info.")
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;