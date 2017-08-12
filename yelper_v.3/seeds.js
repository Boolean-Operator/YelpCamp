var mongoose      = require("mongoose"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment");

var data = [
  {name:"Cats Camp",
  image:"https://farm9.staticflickr.com/8579/16706717975_bdc99767d7.jpg",
  description:"Where is my human slave?"
  },
  {name:"Camp Time Portal ",
  image:"https://farm3.staticflickr.com/2921/14825424524_1acec66f35.jpg",
  description:"When is this camper going to be back with my cat toy?"
  },
  {name:"Sandy Pants Campground",
  image:"https://farm1.staticflickr.com/588/21493355700_6538ac47b0.jpg",
  description:"I sure got alot of sand in my pants."
  },
  
  ];

//SEEDS THE DB
function seedDB(){
  //REMOVES ALL CAMPGROUNDS - PURGE ALL DATA FROM DATABASE
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("All Campgrounds removed from DB!");
      //ADD A FEW CAMPGROUNDS - SEED DATABASE WITH NEW DATA
      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if(err) {
              console.log(err);
            } else {
                console.log("Added a campground.");
                //ADD comments
                Comment.create(
                  {
                    text: "This place is very nice, I just wish there was internet...and more Duff.",
                    author:"Homie"
                }, function(err,comment){
                  if(err){
                    console.log(err);
                  }else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Created new comment.");
                  }
                });
            }
          });
      });
    }
  });
}


module.exports = seedDB;