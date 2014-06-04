var irc = require('irc');
var config = require('./config.js')

var dm = new irc.Client(config.server, config.botName, {
    channels: config.channels, port: config.port, sasl: config.sasl
});