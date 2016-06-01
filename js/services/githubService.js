angular
  .module("PairProgramming")
  .service("GithubService", GithubService);

GithubService.$inject = ["jsTreeService"];
function GithubService(jsTreeService){
  var self = this;

  self.start    = getToken;
  self.getUser  = getUser;

  function getUser(){
    $.ajax({
      url: "https://api.github.com/user?access_token=" + self.token,
    }).done(function(res){
      self.user = res;
    });
  }

  function getToken(){
    $.ajax({
      url: "/token",
      dataType: "json"
    }).done(function(res){
      var token = res.token;
      if(!token) return false;
      $("#githubLogin").hide();
      self.token = token;
      getRepo(token);
    });
  }

  function getRepo(token){
    getUser();
    $.ajax({
      url: "https://api.github.com/user/repos?access_token=" + token
    }).done(function(res){
        $("#repos").empty();
      res.forEach(function(repo){
        $("#repos").append("<li>" + repo.full_name + "</li>");
      });
      $("#repos").delegate("li", "click", function(event){
        var repo = event.target.innerHTML;
        $("#repos").hide();
        jsTreeService.getSha(repo, token, self.user);
      });
    });
  }
}
