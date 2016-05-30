angular
  .module("PairProgramming", ["ui.router", "ngResource"])
  .config(MainRouter);

MainRouter.$inject = ["$stateProvider"];
function MainRouter($stateProvider){
  console.log("hi");
}
