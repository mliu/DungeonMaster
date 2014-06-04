//Vars for simplicity
console.log("Setting up vars");

var dm = require('./init.js')
var config = require('./config.js');
var ch = config.options.channels[0];
var chListener = 'message' + ch;

//Listen for game start calls
console.log("Adding game start listeners");

dm.addListener(chListener, function(from, message){
  dm.say(ch, "I'M ALIVE!");
});

console.log("Ready for input");
