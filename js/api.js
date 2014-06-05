//Vars
var db = require('./dm.js').db;

//Generate a new character
exports.newPlayer = function(req, res){
  res.send("New player response");
};

//Create a new adventure
exports.joinGame = function(req, res){
  var name = req.body.name;
  console.log("Creating new game");
  db.collection('players', function(err, collection){
    if(!err){
      var player = collection.find({ name: name });
      player.count(function(err, count){
        if(count > 0){
          //Use player in database
          var playerId = player.at(0)._id;
        } else {
          //Create new player
          res.send({channel: req.body.channel, message: "Please create your character before joining. Check PM for more info."});
          res.send({channel: req.body.name, message: "To begin character generation, please type .generate"});
        }
      });
    }
  });
  db.collection('games', function(err, collection){
    if(!err){
      console.log("finding game and sorting");
      var mostRecentGame = collection.find({}).sort({_id:-1}).limit(1);
      console.log("sending back");
      mostRecentGame.count(function(err, count){
        if(count > 0){
          //Insert player into database
          res.send({channel: req.body.channel, message: name + "rises for the quest!"});
        } else {
          //Should the players all be their own row in this database
          //Or should players have a lot of games?
          // collection.insert({gameNumber : 0, player : })
          res.send({channel: req.body.channel, message: name + " has decided to lead an adventure, which will embark in 5 minutes! Anyone wishing to join type .adventure"});
        }
      });
    }
  });
};