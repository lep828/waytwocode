angular
  .module("PairProgramming")
  .service("FirebaseService", FirebaseService);

FirebaseService.$inject = ["$state", "$http"];
function FirebaseService($state, $http){
  var self = this;

  self.addData    = addData;
  self.updateNode = updateNode;
  self.createKey  = createKey;
  self.getData    = getData;

  function getData(key){
    url = "/get_data/" + key;
    $http.get(url).then(function(res){
      console.log("got", res);
    });
  }

  function createKey(){
    $http.get("/key").then(function(res){
      self.key = res.data.key;
    });
  }

  function updateNode(node, data){
    var url = "/update/" + self.key + "/" + node;
    $http.post(url, data).then(function(res){
      // console.log(res);
      console.log("updated in firebase");
    });
  }

  function addData(data, repo){
    data.repo = repo;
    console.log(data);
    var url = "/add/" + self.key;
    $http.post(url, data).then(function(res){
      // console.log(res);
      console.log("added to firebase");
    });
  }
}
