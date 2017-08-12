//YelpCamp/yelper_v.4/app.js

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

seedDB();   

app.get("/", function(req, res){
  res.render("landing");
  });


//INDEX
//GET ALL CAMPGROUNDS FROM DB
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
    res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
  });
});

//CREATE
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});


//SHOW - Shows additional info about one campground
app.get("/campgrounds/:id", function(req, res){
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
  
// ====================
// COMMENTS RUUTES
// ====================

app.get("/campgrounds/:id/comments/new", function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err) {
      console.log(err);
    }else {
      res.render("comments/new", {campground:foundCampground});
      }
  });
});

app.post("/campgrounds/:id/comments", function(req, res) {
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
          //connect new comment to campground
          foundCampground.comments.push(comment);
          foundCampground.save();
          //redirect to campground show page
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is open and listening.");
});


