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
  // console.log(ref);

  self.data = $firebaseObject(ref);
  // console.log(self.data);

  ref.on('value', function(data){
    console.log("something happened!");
    console.log(self.data);
  });

  function commitForm(){
    var message  = self.commit.message;
    var data     = CodeMirrorService.getValue();
    var filePath = CodeMirrorService.filePath;
    GithubService.makeCommit(filePath, data, message);
  }

  $("#repositories").on("click", function(){
    GithubService.start();
  });
}
