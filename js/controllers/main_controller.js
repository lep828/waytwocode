angular
  .module("PairProgramming")
  .controller("MainController", MainController);

MainController.$inject = ['GithubService', 'CodeMirrorService', 'jsTreeService', '$firebaseObject', '$stateParams'];
function MainController(GithubService, CodeMirrorService, jsTreeService, $firebaseObject, $stateParams){
  var self        = this;
  self.repos      = GithubService.repos;
  self.commitForm = commitForm;
  self.commit     = {};
  self.init       = init;

  // var ref = firebase.database().ref($stateParams.key);
  var ref = firebase.database().ref();

  ref.on('value', function(data) {
    var tree = data.val()[$stateParams.key];

    jsTreeService.buildTree(tree);

    if (jsTreeService.file) {
      var newContent = atob(tree.core.data[jsTreeService.node].content);
      jsTreeService.content = newContent;
      CodeMirrorService.changeFile(newContent, jsTreeService.file, jsTreeService.node);
    }
  });

  ref.on("child_added", function(data){
    if (!$stateParams.key) return false;
    // console.log("CHILD ADDED", data.val());
    // var tree = data.val();
    // jsTreeService.buildTree(tree);
  });

  ref.once('value').then(function(data){
    if (!$stateParams.key) return false;
    console.log("ONCE");
    var key = $stateParams.key;
    CodeMirrorService.createCodeMirror();

    // ref.child(key).once("value").then(function(data){
    //   var tree = data.val();
    //   console.log("TREE DATA IS HERE",tree);
    //   self.repo = tree.repo;
    //   self.token = tree.token;
    //   jsTreeService.buildTree(tree);
    // });
  });

  function commitForm(){
    var message  = self.commit.message;
    var data     = CodeMirrorService.getValue();
    var filePath = jsTreeService.filePath;
    GithubService.makeCommit(filePath, data, message, self.repo, self.token);
  }

  function init(){
    GithubService.start();
  }
}
