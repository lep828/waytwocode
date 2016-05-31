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
var rp             = require("request-promise");

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

var access_token;

app.get("/github", function(req, res){
  var data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret:  process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
    redirect_uri: "http://localhost:3000/github/callback"
  };
  var params = serializeObject(data);

  return rp("https://github.com/login/oauth/access_token?" + params)
    .then(function(response){
      access_token = deserializeObject(response).access_token;
      res.redirect("/");
    });
});

app.get("/token", function(req, res){
  console.log(access_token);
  res.json({token: access_token});
});

app.listen(config.port, function(){
  console.log("Express running on port " + config.port);
});

function serializeObject(obj){
  var str = "";
  for (var key in obj) {
    if (str !== "") {
      str += "&";
    }
    str += key + "=" + encodeURIComponent(obj[key]);
  }
  return str;
}

function deserializeObject(string){
  var obj = {};
  var pairs = string.split('&');
  for(var i in pairs){
      var split = pairs[i].split('=');
      obj[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
  }
  return obj;
}
