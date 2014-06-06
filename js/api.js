//Vars
var db = require('./dm.js').db;

//Generate a new character
exports.newPlayer = function(req, res){
  var name = req.body.name;
  console.log("Creating new player");
  db.collection('players', function(err, playersColl){
    if(!err){
      var player = playersColl.find({ "name": name }).limit(1);
      player.count(function(err, count){
        if(!err){
          if(count > 0){
            console.log("Found existing player");
            return res.send(JSON.stringify([{channel: name, message: "You already have an existing character. If you would like to delete this character please type .delete"}]));
          } else {
            console.log("Creating new player");
            playersColl.insert({ name: name } , { safe: true } , function(err, obj){
              if(!err){
                return res.send(JSON.stringify([{channel: name, message: "Character created!"}]));
                //Stats? Rolls?
              } else {
                console.log("ERROR IN NEWPLAYER INSERT");
              }
            });
          }
        }
      });
    } else {
      console.log("ERROR IN NEWPLAYER COLLECTION");
    }
  });
};

//Delete a character
exports.deletePlayer = function(req, res){
  var name = req.body.name;
  console.log("finding player");
  db.collection('players', function(err, playersColl){
    if(!err){
      var player = playersColl.find({ "name": name });
      console.log(player);
      player.count(function(err, count){
        if(!err){
          console.log(count);
          if(count == 0){
            console.log("No player found");
            return res.send(JSON.stringify([{channel: name, message: "You don't have a character for your account! Type .generate to make one."}]));
          } else {
            playersColl.remove({ name: name }, true);
            return res.send(JSON.stringify([{channel: name, message: "Your character has been deleted. Type .generate to make a new one!"}]));
          }
        } else {
          console.log("ERROR IN DELETEPLAYER COUNT");
        }
      });
    } else {
      console.log("ERROR IN DELETEPLAYER COLLECTION");
    }
  });
};

//Create a new adventure
exports.joinGame = function(req, res){
  var name = req.body.name;
  console.log("Creating new game");
  db.collection('players', function(err, playersColl){
    if(!err){
      var player = playersColl.find({ "name": name });
      player.count(function(err, count){
        if(!err){
          if(count > 0){
            //Use player in database
            player.toArray(function(err, arr){
              if(!err){
                playerId = arr[0]._id;
                db.collection('games', function(err, gamesColl){
                  if(!err){
                    console.log("finding game and sorting");
                    var recentGames = gamesColl.find({}).sort({_id:-1});
                    recentGames.toArray(function(err, arr){
                      if(!err){
                        //If there is an active game waiting for joins
                        if(arr.length > 0 && arr[0].active){
                          //Insert player into database
                          db.collection('gpRouting', function(err, gpColl){
                            gpColl.count({ player: playerId, game: arr[0]._id }, function(err2, num){
                              if(num > 0){
                              console.log(name + " already in adventure");
                              return res.send(JSON.stringify([{channel: req.body.channel, message: name + " you are already a part of this adventure!"}]));
                              }
                              else if(!err){
                                console.log("adding " + name + " to adventure");
                                gpColl.insert({ player: playerId, game: arr[0]._id });
                                return res.send(JSON.stringify([{channel: req.body.channel, message: name + " rises for the adventure!"}]));
                              } else {
                                console.log("ERROR IN JOINGAME GPROUTING COLLECTION 1");
                              }
                            });
                          });
                        } else {
                          //Create game and
                          gamesColl.insert({ active: true }, { safe: true }, function(err, obj){
                            //insert player into database
                            db.collection('gpRouting', function(err, gpColl){
                              if(!err){
                                gpColl.insert({ player: playerId, game: obj});
                                return res.send(JSON.stringify([{channel: req.body.channel, message: name + " has decided to lead an adventure, which will embark in 5 minutes! Anyone wishing to join type .adventure"}]));
                              } else {
                                console.log("ERROR IN JOINGAME GPROUTING COLLECTION 2");
                              }
                            });
                          });
                        }
                      } else {
                        console.log("ERROR IN JOINGAME GAMECOUNT");
                      }
                    });
                  } else {
                    console.log("ERROR IN JOINGAME COLLECTION");
                  }
                });
              } else {
                console.log("ERROR IN JOINGAME PLAYERS TOARRAY");
              }
            });
          } else {
            //Create new player
            console.log("Sending player gen request back");
            return res.send(JSON.stringify([{channel: req.body.channel, message: "Please create your character before joining. Check PM for more info."}, {channel: req.body.name, message: "To begin character generation, please type .generate"}]));
          }
        } else {
          console.log("ERROR IN JOINGAME PLAYERS COUNT");
        }
      });
    } else {
      console.log("ERROR IN JOINGAME PLAYERS COLLECTION");
    }
  });
};