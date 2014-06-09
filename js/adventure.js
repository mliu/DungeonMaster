var dm = require('./dm.js');
var db = dm.db;
var PARTYMAX = dm.PARTYMAX;
require('./character.js');
require('./boss.js');
require('./monster.js');

function Adventure(){
  //Default playercount to max party size
  this.playerCount = PARTYMAX;
  this.game = null;
  this.boss = null;

  function startAdventure(){
    var gpColl = db.collection('gpRouting');
    var gamesColl = db.collection('games');
    var monsterColl = db.collection('monsters');
    var gmRouting = db.collection('gmRouting');
    var game = gamesColl.find({}).sort({_id:-1}).toArray()[0];
    //Generate boss


    //Generate adventure embark dialog
    games.toArray(function(err, arr){
      if(arr.length > 0 && arr[0].active){
        gpColl.count({ game: arr[0]._id }, function(err, party){

        });
      }
    });
  }

  function genEvent(){

  }
}