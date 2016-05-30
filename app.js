var express        = require("express");
var app            = express();
var config         = require("./config/config");
var bodyParser     = require("body-parser");
var morgan         = require("morgan");
var methodOverride = require("method-override");
var mongoose       = require("mongoose");
var passport       = require("passport");
var expressJWT     = require("express-jwt");
var cors           = require("cors");

mongoose.connect(config.database);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === "object" && "_method" in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cors());

app.use("/", express.static(__dirname + "/public"));

app.listen(config.port, function(){
  console.log("Express running on port " + config.port);
});
