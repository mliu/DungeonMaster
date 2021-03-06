var PARTYMAX = 1;

var DEBUG = true;

var MAPSIZE = 5;

var MONSTER_NAME = [
  "BANE",
  "CRUUL",
  "FLINT",
  "KEVIN",
  "NAXX",
  "MANCE"
];

var MONSTER_DESCRIBE = [
  "killer",
  "destroyer",
  "conqueror",
  "eater",
  "slayer",
  "gobbler"
];

var MONSTER_VICTIM = [
  "men",
  "villages",
  "kingdoms",
  "crops",
  "pets",
  "souls"
];

var MONSTER_TYPE = [
  { single: "Goblin", multi: "Goblins", group: "gang" },
  { single: "Zombie", multi: "Zombies", group: "group" },
  { single: "Werewolf", multi: "Werewolves", group: "pack" },
  { single: "Cyclops", multi: "Cyclops", group: "group"}
];

module.exports.PARTYMAX = PARTYMAX;
module.exports.DEBUG = DEBUG;
module.exports.MAPSIZE = MAPSIZE;
module.exports.MONSTER_NAME = MONSTER_NAME;
module.exports.MONSTER_DESCRIBE = MONSTER_DESCRIBE;
module.exports.MONSTER_VICTIM = MONSTER_VICTIM;
module.exports.MONSTER_TYPE = MONSTER_TYPE;