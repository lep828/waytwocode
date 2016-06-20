angular
  .module("PairProgramming")
  .service("CodeMirrorService", CodeMirrorService);

CodeMirrorService.$inject = ["FirebaseService", "$http"];
function CodeMirrorService(FirebaseService, $http){
  var self = this;

  self.changeFile = changeFile;
  self.getValue = getValue;
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
      autoCloseBrackets: true,
      scrollbarStyle: "overlay"
    });
  }

  function changeFile(content, file) {
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

    self.myCodeMirror.setOption("mode", mode);
    self.myCodeMirror.setValue(content);
  }

  function getValue(){
    return btoa(self.myCodeMirror.getValue());
  }
}
