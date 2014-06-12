Character = function (clazz) {
  this.level = 1;
  this.exp = 0;
  this.gold = 0;
  switch(clazz){
    case "1":
      this.clazz = 1;
      this.str = 18;
      this.def = 30;
      this.intell = 6;
      this.dex = 12;
      break;
    case "2":
      this.clazz = 2;
      this.str = 24;
      this.def = 18;
      this.intell = 6;
      this.dex = 18;
      break;
    case "3":
      this.clazz = 18;
      this.str = 6;
      this.def = 12;
      this.intell = 30;
      this.dex = 18;
      break;
    case "4":
      this.clazz = 12;
      this.str = 6;
      this.def = 24;
      this.intell = 24;
      this.dex = 12;
      break;
    case "5":
      this.clazz = 5;
      this.str = 24;
      this.def = 6;
      this.intell = 6;
      this.dex = 30;
      break;
  }
}
