//Vars for simplicity
var ch = config.channels[0];
var chListener = 'message#' + config.channels[0];
var chSay = '#' + config.channels[0];

//Listen for game start calls
bot.addListener(chListener, function(from, message){
  bot.say(chSay, "I'M ALIVE!");
});