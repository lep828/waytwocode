angular
  .module("PairProgramming", ["ui.router", "ngResource"])
  .config(MainRouter);

MainRouter.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
function MainRouter($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  $stateProvider
    .state("splash", {
      url: "/",
      templateUrl: "views/splash.html"
    })
    .state("code", {
      url: "/code",
      templateUrl: "views/code.html",
      controller: "MainController",
      controllerAs: "main"
    });

  $urlRouterProvider.otherwise("/code");
}
