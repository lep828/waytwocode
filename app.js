var express        = require("express");
var app            = express();
var config         = require("./config/config");
var bodyParser     = require("body-parser");
var morgan         = require("morgan");
var rp             = require("request-promise");
var firebase       = require("firebase");

firebase.initializeApp({
  apiKey: process.env.FIREBASE_SERVER_KEY,
  databaseURL: "https://pair-programming-6ffa9.firebaseio.com",
  serviceAccount: "pair-programming-3119ebcff22f.json"
});

var database = firebase.database();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/add/:key", function(req, res){
  var key = req.params.key;
  console.log(req.body.core.data);
  database.ref("/" + key).update(req.body);
  res.json({ key: key });
});

app.post("/get_data/:key/:id", function(req, res){
  var url = req.params.key + "/core/data/" + req.params.id;
  database.ref(url).on("value", function(data){
    res.json(data.val());
  });
});

app.post("/update/:key/:id", function(req, res){
  var url = req.params.key + "/core/data/" + req.params.id;
  database.ref(url).update(req.body);
  res.json(req.body);
});

app.get("/key", function(req, res){
  var key = database.ref("/").push().key;
  res.json({ key: key });
});

var access_token;

app.get("/github", function(req, res){
  var data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret:  process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
    // redirect_uri: "https://waytwocode.herokuapp.com/github"
    redirect_uri: "http://localhost:3000/github"
  };
  var params = serializeObject(data);

  return rp("https://github.com/login/oauth/access_token?" + params)
    .then(function(response){
      access_token = deserializeObject(response).access_token;
      res.redirect("/index");
    });
});

app.get("/token", function(req, res){
  res.json({token: access_token});
});

app.get("/*", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
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
