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

  // $("#commitForm").on("submit", function(){
  //   var data = CodeMirrorService.getValue();
  //   GithubService.makeCommit('meme-runner', 'lep828', 'js/app.js', data);
  // });

  $("#repositories").on("click", function(){
    GithubService.start();
    // var user = GithubService.user;
    // console.log(user, "here");
  });
}
