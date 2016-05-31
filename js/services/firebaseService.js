angular
  .module("PairProgramming")
  .service("FirebaseService", FirebaseService);

function FirebaseService(){
  var self = this;

  self.addData = addData;
  self.updateNode = updateNode;

  function updateNode(node, data){
    $.ajax({
      url: "/update/" + node,
      method: "POST",
      data: data
    }).done(function(res){
      console.log(res);
    });
  }

  function addData(data){
    $.ajax({
      url: "/add",
      data: data,
      method: "POST"
    }).done(function(res){
      console.log(res);
    });
  }
}
