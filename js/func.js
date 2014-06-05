forEach = function(arr, res){
  var index;
  for(index = 0; index < arr.length; ++index){
    res(arr[index]);
  }
};