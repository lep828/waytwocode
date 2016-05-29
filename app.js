var express    = require("express");
var app        = express();
var config     = require("./config/config");

app.use(express.static("/public"));

app.listen(config.port, function(){
  console.log("Express running on port" + config.port);
});
