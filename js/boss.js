require('./constants.js');

function Boss(){
  this.name = MONSTER_NAME[Math.floor(Math.random()*MONSTER_NAME.length)];
  this.legend = this.name + ", " + MONSTER_DESCRIBE[Math.floor(Math.random()*MONSTER_DESCRIBE.length)] + " of " + MONSTER_VICTIM[Math.floor(Math.random()*MONSTER_VICTIM.length)];
  this.level = 1;

}