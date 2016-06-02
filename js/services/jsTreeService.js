angular
  .module("PairProgramming")
  .service("jsTreeService", jsTreeService);

jsTreeService.$inject = ["CodeMirrorService", "FirebaseService", "$state", "$http"];
function jsTreeService(CodeMirrorService, FirebaseService, $state, $http){
  FirebaseService.createKey();

  var self       = this;

  self.getSha    = getSha;
  self.buildTree = buildTree;

  function getSha(repo, token){
    $state.go("code", { key: FirebaseService.key });
    self.repo = repo;
    $("#commit").css("display", "block");

    var url = "https://api.github.com/repos/" + self.repo + "/git/refs/heads/master?access_token=" + token;
    $http.get(url).then(function(res){
      CodeMirrorService.createCodeMirror();
      // console.log("First response", res);
      var sha = res.data.object.sha;
      self.sha = sha;
      getTree(token);
    });
  }

  function getTree(token){
    var url = "https://api.github.com/repos/" + self.repo + "/git/trees/" + self.sha + "?recursive=1&access_token=" + token;
    $http.get(url).then(function(res){
      var tree  = res.data.tree;
      // console.log(tree);
      structureTree(tree);
    });
  }

  function structureTree(tree){
    var treeParents = {};

    tree.forEach(function(node){
      treeParents[node.path] = tree.indexOf(node);
    });

    var jsTreeData = tree.map(function(node){
      var parent     = node.path.split("/");
      var treeData   = {};

      treeData.id       = treeParents[parent.join("/")];
      treeData.type     = node.type === "tree" ? "folder" : "file";
      treeData.text     = parent.length === 1 ? node.path : parent[parent.length-1];
      treeData.filePath = node.path;
      treeData.parent   = "#";

      if (parent.length > 1) {
        var tempParent = node.path.split("/");
        tempParent.pop();
        var parentPath = tempParent.join("/");
        treeData.parent = treeParents[parentPath];
      }

      return treeData;
    });

    var data = { 'core' : { 'data' : jsTreeData } };
    FirebaseService.addData(data, self.repo);
    buildTree(data);
  }

    function buildTree(content){
      console.log(content, "data");

    $('#jstree').on('select_node.jstree', function (e, data) {
      var file = data.instance.get_path(data.node,'/');
      if (!file.match(/(?:\.html|\.js|\.css|\.scss|\.sass|\.rb|\.php|\.erb|\.ejs|\.md)/)) return false;

      var raw      = "https://raw.githubusercontent.com/" + content.repo + "/master/" + file;
      var node     = data.node.id;
      var filePath = data.node.original.filePath;

      CodeMirrorService.init(raw, file, node, filePath);
    }).jstree({ "core": content.core }, {
    "types" : {
      "folder" : {
        "icon" : "/images/folder.png"
      },
      "file" : {
        "icon" : "/images/file.png"
      }
    },
    "plugins" : ["types"]
   });
  }
}
