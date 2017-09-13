var logic = require('./logic');
var path = require('path');
var route = function(app){
	
	logic.setTpl( path.join(__dirname, 'views/') );

	app.get('/', function(req, res){
		
		//res.sendFile(path.join(__dirname, 'views/index.html'));
		//res.sendFile('views/index.html', { root: __dirname });

		//res.sendFile(path.join(__dirname, 'views/index.html'));
		//res.send('views/index.html');
		logic.getTpl( res, 'index.html' );

	});
	
	app.get('/home', function(req, res){
		//res.sendFile(path.join(__dirname, 'views/home.html'));
		logic.getTpl( res, 'home.html' );
	});
	
	app.get('/multi', function(req, res){
		logic.getTpl( res, 'multi.html' );
	});
	
	app.get('/words', function(req, res){
		logic.getTpl( res, 'words.html' );
	});
	
	app.get('/add', function(request, response){
		var url = request.query['url'];
		var vanity = request.query['vanity'];
		logic.addUrl(url, request, response, { 'vanity' : vanity });
	});
	
	app.get('/api', function(request, response){
		var url = request.query['url'];
		var name = request.query['name'];
		var price = request.query['price'];
		var thumb = request.query['thumb'];
		var words = request.query['words'];

		//if( words ) words = words.replace(/《/g,'￥');

		logic.addUrl(url, request, response, { 'vanity' : false, 'name' : name, 'price' : price, 'thumb' : thumb, 'words' : words });
	});
	
	app.get('/set', function(request, response){
		var domain = request.query['domain'];
		if( domain ){			
			logic.setUrl( request, response, domain );
		}else{
			logic.setUrl( request, response );
		}		
	});
	
	app.get('/hash', function(request, response){
		logic.genTag(request, response);
	});
	
	app.get('/whatis', function(request, response){
		var url = request.query['url'];
		logic.whatIs(url, request, response);
	});
	
	app.get('/statis', function(request, response){
		var url = request.query['url'];
		logic.statIs(url, request, response);
	});
	
	app.get('/:segment', function(request, response){
		var segment = request.params.segment.trim();
		logic.getUrl(segment, request, response);
	});
}

exports.route = route;