//YelpCamp/yelper
var bodyParser  = require("body-parser"),
mongoose        = require("mongoose"),
express         = require("express"),
app             = express();
    
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//SCHEMA & MODEL SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//       name:"New River Gorge", 
//       image:"https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg",
//       description: "This is a huge smelly river, no showers.  I left my stuff at the start of the river trip and it was not there when I got to the put out. You get in the boat. The guides yells at you all day. You actually have to paddle. You get wet, most of us fell out at least once. The lunch was very nice, though. Oh, and they had beer on the bus ride back. BTW, Who is this 'Gorge' persone ?"
      
//     }, function(err, campground){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Newly created campground : ");
//     console.log(campground);
//   }
// });

app.get("/", function(req, res){
  res.render("landing");
  });


//INDEX
//GET ALL CAMPGROUNDS FROM DB
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err,allCampgrounds){
    if(err){
      console.log(err);
    } else {
    res.render("index", {campgrounds:allCampgrounds});
    }
  });
});

//CREATE
app.post("/campgrounds", function(req, res){
  var name= req.body.name;
  var image= req.body.image;
  var desc= req.body.description;
  
  var newCampground= {name:name, image:image, description:desc};
  Campground.create(newCampground, function(err, newlyCreated){
    if(err) {
      console.log(err);
    } else {
        res.redirect("/campgrounds");
    }
  });
});

//NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});


//SHOW - Shows additional info about one campground
app.get("/campgrounds/:id", function(req, res) {
  //find the campground with the provided ID
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
        //render show template with that campground
        res.render("show", {campground: foundCampground});
    }    
  });
});
  


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is open and listening.");
});


