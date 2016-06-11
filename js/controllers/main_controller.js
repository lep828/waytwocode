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
    CodeMirrorService.createCodeMirror();

    ref.child(key).once("value").then(function(data){
      var tree = data.val();
      self.repo = tree.repo;
      // console.log(tree);
      self.token = tree.token;
      jsTreeService.buildTree(tree);
    });
  });

  function commitForm(){
    var message  = self.commit.message;
    var data     = CodeMirrorService.getValue();
    var filePath = CodeMirrorService.filePath;
    GithubService.makeCommit(filePath, data, message, self.repo, self.token);
  }

  $("#repositories").on("click", function(){
    GithubService.start();
  });
}
