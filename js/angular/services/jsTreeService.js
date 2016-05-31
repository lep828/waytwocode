angular
  .module("PairProgramming")
  .service("jsTreeService", jsTreeService);

jsTreeService.$inject = ["CodeMirrorService"];
function jsTreeService(CodeMirrorService){
  var self = this;

  self.getSha = getSha;

  function getSha(repo, token){
    $.ajax({
      url: "https://api.github.com/repos/" + repo + "/git/refs/heads/master?access_token=" + token,
      dataType: "jsonp"
    }).done(function(response){
      // console.log("First response", response);
      var sha = response.data.object.sha;
      getTree(repo, token, sha);
    });
  }

  function getTree(repo, token, sha){
    $.ajax({
      url: "https://api.github.com/repos/" + repo + "/git/trees/" + sha + "?recursive=1&access_token=" + token,
      dataType: "jsonp"
    }).done(function(response){
      // console.log("Second response", response);
      var tree  = response.data.tree;
      buildTree(repo, tree);
    });
  }

  function buildTree(repo, tree){
    var treeParents = {};

    tree.forEach(function(node){
      treeParents[node.path] = tree.indexOf(node);
    });

    // console.log(treeParents);

    var jsTreeData = tree.map(function(node){
      var parent     = node.path.split("/");
      var treeData ={};

      treeData.id     = treeParents[parent.join("/")];
      treeData.text   = parent.length === 1 ? node.path : parent[parent.length-1];
      treeData.parent = "#";

        if (parent.length > 1) {
          var tempParent = node.path.split("/");
          tempParent.pop();
          var parentPath = tempParent.join("/");
          // console.log(node.path, parentPath, treeParents[parentPath]);
          treeData.parent = treeParents[parentPath];
        }
      // console.log(treeData);

      return treeData;
    });

    var postData = {
      'core' : {
        'data' : jsTreeData
        }
      };

    $.ajax({
      url: "/add",
      data: postData,
      method: "POST"
    }).done(function(res){
      console.log(res);
    });

    $.ajax({
      url: "/get"
    }).done(function(res){
      console.log(res);
    });

    $('#jstree').on('select_node.jstree', function (e, data) {
      var path = data.instance.get_path(data.node,'/');
      if (!path.match(/(?:\.html|\.js|\.css|\.scss|\.sass|\.rb|\.php|\.erb|\.ejs|\.md)/)) return false;

      var raw  = "https://raw.githubusercontent.com/" + repo + "/master/" + path;

      var node = data.instance._data.core.selected[0];

      CodeMirrorService.init(raw, path, node);
    }).jstree({ 'core' : {
      'data' : jsTreeData
    } });
  }
}
