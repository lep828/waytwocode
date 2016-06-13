angular
  .module("PairProgramming", ["ui.router", "firebase"])
  .constant("URL", "https://waytwocode.herokuapp.com")
  .config(MainRouter);

MainRouter.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
function MainRouter($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  $stateProvider
    .state("splash", {
      url: "/",
      templateUrl: "views/splash.html"
    })
    .state("repos", {
      url: "/repositories",
      templateUrl: "views/repos.html"
    })
    .state("code", {
      url: "/code/:key",
      templateUrl: "views/code.html"
    });

  $urlRouterProvider.otherwise("/");
}
