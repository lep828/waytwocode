angular
  .module("PairProgramming")
  .service("GithubService", GithubService);

GithubService.$inject = ["jsTreeService"];
function GithubService(jsTreeService){
  var self = this;

  self.start = getToken;
  self.repos = [];

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
    $.ajax({
      url: "https://api.github.com/user/repos?access_token=" + token
    }).done(function(res){
      console.log(res);
        $("#card-deck").empty();
      res.forEach(function(repo){
        $("#card-deck").append(
        '<div class="card" id='+repo.full_name+'>'+
          '<div class="card-block">'+
            '<h4 class="card-title">'+repo.name+'</h4>'+
            '<p class="card-text">'+repo.description+'</p>'+
          '</div>'+
        '</div>');
        // $("#repos").append("<li>" + repo.full_name + "</li>");
      });

      $(".card").on("click", function(event){
        console.log(event.currentTarget.id);
        var repo = event.currentTarget.id;
        jsTreeService.getSha(repo, token);
      });
    });
  }
}
