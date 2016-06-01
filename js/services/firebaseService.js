angular
  .module("PairProgramming")
  .service("FirebaseService", FirebaseService);

FirebaseService.$inject = ["$state"];
function FirebaseService($state){
  var self = this;

  self.addData = addData;
  self.updateNode = updateNode;

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
      url: "/add",
      method: "POST",
      data: data
    }).done(function(res){
      self.key = res.key;
      $state.go("code", { key: self.key });
    });
  }
}
