angular
.module("PairProgramming")
.service("GithubService", GithubService);

GithubService.$inject = ["jsTreeService", "$http"];
function GithubService(jsTreeService, $http){
  var self = this;

  self.start      = getToken;
  self.makeCommit = makeCommit;
  self.putCommit  = putCommit;
  self.repos = [];

  function getToken(){
    $http.get('http://localhost:3000/token').then(function(res){
      var token = res.data.token;
      if(!token) return false;
      $("#githubLogin").hide();
      self.token = token;
      getRepos(token);
    });
  }

  function getRepos(token){
    $http.get("https://api.github.com/user/repos?access_token=" + token)
      .then(function(res){
        res.data.forEach(function(repo){
          // self.repos = res.data;
          self.repos.push(repo);
        });

        $(".list-group").delegate(".list-group-item", "click", function(event){
          var repo = event.currentTarget.id;
          self.repo = repo;
          jsTreeService.getSha(repo, token);
        });
    });
  }

  function makeCommit(filePath, content, message) {
    var url = "https://api.github.com/repos/"+self.repo+"/contents/"+filePath;
    return $http.get(url)
      .then(function(response) {
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
