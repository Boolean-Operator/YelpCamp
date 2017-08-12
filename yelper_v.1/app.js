//YelpCamp/yelper
var express= require("express");
var app= express();
var bodyParser= require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

var campgrounds = [
    {name:"Trap Pond", image:"https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"},
    {name:"Silver Lake", image:"https://farm3.staticflickr.com/2765/4240509073_d34393d09d.jpg"},
    {name:"New River", image:"https://farm5.staticflickr.com/4010/4344237662_4a094cd73c.jpg"},
    {name:"Billy Goats Gruff", image:"https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
    {name:"Trap Pond", image:"https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"},
    {name:"Silver Lake", image:"https://farm3.staticflickr.com/2765/4240509073_d34393d09d.jpg"},
    {name:"Trap Pond", image:"https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"},
    {name:"Silver Lake", image:"https://farm3.staticflickr.com/2765/4240509073_d34393d09d.jpg"},
    {name:"New River", image:"https://farm5.staticflickr.com/4010/4344237662_4a094cd73c.jpg"},
    {name:"Trap Pond", image:"https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"},
    {name:"Silver Lake", image:"https://farm3.staticflickr.com/2765/4240509073_d34393d09d.jpg"},
    {name:"New River", image:"https://farm5.staticflickr.com/4010/4344237662_4a094cd73c.jpg"},
    {name:"Billy Goats Gruff", image:"https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
    ];

app.get("/", function(req, res){
  res.render("landing");
  });


app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds:campgrounds});
  });

app.post("/campgrounds", function(req, res){
  var name= req.body.name;
  var image= req.body.image;
  var newCampground= {name:name, image:image};
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is open and listening.");
});