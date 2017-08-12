var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");


//ROOT ROUTE
router.get("/", function(req, res){
  res.render("landing");
  });

//AUTH ROUTES
//============
//Render Registration Form
router.get("/register", function(req, res) {
    res.render("register");
});

//Handle Registration(Sign Up) Logic
router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
  res.render("login");
});

//Handle Login Logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
  }), function(res, req) {
  
});

//Logout Route
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;