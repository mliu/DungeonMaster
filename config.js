// Create the configuration
var config = {
  server: "irc.freenode.net",
  botName: "DungeonMaster",
  options: {
    channels: ['#dm-test'],
    port: "6667",
    sasl: false,
    floodProtection: false
  }
};

module.exports = config;