var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = require('./router');
var conf = require('./config');

///////////////////

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	res.setHeader('Node', conf.nodeid);
	next();
});

app.listen(conf.listen, function(){
	console.log( 'Started listening at port ' + conf.listen );
});

///////////////////

router.route(app);