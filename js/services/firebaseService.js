angular
  .module("PairProgramming")
  .service("FirebaseService", FirebaseService);

FirebaseService.$inject = ["$state", "$http", "$stateParams"];
function FirebaseService($state, $http, $stateParams){
  var self = this;

  self.addData    = addData;
  self.updateNode = updateNode;
  self.createKey  = createKey;
  self.getData    = getData;

  function getData(node, cb){
    url = "/get_data/" + $stateParams.key + "/" + node;
    $http.get(url).then(function(res){
      return cb(res);
    });
  }

  function createKey(){
    $http.get("/key").then(function(res){
      self.key = res.data.key;
    });
  }

  function updateNode(node, data){
    var url = "/update/" + $stateParams.key + "/" + node;
    var content = { content: data };
    $http.post(url, content).then(function(res){
      // console.log(res);
      console.log("updated in firebase");
    });
  }

  function addData(data, repo, token){
    data.repo = repo;
    data.token = token;
    var url = "/add/" + self.key;

    setTimeout(function(){
      $http.post(url, JSON.stringify(data)).then(function(res){
        console.log("added to firebase");
      });
    }, 1000);
  }
}
