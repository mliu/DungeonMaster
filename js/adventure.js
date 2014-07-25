var dm = require('./dm.js');
var constants = require('./constants.js');
var db = dm.db;
var PARTYMAX = constants.PARTYMAX;
var MAPSIZE = constants.MAPSIZE;
require('./character.js');
require('./boss.js');
// require('./monster.js');

Adventure = function () {

}

Adventure.prototype.startAdventure = function (channel, callback) {
  console.log("start adventure");
  var ref = this;
  var gpColl = db.collection('gpRouting');
  var gamesColl = db.collection('games');
  var monsterColl = db.collection('monsters');
  var gmRouting = db.collection('gmRouting');
  gamesColl.find().sort({_id:-1}).toArray(function(err, arr){
    var game = arr[0];
    //Generate boss
    game.boss = new Boss();
    monsterColl.insert({ boss: game.boss }, {w: 1}, function(err, obj){
      gmRouting.insert({ game: game._id, monster: obj._id });
      //TODO: Generate location nodes
      ref.generateMap(game);
      //Generate adventure embark dialog
      callback(JSON.stringify([{ channel: channel, message: 'QUEST: Seek out and kill ' + game.boss.legend }]));
    });
  });
}

Adventure.prototype.generateMap = function (game) {
  console.log("generating map");
  for (i = 0; i < MAPSIZE; i++) {
    for (j = 0; j < MAPSIZE; j++) {

    }
  }
}

Adventure.prototype.genEvent = function () {

}