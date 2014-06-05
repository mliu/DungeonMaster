//Vars
var db = require('./dm.js').db;

//Generate a new character
exports.newPlayer = function(req, res){
  var name = req.body.name;
  console.log("Creating new player");
  db.collection('players', function(err, collection){
    if(!err){
      var player = collection.find({ "name": name }).limit(1);
      player.count(function(err, count){
        if(count > 0){
          console.log("Found existing player");
          return res.send(JSON.stringify([{channel: name, message: "You already have an existing character. If you would like to delete this character please type .delete"}]));
        }
      });
    }
  });
};

//Delete a character
exports.deletePlayer = function(req, res){
  var name = req.body.name;
  console.log("finding player");
  db.collection('players', function(err, collection){
    if(!err){
      var player = collection.find({ "name": name });
      console.log(player);
      player.count(function(err, count){
        console.log(count);
        if(count == null){
          console.log("No player found");
          return res.send(JSON.stringify([{channel: name, message: "You don't have a character for your account! Type .generate to make one."}]));
        } else {
          collection.remove({ name: name }, true);
          return res.send(JSON.stringify([{channel: name, message: "Your character has been deleted. Type .generate to make a new one!"}]));
        }
      });
    }
  });
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
          db.collection('games', function(err, collection){
            if(!err){
              console.log("finding game and sorting");
              var mostRecentGame = collection.find({}).sort({_id:-1}).limit(1);
              console.log("sending back");
              mostRecentGame.count(function(err, count){
                if(count > 0 && mostRecentGame.active){
                  //Insert player into database
                  return res.send(JSON.stringify([{channel: req.body.channel, message: name + "rises for the quest!"}]));
                } else {
                  //Should the players all be their own row in this database
                  //Or should players have a lot of games?
                  // collection.insert({gameNumber : 0, player : })
                  return res.send(JSON.stringify([{channel: req.body.channel, message: name + " has decided to lead an adventure, which will embark in 5 minutes! Anyone wishing to join type .adventure"}]));
                }
              });
            }
          });
        } else {
          //Create new player
          console.log("Sending player gen request back");
          return res.send(JSON.stringify([{channel: req.body.channel, message: "Please create your character before joining. Check PM for more info."}, {channel: req.body.name, message: "To begin character generation, please type .generate"}]));
        }
      });
    }
  });
};