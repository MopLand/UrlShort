var logic = require('./logic');
var path = require('path');
var route = function(app){

	app.get('/', function(req, res){
	  //res.sendFile(path.join(__dirname, 'views/index.html'));
	  //res.sendFile('views/index.html', { root: __dirname });
	  res.sendFile(path.join(__dirname, 'views/index.html'));
	});

	app.get('/home', function(req, res){
	  res.sendFile(path.join(__dirname, 'views/home.html'));
	});
	
	app.get('/add', function(request, response){
		var url = request.param('url');
		var vanity = request.param('vanity');
		logic.addUrl(url, request, response, vanity);
	});
	
	app.get('/whatis', function(request, response){
		var url = request.param('url');
		logic.whatIs(url, request, response);
	});
	
	app.get('/statis', function(request, response){
		var url = request.param('url');
		logic.statIs(url, request, response);
	});
	
	app.get('/:segment', function(request, response){
		logic.getUrl(request.params.segment, request, response);
	});
}

exports.route = route;