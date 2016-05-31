angular
  .module("PairProgramming")
  .service("GithubService", GithubService);

GithubService.$inject = ["jsTreeService"];
function GithubService(jsTreeService){
  var self = this;

  self.start = getToken;

  function getToken(){
    $.ajax({
      url: "/token",
      dataType: "json"
    }).done(function(res){
      var token = res.token;
      if(!token) return false;
      $("#githubLogin").hide();
      getRepo(token);
    });
  }

  function getRepo(token){
    $.ajax({
      url: "https://api.github.com/user/repos?access_token=" + token
    }).done(function(res){
      res.forEach(function(repo){
        $("#repos").append("<li>" + repo.full_name + "</li>");
      });
      $("#repos").delegate("li", "click", function(event){
        var repo = event.target.innerHTML;
        $("#repos").hide();
        jsTreeService.getSha(repo, token);
      });
    });
  }
}
