angular
  .module("PairProgramming")
  .service("CodeMirrorService", CodeMirrorService);

CodeMirrorService.$inject = ["FirebaseService", "$http"];
function CodeMirrorService(FirebaseService, $http){
  var self = this;

  self.changeFile = changeFile;
  self.myCodeMirror = {};
  self.createCodeMirror = createCodeMirror;

  function createCodeMirror(){
    $("#editor").empty();
    self.myCodeMirror = CodeMirror(document.getElementById("editor"), {
      lineNumbers: true,
      lineWrapping: true,
      tabSize: 2,
      value: "",
      mode: "javascript",
      viewportMargin: Infinity,
      theme: "monokai",
      autoCloseBrackets: true
    });

    self.myCodeMirror.on("changes", function(cm, data){
      var content = btoa(cm.getValue());
      FirebaseService.updateNode(self.node, content);
    });
  }

  function changeFile(content, file, node) {
    self.node = node;
    var mode;
    switch (file.match(/(?:\.html|\.js|\.css|\.scss|\.sass|\.rb|\.php|\.erb|\.ejs|\.md)/)[0]) {
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

    var startCursor = self.myCodeMirror.getCursor();
    self.myCodeMirror.setOption("mode", mode);
    self.myCodeMirror.setValue(content);
    self.myCodeMirror.setCursor(startCursor);
  }
}
