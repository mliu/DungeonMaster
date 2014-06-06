//Vars
var db = require('./dm.js').db;

exports.playerIdentified = function(req, res){
  var name = req.body.name;
  db.collection('players', function(err, playersColl){
    var player = playersColl.find({ name: name }).limit(1);
    player.count(function(err, count){
      if(count == 0){
        return res.send(true);
      } else {
        player.toArray(function(err, arr){
          if(arr[0].identified){
            return res.send(true);
          } else {
            return res.send(false);
          }
        });
      }
    });
  }
};

//Generate a new character
exports.newPlayer = function(req, res){
  var name = req.body.name;
  console.log("Creating new player");
  db.collection('players', function(err, playersColl){
    var player = playersColl.find({ name: name }).limit(1);
    player.count(function(err, count){
      if(count > 0){
        console.log("Found existing player");
        return res.send(JSON.stringify([{channel: name, message: "You already have an existing character. If you would like to delete this character please type .delete"}]));
      } else {
        console.log("Creating new player");
        playersColl.insert({ name: name }, function(err, obj){
          return res.send(JSON.stringify([{channel: name, message: "Character created for " + name + "! Please choose your character's class:"}]));
          //Stats? Rolls?
        });
      }
    });
  });
};

//Delete a character
exports.deletePlayer = function(req, res){
  var name = req.body.name;
  console.log("finding player");
  db.collection('players', function(err, playersColl){
    playersColl.count({ name: name }, function(err, count){
      console.log(count);
      if(count == 0){
        console.log("No player found");
        return res.send(JSON.stringify([{channel: name, message: "You don't have a character for your account! Type .generate to make one."}]));
      } else {
        console.log("Removing player");
        playersColl.remove({ name: name }, { justOne: true }, function(err, callback){
          return res.send(JSON.stringify([{channel: name, message: "Your character has been deleted. Type .generate to make a new one!"}]));
        });
      }
    });
  });
};

//Create a new adventure
exports.joinGame = function(req, res){
  var name = req.body.name;
  console.log("Creating new game");
  db.collection('players', function(err, playersColl){
    var player = playersColl.find({ name: name });
    console.log(player);
    playersColl.count({ name: name }, function(err, count){
      console.log(count);
      if(count > 0){
        //Use player in database
        player.toArray(function(err, arr){
          playerId = arr[0]._id;
          db.collection('games', function(err, gamesColl){
            console.log("finding game and sorting");
            var recentGames = gamesColl.find({}).sort({_id:-1});
            recentGames.toArray(function(err, arr){
              //If there is an active game waiting for joins
              if(arr.length > 0 && arr[0].active){
                //Insert player into database
                db.collection('gpRouting', function(err, gpColl){
                  //Check if party is full or not
                  gpColl.count({ game: arr[0]._id }, function(err, party){
                    if(party == 5){
                      return res.send(JSON.stringify([{channel: req.body.channel, message: "This adventure is full! :("}]));
                    } else {
                      gpColl.count({ player: playerId, game: arr[0]._id }, function(err, num){
                        if(num > 0){
                        console.log(name + " already in adventure");
                        return res.send(JSON.stringify([{channel: req.body.channel, message: name + " you are already a part of this adventure!"}]));
                        }
                        else{
                          console.log("adding " + name + " to adventure");
                          gpColl.insert({ player: playerId, game: arr[0]._id });
                          return res.send(JSON.stringify([{channel: req.body.channel, message: name + " rises for the adventure!"}]));
                        }
                      });
                    }
                  });
                });
              } else {
                //Create game and
                gamesColl.insert({ active: true }, function(err, obj){
                  //insert player into database
                  db.collection('gpRouting', function(err, gpColl){
                    console.log(obj._id);
                    gpColl.insert({ player: playerId, game: obj._id });
                    return res.send(JSON.stringify([{channel: req.body.channel, message: name + " has decided to lead an adventure, which will embark when 4 more join! Anyone wishing to join type .adventure"}]));
                  });
                });
              }
            });
          });
        });
      } else {
        //Create new player
        console.log("Sending player gen request back");
        return res.send(JSON.stringify([{channel: req.body.channel, message: "Please create your character before joining. Check PM for more info."}, {channel: req.body.name, message: "To begin character generation, please type .generate"}]));
      }
    });
  });
};