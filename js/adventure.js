var dm = require('./dm.js');
var constants = require('./constants.js');
var db = dm.db;
var PARTYMAX = constants.PARTYMAX;
require('./character.js');
require('./boss.js');
// require('./monster.js');

Adventure = function () {
  //Default playercount to max party size
  this.playerCount = PARTYMAX;
  this.game = null;
  this.boss = null;
}

Adventure.prototype.startAdventure = function (channel) {
  console.log("start adventure");
  var gpColl = db.collection('gpRouting');
  var gamesColl = db.collection('games');
  var monsterColl = db.collection('monsters');
  var gmRouting = db.collection('gmRouting');
  gamesColl.find({}).sort({_id:-1}).toArray(function(err, arr){
    this.game = arr[0];
  }, this);
  //Generate boss
  this.boss = new Boss();
  monsterColl.insert({ boss: this.boss }, {w: 1}, function(err, obj){
    gmRouting.insert({ game: this.game._id, monster: obj._id });
  }, this);
  //TODO: Generate location nodes
  //Generate adventure embark dialog
  return JSON.stringify[{ channel: channel, message: 'QUEST: Seek out and kill ' + this.boss.legend }];
}

Adventure.prototype.genEvent = function () {

}