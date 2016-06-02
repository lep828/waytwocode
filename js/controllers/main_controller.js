angular
  .module("PairProgramming")
  .controller("MainController", MainController);

MainController.$inject = ['GithubService', 'CodeMirrorService', 'jsTreeService', '$firebaseObject', '$stateParams'];
function MainController(GithubService, CodeMirrorService, jsTreeService, $firebaseObject, $stateParams){
  var self        = this;
  self.repos      = GithubService.repos;
  self.commitForm = commitForm;
  self.commit     = {};

  var ref = firebase.database().ref();
  self.data = $firebaseObject(ref);

  ref.on('value', function(data){
    if (!$stateParams.key) return false;
    var key = $stateParams.key;
    console.log(key);
    console.log(self.data);
    console.log("here", self.data[key]);
  });

  function commitForm(){
    var message  = self.commit.message;
    var data     = CodeMirrorService.getValue();
    console.log(data);
    var filePath = CodeMirrorService.filePath;
    GithubService.makeCommit(filePath, data, message);
  }

  $("#repositories").on("click", function(){
    GithubService.start();
  });
}
