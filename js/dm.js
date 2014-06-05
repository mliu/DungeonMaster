//Vars for simplicity
console.log("Setting up vars");

var request = require('request');
var dm = require('../init.js').dm;
var db = require('../init.js').db;
var app = require('../init.js').app;
var config = require('./config.js');
var ch = config.options.channels[0];
var chListener = 'message' + ch;
var adventure = false;
//Module
module.exports.db = db;
//API functions
var api = require('./api.js');

//Start up express server
app.post('/games', api.newGame);
app.listen(3000);
console.log('Listening on port 3000');

//Introduce
dm.once(chListener, function(from, message){
  dm.say(ch, "Greetings adventurers! I can help you embark on a legendary quest. Type in .adventure to start one! .help to learn more.");
});

//Adding channel message listener
dm.addListener(chListener, function(from, message){
  //Listen for help pm
  if(message.indexOf('.help') == 0){
    console.log("Generating help for " + from);
    dm.say(from, "Hello! I'm an IRC bot created by Michael Liu to help brave adventurers fight legendary monsters and beasts.");
    dm.say(from, "When an adventure starts, it plays until either the players defeat the boss or are all eliminated. Only one adventure can be running at a time.");
    dm.say(from, "Every user (denoted by their nickname) has a single character that they use anytime they choose to join an adventure. A user can only have one character at a time, and must delete their current character to start a new one. Characters can be constantly improved stats-wise and item-wise by playing through adventures.");
    dm.say(from, "When you first create a character, you must roll your stats. High strength means you'll be dealing out tons of damage! High defence means you can take more of a beating and still come out fine. High intelligence improves the power of your heals and spells. High agility means you're more likely to strike first in a battle and strike more than once!");
    dm.say(from, "The more people that join an adventure, the merrier! As more people join an adventure, gold, experience, and item potential gains are increased. Who knows, maybe you'll be the one to snag a 'Godly Lizard Flail.' Keep an eye out for the final boss in every adventure though! If you can survive until the end, you will be able to reap the glorious spoils of the adventure.");
    dm.say(from, "random stuff");
  }

  //Listen for game start
  if(!adventure && message.indexOf('.adventure') == 0){
    console.log(from + " is starting a game");

    request.post(
      'http://localhost:3000/games',
      { form: { name: from }},
      function(error, response, body){
        console.log("response received");
        if(!error && response.statusCode == 200){
          dm.say(ch, body);
        }
      }
    );
  }

  //Listen for joins
  else if(adventure && message.indexOf('.join') == 0){
    console.log(from + " joins");
    dm.say(ch, from + " rises for the quest! ");
  }
});