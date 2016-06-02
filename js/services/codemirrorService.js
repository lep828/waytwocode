angular
  .module("PairProgramming")
  .service("CodeMirrorService", CodeMirrorService);

CodeMirrorService.$inject = ["FirebaseService"];
function CodeMirrorService(FirebaseService){
  var self = this;


  self.init = init;
  self.getValue = getValue;
  self.myCodeMirror = {};
  self.createCodeMirror = createCodeMirror;

  function createCodeMirror(){
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

  function init(raw, file, node, filePath) {
    self.filePath = filePath;
    $.ajax({
      url: raw
    }).done(function(response){
      var data = { content: btoa(response) };
      FirebaseService.updateNode(node, data);

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

      // $("#editor").empty();
      self.myCodeMirror.setOption("mode", mode);
      self.myCodeMirror.setValue(response);
    });
  }

  function getValue(){
    return btoa(self.myCodeMirror.getValue());
  }
}
