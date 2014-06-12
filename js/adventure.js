var dm = require('./dm.js');
var db = dm.db;
var PARTYMAX = dm.PARTYMAX;
require('./character.js');
require('./boss.js');
// require('./monster.js');

Adventure = function(){
  //Default playercount to max party size
  this.playerCount = PARTYMAX;
  this.game = null;
  this.boss = null;

  function startAdventure(channel){
    var gpColl = db.collection('gpRouting');
    var gamesColl = db.collection('games');
    var monsterColl = db.collection('monsters');
    var gmRouting = db.collection('gmRouting');
    var game = gamesColl.find({}).sort({_id:-1}).toArray()[0];
    this.game = game;
    //Generate boss
    monsterColl.insert({ boss: Boss() }, {w: 1}, function(err, obj){
      gmRouting.insert({ game: game._id, monster: obj._id });
      this.boss = boss;
    });
    //TODO: Generate location nodes
    //Generate adventure embark dialog
    return JSON.stringify[{ channel: channel, message: "QUEST: Seek out and kill " + boss.legend }];
  }

  function genEvent(){

  }
}
