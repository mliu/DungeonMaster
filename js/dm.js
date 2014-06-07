require('./func.js');

//Vars for simplicity
console.log("Setting up vars");

var request = require('request');
var dm = require('../init.js').dm;
var db = require('../init.js').db;
var app = require('../init.js').app;
var config = require('./config.js');
var ch = config.options.channels[0];
var chListener = 'message' + ch;
var path = config.host + ":" + config.port;
var accResponse = ["0", "1", "2"];
var validMessage = [".delete", ".adventure"];
//API setup
module.exports.db = db;
var api = require('./api.js');

//Route api calls
//Games
app.post('/games', api.joinGame);
//Players
app.post('/players', api.newPlayer);
app.post('/players/delete', api.deletePlayer);
app.get('/players/identify', api.playerIdentified);
app.post('/players/identify', api.identifyPlayer);

//Startup express server
app.listen(3000);
console.log('Listening on port 3000');

//Introduce
dm.once(chListener, function(from, message){
  dm.say(ch, "Greetings adventurers! I can help you embark on a legendary quest. Type in .adventure to start one! .help to learn more.");
});

//Adding channel message listener
dm.addListener('message', function(from, to, message){
  //Listen for help
  if(message.indexOf('.help') == 0){
    console.log("Generating help for " + from);
    dm.say(from, "Hello! I'm an IRC bot created by Michael Liu to help brave adventurers fight legendary monsters and beasts.");
    dm.say(from, "When an adventure starts, it plays until either the players defeat the boss or are all eliminated. Only one adventure can be running at a time.");
    dm.say(from, "Every user (denoted by their nickname) has a single character that they use anytime they choose to join an adventure. A user can only have one character at a time, and must delete their current character to start a new one. Characters can be constantly improved stats-wise and item-wise by playing through adventures.");
    dm.say(from, "When you first create a character, you must roll your stats. High strength means you'll be dealing out tons of damage! High defence means you can take more of a beating and still come out fine. High intelligence improves the power of your heals and spells. High agility means you're more likely to strike first in a battle and strike more than once!");
    dm.say(from, "The more people that join an adventure, the merrier! As more people join an adventure, gold, experience, and item potential gains are increased. Who knows, maybe you'll be the one to snag a 'Godly' item. Keep an eye out for the final boss in every adventure though! If you can survive until the end, you will be able to reap the glorious spoils of the adventure.");
    dm.say(from, "random stuff");
  }

  //Listen for character creation
  if(message.indexOf('.generate') == 0){
    console.log(from + " attempting to gen. character");
    //Make request
    request.post(
      path + '/players',
      { form: { name: from }},
      function(error, response, body){
        console.log("response received /players");
        if(!error && response.statusCode == 200){
          forEach(body, function(obj){
            dm.say(obj.channel, obj.message);
            //Listen for rolls?
          });
        }
      }
    );
  }

  //Sensitive functions that need identification to execute
  else if (validMessage.indexOf(message) > -1){
    console.log("identifying " + name);
    request.get(
      path + '/players/identify',
      { form: { name: from }},
      function(error, response, body){
        console.log("response received player/identify");
        if(!error && response.statusCode == 200){
          if(body == "true") {
            //Player identified
            if(message.indexOf('.delete') == 0){
              //Make request
              console.log("deleting " + name);
              request.post(
                path + '/players/delete',
                { form: { name: from }},
                function(error, response, body){
                  console.log("response received /players/delete");
                  if(!error && response.statusCode == 200){
                    forEach(body, function(obj){
                      console.log(obj);
                      dm.say(obj.channel, obj.message);
                    });
                  }
                }
              );
            }

            //Listen for game starts
            else if(message.indexOf('.adventure') == 0){
              //Make request
              console.log(name + " join/start adventure")
              request.post(
                path + '/games',
                { form: { name: from, channel: ch }},
                function(error, response, body){
                  console.log("response received /games");
                  if(!error && response.statusCode == 200){
                    forEach(body, function(obj){
                      dm.say(obj.channel, obj.message);
                    });
                  }
                }
              );
            }
          } else {
            dm.say(ch, "Before executing sensitive commands, I need to identify your character first...")
            dm.say("nickserv", "acc " + from);
          }
        }
      }
    )
  }

});

dm.addListener('notice', function(nick, to, text, message){
  if(nick == "NickServ" && text[text.length-1] == "3"){
    //Player is identified
    console.log("nickserv response");
    request.post(
      path + '/players/identify',
      { form: { name: text.substr(0, text.indexOf(" ")) }},
      function(error, response, body){
        console.log("response received /players/identify");
        forEach(body, function(obj){
          dm.say(obj.channel, obj.message);
        });
      }
    );
  } else if(nick == "NickServ" && accResponse.indexOf(text[text.length-1]) > -1){
    dm.say(text.substr(0, text.indexOf(" ")), "You are not identified with the Nickserv.");
  }
});