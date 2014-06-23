var constants = require('./constants.js');

Boss = function () {
  this.name = constants.MONSTER_NAME[Math.floor(Math.random()*constants.MONSTER_NAME.length)];
  this.legend = this.name + ', ' + constants.MONSTER_DESCRIBE[Math.floor(Math.random()*constants.MONSTER_DESCRIBE.length)] + ' of ' + constants.MONSTER_VICTIM[Math.floor(Math.random()*constants.MONSTER_VICTIM.length)];
  this.level = 1;
}
