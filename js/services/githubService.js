angular
.module("PairProgramming")
.service("GithubService", GithubService);

GithubService.$inject = ["jsTreeService", "$http"];
function GithubService(jsTreeService, $http){
  var self = this;

  self.start      = getToken;
  self.repos      = [];
  self.makeCommit = makeCommit;
  self.putCommit  = putCommit;

  function getToken(){
    $.ajax({
      url: "/token",
      dataType: "json"
    }).done(function(res){
      var token = res.token;
      if(!token) return false;
      $("#githubLogin").hide();
      // console.log(token);
      self.token = token;
      getRepo(token);
    });
  }

  function getRepo(token){
    $.ajax({
      url: "https://api.github.com/user/repos?access_token=" + token
    }).done(function(res){
      $("#card-deck").empty();
      res.forEach(function(repo){
        $("#card-deck").append(
          // '<div class="col-md-4">'+
            '<div class="card" id='+ repo.full_name +'>'+
              '<div class="card-block">'+
                '<h4 class="card-title">'+ repo.name +'</h4>'+
                '<p class="card-text">'+ repo.description +'</p>'+
              '</div>'+
            // '</div>'+
          '</div>'
        );
      });

      $(".card").on("click", function(event){
        // console.log(event.currentTarget.id);
        var repo = event.currentTarget.id;
        self.repo = repo;
        jsTreeService.getSha(repo, token);
      });
    });
  }

  function makeCommit(filePath, content, message) {
    // var url = "https://api.github.com/repos/"+owner+"/"+repo+"/contents/"+path;
    var url = "https://api.github.com/repos/"+self.repo+"/contents/"+filePath;
    return $http.get(url)
      .then(function(response) {
        // console.log(response.data.sha);
        var sha = response.data.sha;
        return putCommit(filePath, content, sha, url, message);
      });
  }

  function putCommit(filePath, content, sha, url, message){
    var data = {
      message: message,
      content: content,
      sha: sha,
    };
    var config = {
      params: {
        path: filePath,
        access_token: self.token
      }
    };
    $http.put(url, data, config).then(function(res){
      console.log(res);
    });
  }
}
