var irc = require('irc');
var config = require('./js/config.js');
var express = require('express');
var mongo = require('mongodb');

var app = express();

console.log("Setting up express app");
app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
});

console.log("Setting up mongodb");
var Server = mongo.Server,
  Db = mongo.Db,
  BSON = mongo.BSONPure;

console.log("Connecting to server");
var server = new Server('localhost', 27017, {auto_reconnect: true});

console.log("Setup game database");
db = new Db('dmdb', server);

console.log("Connected to 'dmdb' database");
db.open(function(err, db){
  if(!err){
    console.log("Connecting to games collection");
    db.collection('games', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'games' collection. Creating empty collection");
        db.collection('games', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });

    console.log("Connecting to players collection");
    db.collection('players', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'players' collection. Creating empty collection");
        db.collection('players', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      } else {
        //Reset identificatin
        collection.update({}, {$set: { identified: false }}, { multi: true }, function(err){
          if(err){
            console.log('Error in mass update of identified');
          } else {
            console.log('Resetting all identified');
          }
        });
      }
    });

    console.log("Connecting to items collection");
    db.collection('items', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'items' collection. Creating empty collection");
        db.collection('items', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });

    console.log("Connecting to maps collection");
    db.collection('maps', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'maps' collection. Creating empty collection");
        db.collection('maps', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });

    console.log("Connecting to monsters collection");
    db.collection('monsters', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'monsters' collection. Creating empty collection");
        db.collection('monsters', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });

    console.log("Routing games and players");
    db.collection('gpRouting', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'gpRouting' collection. Creating empty collection");
        db.collection('gpRouting', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });

    console.log("Routing players and items");
    db.collection('piRouting', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'piRouting' collection. Creating empty collection");
        db.collection('piRouting', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });

    console.log("Routing games and monsters");
    db.collection('gmRouting', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'gmRouting' collection. Creating empty collection");
        db.collection('gmRouting', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });
  }
});

console.log("Creating bot with following config:");
console.log(config);
var dm = new irc.Client(config.server, config.botName, config.options);
console.log("Created, trying to join");

module.exports.dm = dm;
module.exports.db = db;
module.exports.app = app;
require('./js/dm.js');