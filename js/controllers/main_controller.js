angular
  .module("PairProgramming")
  .controller("MainController", MainController);

MainController.$inject = ['GithubService', 'CodeMirrorService', 'jsTreeService'];
function MainController(GithubService, CodeMirrorService, jsTreeService){
  var self = this;
  self.repos = GithubService.repos;
  self.commitForm = commitForm;
  self.commit = {};

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
