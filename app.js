var express    = require("express");
var app        = express();

app.listen(config.port, function(){
  console.log("Express running on port" + config.port);
});
