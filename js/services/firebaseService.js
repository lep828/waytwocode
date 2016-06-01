angular
  .module("PairProgramming")
  .service("FirebaseService", FirebaseService);

FirebaseService.$inject = ["$state"];
function FirebaseService($state){
  var self = this;

  self.addData    = addData;
  self.updateNode = updateNode;
  self.createKey  = createKey;

  function createKey(){
    $.ajax({
      url: "/key"
    }).done(function(res){
      console.log(res.key);
      self.key = res.key;
    });
  }

  function updateNode(node, data){
    $.ajax({
      url: "/update/" + self.key + "/" + node,
      method: "POST",
      data: data
    }).done(function(res){
      console.log(atob(res.content));
      // console.log("updated stuff");
    });
  }

  function addData(data){
    $.ajax({
      url: "/add/" + self.key,
      method: "POST",
      data: data
    }).done(function(res){
      console.log(res);
      // self.key = res.key;
      // $state.go("code", { key: res.key });
    });
  }
}
