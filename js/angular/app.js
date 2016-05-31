angular
  .module("PairProgramming", ["ui.router", "ngResource"])
  .config(MainRouter);

MainRouter.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
function MainRouter($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "views/home.html",
      controller: "MainController",
      controllerAs: "main"
    });

  $urlRouterProvider.otherwise("/");
}
