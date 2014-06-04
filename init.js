var irc = require('irc');
var config = require('./config.js');

console.log("Creating bot");
var dm = new irc.Client(config.server, config.botName, config.options);
console.log("Created, trying to join");

module.exports = dm;
require('./dm.js');