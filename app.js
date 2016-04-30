var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = require("./router");
var con = require("./constants");

/*
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3500, function(){
  console.log("Started listening at port 3500");
});

router.route(app);