// Create the configuration
var config = {
  server: "irc.rackspace.com",
  botName: "DungeonMaster",
  host: "http://localhost",
  port: "3000",
  options: {
    userName: 'mich7532',
    password: '',
    channels: ['#test'],
    port: "6697",
    sasl: true,
    secure: true,
    floodProtection: false,
    autoRejoin: true,
    autoConnect: true,
    debug: true
  }
};

module.exports = config;