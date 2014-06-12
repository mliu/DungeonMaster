//Vars
var dm = require('./dm.js');
var db = dm.db;
var PARTYMAX = dm.PARTYMAX;
require('./character.js');

exports.identifyPlayer = function(req, res){
  var name = req.body.name;
  var playersColl = db.collection('players');
  playersColl.update({ name: name }, {$set: { identified: true }}, { multi: false }, function(err){
    if(!err){
      return res.send(JSON.stringify([{ channel: name, message: "You are now identified! You can now execute sensitive commands."}]));
    } else {
      return res.send(JSON.stringify([{ channel: name, message: "You are identified, but there were errors writing data" }]));
    }
  });
};

exports.playerIdentified = function(req, res){
  var name = req.body.name;
  var playersColl = db.collection('players');
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
};

//Generate a new character
exports.newPlayer = function(req, res){
  var name = req.body.name;
  var playersColl = db.collection('players');
  var player = playersColl.find({ name: name }).limit(1);
  player.count(function(err, count){
    if(count > 0){
      console.log("Found existing player");
      return res.send(JSON.stringify([{channel: name, message: "You already have an existing character. If you would like to delete this character please type .delete"}]));
    } else {
      console.log("Creating new player");
      playersColl.insert({ name: name, identified: false, ready: false }, {w: 1}, function(err, obj){
        return res.send(JSON.stringify([{channel: name, message: "Character created for " + name + "! Please choose your character's class: 1: Warrior, 2: Archer, 3: Mage, 4: Cleric, 5: Rogue (e.g. '.choose 3')"}]));
      });
    }
  });
};

//Choose player class
exports.choosePlayerClass = function(req, res){
  var name = req.body.name;
  var clazz = req.body.clazz;
  var playersColl = db.collection('players');
  playersColl.find({ name: name }).limit(1).toArray(function(err, arr){
    if(arr.length == 0){
      return res.send(JSON.stringify([{channel: name, message: "No character found!"}]));
    }
    else if(arr[0].ready == false) {
      playersColl.update({ name: name }, { $set: { character: Character(clazz) } }, { multi: false });
      return res.send(JSON.stringify([{channel: name, message: "Your character is ready for adventure!"}]));
    } else {
      return res.send(JSON.stringify([{channel: name, message: "Your character's class has already been chosen."}]))
    }
  });
};

//Delete a character
exports.deletePlayer = function(req, res){
  var name = req.body.name;
  var playersColl = db.collection('players');
  playersColl.count({ name: name }, function(err, count){
    if(count == 0){
      console.log("No player found for deletion");
      return res.send(JSON.stringify([{channel: name, message: "You don't have a character for your account! Type .generate to make one."}]));
    } else {
      console.log("Removing player " + name);
      playersColl.remove({ name: name }, { justOne: true }, function(err, callback){
        return res.send(JSON.stringify([{channel: name, message: "Your character has been deleted. Type .generate to make a new one!"}]));
      });
    }
  });
};

//Create a new adventure
exports.joinGame = function(req, res){
  var name = req.body.name;
  var playersColl = db.collection('players');
  var gpColl = db.collection('gpRouting');
  var gamesColl = db.collection('games');
  var player = playersColl.find({ name: name });

  playersColl.count({ name: name, ready: true }, function(err, count){
    if(count > 0){
      //Use player in database
      player.toArray(function(err, pArr){
        playerId = pArr[0]._id;
        var recentGames = gamesColl.find({}).sort({_id:-1});
        recentGames.toArray(function(err, arr){
          //If there is an active game waiting for joins
          if(arr.length > 0 && arr[0].active){
            //Insert player into database
            //Check if party is full or not
            gpColl.count({ game: arr[0]._id }, function(err, party){
              if(party == PARTYMAX){
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
                    gpColl.count({ game: arr[0]._id }, function(err, party2){
                      if(party2 == PARTYMAX){
                        return res.send(JSON.stringify([{channel: req.body.channel, message: name + " rises for the adventure!"}, {channel: req.body.channel, message: "Eager to begin, our " + PARTYMAX + " bold adventurers set out for mysterious lands!", success: true }]));
                      } else {
                        return res.send(JSON.stringify([{channel: req.body.channel, message: name + " rises for the adventure!"}]));
                      }
                    });
                  }
                });
              }
            });
          } else {
            //Create game and...
            gamesColl.insert({ active: true }, {w: 1}, function(err, obj){
              //insert player into database
              console.log("Creating new adventure");
              gpColl.insert({ player: playerId, game: obj[0]._id });
              return res.send(JSON.stringify([{channel: req.body.channel, message: name + " has decided to lead an adventure, which will embark when 4 more join! Anyone wishing to join type .adventure"}]));
            });
          }
        });
      });
    } else {
      //Create new player
      console.log("Sending player gen request back");
      player.toArray(function(err, pArray){
        if (pArray.length != 0 && pArray[0].ready == false){
          return res.send(JSON.stringify([{channel: req.body.channel, message: "Please choose your character's class before joining. Check PM for more info."}, {channel: req.body.name, message: "Please choose your character's class: 1: Warrior, 2: Archer, 3: Mage, 4: Cleric, 5: Rogue (e.g. '.choose 3')"}]));
        } else {
          return res.send(JSON.stringify([{channel: req.body.channel, message: "Please create your character before joining. Check PM for more info."}, {channel: req.body.name, message: "To begin character generation, please type .generate"}]));
        }
      });
    }
  });
};