angular
  .module("PairProgramming")
  .controller("MainController", MainController);

MainController.$inject = ['GithubService', 'CodeMirrorService', 'jsTreeService'];
function MainController(GithubService, CodeMirrorService, jsTreeService){
  var self = this;
  self.repos = GithubService.repos;

  $("#test").on("click", function(){
    if (!jsTreeService.sha) return false;
    var data = CodeMirrorService.getValue();
    GithubService.makeCommit('meme-runner', 'lep828', 'js/app.js', data);
  });

  $("#repositories").on("click", function(){
    GithubService.start();
    // var user = GithubService.user;
    // console.log(user, "here");
  });
}
