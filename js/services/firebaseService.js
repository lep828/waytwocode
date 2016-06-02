angular
  .module("PairProgramming")
  .service("FirebaseService", FirebaseService);

FirebaseService.$inject = ["$state"];
function FirebaseService($state){
  var self = this;

  self.addData    = addData;
  self.updateNode = updateNode;
  self.createKey  = createKey;
  self.getData    = getData;

  function getData(key){
    url = "/get_data/" + key;
    $.ajax({
      url: url
    }).done(function(res){
      console.log("got ", res);
    });
  }

  function createKey(){
    $.ajax({
      url: "/key"
    }).done(function(res){
      // console.log(res.key);
      self.key = res.key;
    });
  }

  function updateNode(node, data){
    $.ajax({
      url: "/update/" + self.key + "/" + node,
      method: "POST",
      data: data
    }).done(function(res){
      // console.log(atob(res.content));
      console.log("updated node in firebase");
    });
  }

  function addData(data){
    $.ajax({
      url: "/add/" + self.key,
      method: "POST",
      data: data
    }).done(function(res){
      console.log("added to firebase");
      // console.log("this", res);
    });
  }
}
