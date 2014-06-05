//Vars
var db = require('./dm.js').db;

//Create a new adventure
exports.newGame = function(req, res) {
  var leader = req.body.name;
  console.log("Creating new game");
  db.collection('games', function(err, collection){
    console.log("finding game");
    var mostRecentGame = collection.find({});
    console.log("sorting");
    mostRecentGame.sort({_id:-1}).limit(1);
    console.log("sending back");
    mostRecentGame.count(function(err, count){
      console.log("aaa");
      if(count == 0){
        //Should the players all be their own row in this database
        //Or should players have a lot of games?
        // collection.insert({gameNumber : 0, player : })
        res.send(leader + " has decided to lead an adventure, which will embark in 5 minutes! Anyone wishing to join type .join");
      }
    });
  });
};