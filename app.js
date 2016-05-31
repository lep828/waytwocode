var express        = require("express");
var app            = express();
var config         = require("./config/config");
var bodyParser     = require("body-parser");
var morgan         = require("morgan");
var methodOverride = require("method-override");
// var mongoose       = require("mongoose");
// var passport       = require("passport");
// var expressJWT     = require("express-jwt");
// var cors           = require("cors");
var rp             = require("request-promise");
var firebase       = require("firebase");

// mongoose.connect(config.database);

// firebase.initializeApp({
//   serviceAccount: {
//     projectId: "pair-programming-6ffa9",
//     clientEmail: "test-7@pair-programming-6ffa9.iam.gserviceaccount.com",
//     privateKey: "-----BEGIN PRIVATE KEY-----\n" + process.env.FIREBASE_PRIVATE_KEY + "\n-----END PRIVATE KEY-----\n"
//   },
//   apiKey: process.env.FIREBASE_SERVER_KEY,
//   databaseURL: "https://pair-programming-6ffa9.firebaseio.com",
// });

firebase.initializeApp({
  apiKey: process.env.FIREBASE_SERVER_KEY,
  databaseURL: "https://pair-programming-6ffa9.firebaseio.com",
  serviceAccount: "pair-programming-3119ebcff22f.json"
});

var database = firebase.database();

database.ref("/").on("child_added", function(res){
  // console.log(res.val(), 'added');
});

database.ref("/").on("child_changed", function(res){
  // console.log(res.val(), 'changed');
});

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
// app.use(cors());

app.use("/", express.static(__dirname + "/public"));

app.get("/", function(req,res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/add", function(req, res){
  database.ref("/").set(req.body);
  // database.ref("/core/data/2").update({content: "content goes here?"});
});

app.get("/get", function(req, res){
  database.ref("/").on("value", function(data){
    res.json(data.val());
  });
});

app.post("/update/:id", function(req, res){
  var url = "/core/data/" + req.params.id;
  // var string = req.body.toString();
  // var content = string.replace(/:/g, "\:");

  var content = req.body.toString();
  // console.log(req.body);
  database.ref(url).update({ content: content });
  // database.ref(url).update({content: "content goes here?"});
  // console.log(req);
});

var access_token;

app.get("/github", function(req, res){
  var data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret:  process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
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
  console.log(access_token);
  res.json({token: access_token});
});

app.get("/*", function(req, res){
  res.redirect("/");
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
