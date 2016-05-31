$(function(){

  $.ajax({
    url: "/token",
    dataType: "json"
  }).done(function(response){
    var token = response.token;
    if (!token) return false;
    // console.log(response);

    $.ajax({
      url: "https://api.github.com/user/repos?access_token=" + token
    }).done(function(res){
      res.forEach(function(repo){
        $("#repos").append("<li>"+repo.full_name+"</li>");
      });

      $("#repos").delegate("li", "click", function(event){
        var repo = event.target.innerHTML;
        getTree(repo);
        $("li").hide();
      });
    });

    function getTree(repo){
      $.ajax({
        url: "https://api.github.com/repos/" + repo + "/git/refs/heads/master?access_token=" + token,
        dataType: "jsonp"
      }).done(function(response){
        // console.log("First response", response);
        var sha = response.data.object.sha;

        $.ajax({
          url: "https://api.github.com/repos/" + repo + "/git/trees/" + sha + "?recursive=1&access_token=" + token,
          dataType: "jsonp"
        }).done(function(response){
          // console.log("Second response", response);

          var tree  = response.data.tree;
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
              // id: treeData.id,
              // text: treeData.text,
              // parent: treeData.parent
          });

          $('#jstree').on('select_node.jstree', function (e, data) {
            var path = data.instance.get_path(data.node,'/');
            if (!path.match(/(?:\.html|\.js|\.css|\.scss|\.sass|\.rb|\.php|\.erb|\.ejs|\.md)/)) return false;

            var raw  = "https://raw.githubusercontent.com/" + repo + "/master/" + path;
            // console.log('Selected: ' + path);
            // console.log(raw);
            $.ajax({
              url: raw
            }).done(function(response){
              // console.log(response);
              var mode;
              switch (path.match(/(?:\.html|\.js|\.css|\.scss|\.sass|\.rb|\.php|\.erb|\.ejs|\.md)/)[0]) {
                case ".html":
                  mode = "htmlmixed";
                  break;
                case ".erb":
                  mode = "htmlembedded";
                  break;
                case ".ejs":
                  mode = "htmlembedded";
                  break;
                case ".js":
                  mode = "javascript";
                  break;
                case ".css":
                  mode = "css";
                  break;
                case ".scss":
                  mode = "scss";
                  // "text/x-scss"
                  break;
                case ".sass":
                  mode = "sass";
                  break;
                case ".rb":
                  mode = "ruby";
                  break;
                case ".php":
                  mode = "php";
                  break;
                case ".md":
                  mode = "markdown";
                  break;
              }

              $("#editor").empty();
              var myCodeMirror = CodeMirror(document.getElementById("editor"), {
                lineNumbers: true,
                value: response,
                mode:  mode,
                viewportMargin: Infinity,
                theme: "monokai"
              });
            }).fail(function(response){
              console.log(response);
            });
          }).jstree({ 'core' : {
            'data' : jsTreeData
          } });
        });
      });
    }
  });
});
