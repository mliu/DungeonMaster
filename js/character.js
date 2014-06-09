function Character(clazz) {
  switch(clazz){
    case "1":
      this.clazz = 1;
      this.str = 6;
      this.def = 10;
      this.intell = 2;
      this.dex = 4;
      this.level = 1;
      this.exp = 0;
      break;
    case "2":
      this.clazz = 2;
      this.str = 8;
      this.def = 6;
      this.intell = 2;
      this.dex = 6;
      this.level = 1;
      this.exp = 0;
      break;
    case "3":
      this.clazz = 3;
      this.str = 2;
      this.def = 4;
      this.intell = 10;
      this.dex = 6;
      this.level = 1;
      this.exp = 0;
      break;
    case "4":
      this.clazz = 4;
      this.str = 2;
      this.def = 8;
      this.intell = 8;
      this.dex = 4;
      this.level = 1;
      this.exp = 0;
      break;
    case "5":
      this.clazz = 5;
      this.str = 8;
      this.def = 2;
      this.intell = 2;
      this.dex = 10;
      this.level = 1;
      this.exp = 0;
      break;
  }
}