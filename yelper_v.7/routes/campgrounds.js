var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

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
router.post("/", function(req, res){
  //GET DATA FROM FORM AND ADD TO CAMPGROUNDS ARRAY
  var name= req.body.name;
  var image= req.body.image;
  var desc= req.body.description;
  var newCampground= {name: name, image: image, description: desc};
  
  Campground.create(newCampground, function(err, newlyCreated){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW
router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW - Shows additional info about one campground
router.get("/:id", function(req, res){
  //find the campground with the provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground);
        //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
    }    
  });
});

module.exports = router;