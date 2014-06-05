forEach = function(arr, res){
  var array = JSON.parse(arr);
  var index;
  for(index = 0; index < array.length; ++index){
    res(array[index]);
  }
};