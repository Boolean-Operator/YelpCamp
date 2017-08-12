//YelpCamp/yelper_v.6/app.js

var express         = require("express"),
    app             = express(),
    expressSession  = require("express-session"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();   

//PASSPORT CONFIGURATION
// app.use(require("express-session")({
app.use(expressSession({
  secret:"Logan is the Wolverine",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Current User Middleware
app.use(function (req, res, next){
  res.locals.currentUser = req.user;
  next();
});

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
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err) {
      console.log(err);
    }else {
      res.render("comments/new", {campground:foundCampground});
      }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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

//============
//AUTH ROUTES
//============

//Render Registration Form
app.get("/register", function(req, res) {
    res.render("register");
});

//Handle Registration(Sign Up) Logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
      if(err){
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/campgrounds");
      });
    });
});

//Render Login Form
app.get("/login", function(req, res) {
  res.render("login");
});

//Handle Login Logic
app.post("/login", passport.authenticate("local",
  {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
  }), function(res, req) {
  
});

//Logout Route
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
  


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is open and listening.");
});


