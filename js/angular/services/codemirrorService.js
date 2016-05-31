angular
  .module("PairProgramming")
  .service("CodeMirrorService", CodeMirrorService);

function CodeMirrorService(){
  var self = this;

  self.init = init;

  function init(raw, path) {
    $.ajax({
      url: raw
    }).done(function(response){
      // console.log(response);
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
        value: response,
        mode:  mode,
        viewportMargin: Infinity,
        theme: "monokai"
      });
    });
  }
}
