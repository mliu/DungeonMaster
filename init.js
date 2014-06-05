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

db.open(function(err, db){
  if(!err){
    console.log("Connected to 'dmdb' database");
    console.log("Connecting to games collection");
    db.collection('games', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'games' collection. Creating empty collection");
        db.collection('games', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });

    console.log("Connecting to users collection");
    db.collection('users', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'users' collection. Creating empty collection");
        db.collection('users', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
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

    console.log("Connecting to monsters collection");
    db.collection('monsters', {strict:true}, function(err, collection){
      if(err){
        console.log("No 'monsters' collection. Creating empty collection");
        db.collection('monsters', function(err, collection){
          collection.insert([], {safe:true}, function(err, result) {});
        });
      }
    });
  }
});

console.log("Creating bot");
var dm = new irc.Client(config.server, config.botName, config.options);
console.log("Created, trying to join");

module.exports.dm = dm;
module.exports.db = db;
module.exports.app = app;
require('./js/dm.js');