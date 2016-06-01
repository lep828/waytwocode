angular
  .module("PairProgramming")
  .service("CodeMirrorService", CodeMirrorService);

CodeMirrorService.$inject = ["FirebaseService"];
function CodeMirrorService(FirebaseService){
  var self = this;

  self.init = init;

  function init(raw, path, node) {
    $.ajax({
      url: raw
    }).done(function(response){

      // var data = response.replace(/:/g, "\:");
      var data = {data: btoa(response)};
      // console.log(data);
      FirebaseService.updateNode(node, data);

      // $.ajax({
      //   url: "/update/" + node,
      //   method: "POST",
      //   // data: content
      //   data: response.toString()
      // }).done(function(res){
      //   console.log(res);
      // });

      var mode;
      switch (path.match(/(?:\.html|\.js|\.css|\.scss|\.sass|\.rb|\.php|\.erb|\.ejs|\.md)/)[0]) {
        case ".html":
          mode = "xml";
          break;
        case ".erb":
          mode = "xml";
          break;
        case ".ejs":
          mode = "xml";
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
        lineWrapping: true,
        tabSize: 2,
        value: response,
        mode:  mode,
        viewportMargin: Infinity,
        theme: "monokai"
      });
    });
  }
}
