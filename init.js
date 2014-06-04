var irc = require('irc');

var dm = new irc.Client(config.server, config.botName, {
    channels: config.channels, port: config.port, sasl: config.sasl
});