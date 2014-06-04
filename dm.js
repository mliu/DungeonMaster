//Vars for simplicity
console.log("Setting up vars");

var dm = require('./init.js')
var config = require('./config.js');
var ch = config.options.channels[0];
var chListener = 'message' + ch;
var adventure = false;

//Connected. Breaks for some reason.
// dm.connect(function(){
//   console.log('Connected');
// });

//Introduce
dm.once(chListener, function(from, message){
  dm.say(ch, "Greetings adventurers! I can help you embark on a legendary quest. Type in .adventure to start one! Type .help to learn more.");
});

//Adding channel message listener
dm.addListener(chListener, function(from, message){
  //Listen for game start
  if(!adventure && message.indexOf('.adventure') > -1){
    console.log(from + " is starting a game");
    dm.say(ch, from + " has decided to lead an adventure, which will embark in 5 minutes! Anyone wishing to join type .join");
    adventure = true;
  }

  //Listen for joins
  else if(adventure && message.indexOf('.join') > -1){
    console.log(from + " joins");
    dm.say(ch, from + " rises for the quest! Type .join to do the same.");
  }
});