angular
  .module("PairProgramming")
  .controller("MainController", MainController);

MainController.$inject = ['GithubService'];
function MainController(GithubService){
  var self = this;
  self.repos = GithubService.repos;

  $("#repositories").on("click", function(){
    GithubService.start();
    // var user = GithubService.user;
    // console.log(user, "here");
  });
}
