var logic = require('./logic');
var path = require('path');
var route = function(app){
	
	logic.setTpl( path.join(__dirname, 'views/') );

	app.get('/', function(req, res){
		
		//res.sendFile(path.join(__dirname, 'views/index.html'));
		//res.sendFile('views/index.html', { root: __dirname });

		//res.sendFile(path.join(__dirname, 'views/index.html'));
		//res.send('views/index.html');

		const { execSync } = require('child_process');
		let revid = execSync('git rev-parse --short HEAD').toString().trim();
		let years = (new Date).getFullYear();

		logic.getTpl( res, 'index.html', {'revid': revid, 'years': years} );

	});
	
	app.get('/home', function(req, res){
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
		var api = request.query['api'] || 1;
		var url = request.query['url'];
		var name = request.query['name'];
		var price = request.query['price'];
		var thumb = request.query['thumb'];
		var words = request.query['words'];

		//内部调用，API = 3
		if( request.headers['debug'] == 'dora' ){
			api = 3;
		}
		
		logic.addUrl(url, request, response, { 'vanity' : false, 'api' : api, 'name' : name, 'price' : price, 'thumb' : thumb, 'words' : words });
	});
	
	app.get('/set', function(request, response){
		logic.setUrl( request, response );
	});

	app.post('/set', function(request, response){
		//console.log( request.body );
		//var domain = request.body['domain'];
		//var replace = request.body['replace'];
		//body { command: 口令 | append, domain: 原域名, replace: 新域名 }
		logic.setUrl( request, response, request.body );
	});
	
	app.get('/hash', function(request, response){
		response.setHeader('Access-Control-Allow-Origin','*');
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
	
	app.get('/qrcode', function(request, response){
		
		if( Object.keys(request.query).length == 0 ){
		
			logic.getTpl( response, 'qrcode.html' );
				
		}else{	
		
			var text = request.query['text'];
			var size = request.query['size'] || 10;
			var margin = request.query['margin'] || 1;
			try {
				var qr = require('qr-image');
				var img = qr.image(text, {size : parseInt(size), margin : parseInt(margin)} );
				//response.writeHead(200, {'Content-Type': 'image/png', 'Access-Control-Allow-Origin':'*'});
				response.writeHead(200, {'Content-Type': 'image/png'});
				img.pipe(response);
			} catch (e) {
				response.writeHead(414, {'Content-Type': 'text/html'});
				response.end('<h1>414 Request-URI Too Large</h1>');
			}
			
		}
		
	});
	
	app.get('/:segment', function(request, response){
		var segment = request.params.segment.trim();
		logic.getUrl(segment, request, response);
	});
}

exports.route = route;