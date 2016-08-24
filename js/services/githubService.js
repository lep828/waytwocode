(function(){
  'use strict';

  angular
  .module("PairProgramming")
  .service("GithubService", GithubService);

  GithubService.$inject = ["jsTreeService", "$http"];
  function GithubService(jsTreeService, $http){
    var self = this;

    self.start      = getToken;
    self.makeCommit = makeCommit;
    self.repos = [];

    function getToken(){
      $http.get('https://waytwocode.herokuapp.com/token').then(function(res){
        // $http.get('http://localhost:3000/token').then(function(res){
        var token = res.data.token;
        if(!token) return false;
        $("#githubLogin").hide();
        self.token = token;
        getRepos(token);
      });
    }

    function getRepos(token){
      $http.get("https://api.github.com/user/repos?access_token=" + token).then(function(res){
        res.data.forEach(function(repo){
          self.repos.push(repo);
        });

        $(".list-group").delegate(".list-group-item", "click", function(event){
          var repo = event.currentTarget.id;
          self.repo = repo;
          jsTreeService.getSha(repo, token);
        });
      });
    }

    function makeCommit(filePath, content, message, repo, token) {
      var repository = repo ? repo : self.repo;
      var access_token = token ? token : self.token;
      var url = "https://api.github.com/repos/"+repository+"/contents/"+filePath;

      return $http.get(url).then(function(response) {
        var sha = response.data.sha;
        var data = {
          message: message,
          content: content,
          sha: sha
        };
        var config = {
          params: {
            path: filePath,
            access_token: access_token
          }
        };
        $http.put(url, data, config).then(function(res){
          console.log(res);
        });
      });
    }
  }
})();
