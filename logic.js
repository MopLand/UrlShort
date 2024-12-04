/*
* Messages:
* 100: action executed successfully
* 400: couldn't add URL, most likely the vanity url is already taken
* 401: the URL isn't reachable
* 402: the "URL" parameter isn't set
* 403: the vanity string contains invalid characters
* 404: the short link doesn't exist
* 405: the vanity string can't be longer than 15 characters
* 406: the URL can't be longer than 1000 characters
* 407: the vanity string has to contain more characters
* 408: maximum number of URL's per hour exceeded
*/
var fs = require("fs");
var md5 = require('md5');
var req = require('request');
var mysql = require('mysql');
var conf = require('./config');
var pool = mysql.createPool({
		host:conf.host,
		port:conf.port,
		user:conf.user,
		password:conf.password,
		database:conf.database
	});
var Tpl = null;
var Cache = {};

//onSuccess: the method which should be executed if the hash has been generated successfully
//onError: if there was an error, this function will be executed
//retryCount: how many times the function should check if a certain hash already exists in the database
//url: the url which should be shortened
//request / response: the request and response objects
//con: the MySQL connection
//vanity: this should be a string which represents a custom URL (e.g. "url" corresponds to d.co/url)
function generateHash(onSuccess, onError, retryCount, url, request, response, con, option) {
	var hash = "";
	if(option.vanity){
		hash = option.vanity;
		var reg = /[^A-Za-z0-9-_]/;
		//If the hash contains invalid characters or is equal to other methods ("add" or "whatis"), an error will be thrown
		if(reg.test(hash) || hash == "add" || hash == "whatis" || hash == "statis" || hash == "admin"){
			onError(response, request, con, 403);
			return;
		}
		if(hash.length > 15){
			onError(response, request, con, 405);
			return;
		}
		else if(conf.min_vanity_length > 0 && hash.length < conf.min_vanity_length){
			onError(response, request, con, 407);
			return;
		}
	}
	else{
		//This section creates a string for a short URL on basis of an SHA1 hash
		/*
		var shasum = crypto.createHash('sha1');
		shasum.update((new Date).getTime()+"");
		hash = shasum.digest('hex').substring(0, 6);
		*/
		hash = genTag();
	}
	//This section query's (with a query defined in "config.js") and looks if the short URL with the specific segment already exists
	//If the segment already exists, it will repeat the generateHash function until a segment is generated which does not exist in the database
    con.query(conf.get_query, hash, function(err, rows){
		if(err){
			console.log(err);
		}
        if (rows != undefined && rows.length == 0) {
            onSuccess(hash, url, request, response, con, option);
        } else {
            if (retryCount > 1 && !option.vanity) {
                generateHash(onSuccess, onError, retryCount - 1, url, request, response, con, option);
            } else {
                onError(response, request, con, 400);
            }
        }
    });
}

//The function that is executed when there's an error
//response.send sends a message back to the client
function hashError(response, request, con, code){
	response.send(urlResult(null, false, code));
}

//The function that is executed when the short URL has been created successfully.
function handleHash(hash, url, request, response, con, option){

	//附带商品信息
	if( option && option.name && option.price ){

		con.query( conf.add_goods, [ con.escape(option.name), con.escape(hash), con.escape(option.price), con.escape(option.thumb), con.escape(option.words) ], function(err, rows){
			if(err){
				console.log(err);
			}
		});

	}

	////////////////////

	//API 类型：0 web，1 接口，3 后台
	var api = option.api || 0;

	//新增短链接，成功时加入到缓存
	con.query( conf.add_query, [ url, hash, getIP(request), api ], function(err, res){
		if(err){
			console.log(err);
		}else{
			Cache[hash] = { 'id' : res.insertId, 'url' : url, 'api' : api };
		}
	});

	debug( '---------------' );
	debug( 'SHORTEN', hash, url );
	
	response.send(urlResult(hash, true, 100));
}

//This function returns the object that will be sent to the client
function urlResult(hash, result, statusCode){
	var domain = conf.domain[ Math.floor(Math.random()*conf.domain.length) ];
	var prefix = 'http://'+ domain +'/';
	return {
		url: hash != null ? prefix + hash : null,
		result: result,
		statusCode: statusCode
	};
}

var getTab = function( id ){
	return 'stats_' + id % 10;
}

//This method looks handles a short URL and redirects to that URL if it exists
//If the short URL exists, some statistics are saved to the database
var getUrl = function(segment, request, response){

	pool.getConnection(function(err, con){
	
		if( err ) throw err;

		var hash = getHash( segment );
		var port = getPort( segment );
		
		var fn = function( result ){
			
			var matches = (request.headers.referer || '').match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
			var referer = matches ? matches[1] : '';

			var ip = getIP( request );
			var url = replace( result.url, result.api == 3 ? request.query : {} );				//API 3 内部短链，支持参数替换
			var mobile = /(Mobile|Android|iPhone|iPad)/i.test(request.headers['user-agent']);	//是否为手机访问
			var wechat = /MicroMessenger\/([\d\.]+)/i.test(request.headers['user-agent']);		//是否在微信中
			var iphone = /(iPhone|iPad|iPod|iOS)/i.test(request.headers['user-agent']);
			var taobao = /(taobao|tmall|alimama|95095)\.com/.test( url );

			////////////////////////

			//写入访问统计
			conf.url_statis && getIPInfo( ip, function( info ){
				var sql = conf.insert_view.replace( '{TABLE}', getTab( result.id ) );
				con.query( sql, [ ip, result.id, referer, info.country, info.area, info.region, info.city, ( mobile ? 1 : 0 ) ], function(err, rows){
					if(err){
						console.log(err);
					}
				});
			} );

			////////////////////////

			response.redirect( url );
			
		};
		
		//////////////////////////////

		debug( '---------------' );

		//从缓存读取
		if( result = Cache[hash] ){
			
			debug( 'SEGMENT', hash, 'Hit Cache' );
		
			fn( result );
			
		}else{
			
			debug( 'SEGMENT', hash, 'Query DB' );
		
			con.query(conf.get_query, hash, function( err, rows ){
			
				if(!err && rows.length > 0){
				
					//加入到缓存
					fn( Cache[hash] = rows[0] );
					
				}else{
					response.send(urlResult(null, false, 404));
				}
				
				if(err){
					console.log(err);
				}
				
			} );
			
		}
		
		//////////////////////////////
			
		con.release();
		
	});
};

////////////////////////

//读取模板并缓存
var tplSet = {};

var getTpl = function( response, file, variable ){

	var callback = function( body, variable ){
		if( variable ){
			for( var k in variable ){
				var regex = new RegExp('\{'+ k +'\}','ig');
				body = body.replace( regex, variable[k] );
			}
		}
		response.set('Content-Type', 'text/html');
		response.send( body );
	}

	///////////////////////

	debug( '---------------' );

	//模板名称
	var name = file.replace(/\\/g,'/').split('/').pop();

	//从缓存中读取
	if( tplSet[ name ] ){

		debug( 'TEMPLATE', name, 'Hit Cache' );

		callback( tplSet[ name ], variable );

	}else{

		//console.log( 'read...' );

		return fs.readFile( Tpl + file, 'utf8', function( err, body ) {

			if (err) {
				return console.log(err);
			}

			debug( 'TEMPLATE', name, 'Read File' );

			//缓存进数组
			tplSet[ name ] = body;

			//处理模块
			callback( body, variable );
		});

	}

}

////////////////////////

//This function adds attempts to add an URL to the database. If the URL returns a 404 or if there is another error, this method returns an error to the client, else an object with the newly shortened URL is sent back to the client.
var addUrl = function(url, request, response, option){

	//是否为 API 请求
	var isapi = option.vanity === false;

	//debug( 'isapi', isapi );

	//验证 UA 有效性，否则返回 401
	if( conf.api_review ){

		//Api
		if( isapi ){

			var year = (new Date).getFullYear();
			var month = (new Date).getMonth() + 1;
			var hash = md5( year + '' + ( month < 10 ? '0' : '' ) + month + '' + conf.api_secret ).substring(8, 24);

			//debug( 'hash', hash );
			//debug( 'token', request.headers['token'] );

			//验证 Token 有效性，否则返回 401
			if( !request.headers['token'] || hash != request.headers['token'] ){
				response.send(urlResult(null, 'TOKEN', 401));
				return;
			}
		
		//Web
		}else{

			//debug( 'referer', request.headers['referer'] );

			//验证 Referer 有效性，否则返回 401
			if( !request.headers['referer'] || !request.headers['x-requested-with'] ){
				response.send(urlResult(null, 'REFERER', 401));
				return;
			}

		}

	}

	//非API 模式，验证 URL 有效性，否则返回 403
	conf.url_allows.lastIndex = 0;
	if( !isapi && conf.url_allows && conf.url_allows.test( url ) == false ){
		response.send(urlResult(null, false, 403));
		return;
	}

	////////////////////////

	pool.getConnection(function(err, con){
		if( err ) throw err;
	
		if( url ){

			var fn = function(){
				con.query( conf.check_url_query, url, function(err, rows){

					if(err){
						console.log(err);
					}
					
					if( /(ftp|http|https):\/\/localhost/i.test( url ) ){
						response.send(urlResult(null, false, 401));
						return;
					}

					if( url.length > 1000 ){
						response.send(urlResult(null, false, 406));
						return;
					}

					//已经存在此 URL
					if( !err && rows.length > 0 ){
						response.send(urlResult(rows[0].segment, true, 100));
						return;
					}

					//验证 URL 有效性
					if( conf.url_verify ){
						req(url, function(err, res, body){
							if(res != undefined && res.statusCode == 200){
								generateHash(handleHash, hashError, 50, url, request, response, con, option);
							}else{
								response.send(urlResult(null, false, 401));
							}
						});
					}else{
						generateHash(handleHash, hashError, 50, url, request, response, con, option);
					}
				});
			};

			////////////////////////

			//不限制每小时生成数量
			if( option.vanity === false || conf.num_of_urls_per_hour == 0 ){
				fn();
			}else{

				//查询此IP最近一小时生成数量
				con.query( conf.check_ip_query, con.escape(getIP(request)), function(err, rows){
					if(err){
						console.log(err);
					}
					if(rows[0].counted != undefined && rows[0].counted < conf.num_of_urls_per_hour){
						fn();
					}else{
						response.send(urlResult(null, false, 408));
					}
				});

			}
			
		}else{
			response.send(urlResult(null, false, 402));
		}
		
		con.release();
	});

	//上报日志
	weight( 0.2 ) && report( 'UrlShort', isapi ? 'API' : 'Web' , option );

};

////////////////////////

//This method looks up stats of a specific short URL and sends it to the client
var whatIs = function(url, request, response){

	pool.getConnection( function(err, con){
		if (err) throw err;
		var hash = getHash( url );
		con.query(conf.get_query, hash, function(err, rows){

			if(err || rows.length == 0){
				response.send({result: false, url: null});
			}else{
				response.send({result: true, url: replace( rows[0].url ), hash: hash, clicks: rows[0].clicks});
			}

		});
		con.release();
	} );

};

/**
 * @desc 权重对比
 *
 * @param float $probability	概率 0-1
 * @param integer $length		最大值
 * @return void
 */
var weight = function( probability = 0.1, length = 100 ){
	test = parseInt(Math.random() * length) + 1;
	return test <= probability * length;
}

/**
 * requestCurl curl请求方法
 * @param string appid 	服务标识
 * @param string status 状态信息
 * @param array message 消息内容
 */
var report = function( appid, status, message = {}, cb ) {
	req({
		timeout:1000 * 30,
		method:'GET',
		url:conf.api_report,
		qs:{
			appid, status, message : JSON.stringify( message )
		}
	},function (error, response, body) {
		cb && cb( response.statusCode, body );
	});
}

////////////////////////

//This method looks up stats of a specific short URL and sends it to the client
var statIs = function(url, request, response){
	pool.getConnection(function(err, con){
		if (err) throw err;
		//var hash = url;
		//if(!hash) hash = "";
		var hash = getHash( url );
		
		con.query(conf.get_statis, hash, function(err, rows){
			//console.log( JSON.stringify( rows ) );

			if(err || rows.length == 0 || rows[0].length == 0){
				response.send({result: false, hash: hash, url: null});
			}else{

				var res = {};
				res.result	= true;
				res.visit	= rows[0][0]['visit'];
				res.start	= rows[3][0]['start'];
				res.uv		= rows[4][0]['uv'];
				res.ip		= rows[4][0]['ip'];
				res.click	= rows[4][0]['click'];

				///////////////////

				res.referer	= {};

				for( var k in rows[1] ){
					var item = rows[1][k];
					res.referer[ item.referer ] = item.stats;
				}

				///////////////////

				res.region	= {};

				for( var k in rows[2] ){
					var item = rows[2][k];
					res.region[ item.region ] = item.stats;
				}

				response.send( res );
			}
		});
		con.release();
	});
};

////////////////////////

var setTpl = function( dir ){
	Tpl = dir;
}

//This function returns the correct IP address. Node.js apps normally run behind a proxy, so the remoteAddress will be equal to the proxy. A proxy sends a header "X-Forwarded-For", so if this header is set, this IP address will be used.
function getIP(request){
	//return request.header("x-forwarded-for") || request.connection.remoteAddress;
	//return (request.headers['x-forwarded-for'] || '').split(',')[0] || request.connection.remoteAddress;
	var address = request.headers['x-forwarded-for'] || 
             request.connection.remoteAddress || 
             request.socket.remoteAddress ||
             (request.connection.socket ? request.connection.socket.remoteAddress : '');
	return address.replace(/^.*:/, '').split(',')[0];
}

/* 获取IP归属地信息 */
function getIPInfo( ip, fn ){
	//var ip = '171.41.72.243';

	var empty = { country : null, area : null, region : null, city : null };

	if( !ip || ip == '::ffff:127.0.0.1' ){
		fn && fn( empty );
		return;
	}

	var url = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip;
	req( url, function( error, response, body ){

		if (!error && response.statusCode == 200) {
			try {
				var res = JSON.parse( body );
				if( res.code == 0 ){
					fn && fn( res.data );
					return;
				}
			} catch (e) {
				console.log( e, body );
			}
		}

		fn && fn( empty );
	} );
}

/* 获取真实短网址 */
function getHash( hash ){

	hash = ( hash || '' );

	//是完整地址，提取短地址
	if( exec = /\/([^/]*)$/.exec( hash ) ){
		hash = exec[1];
	}

	if( hash.length == 7 ){
		return hash.substr(1);
	}else{
		return hash;
	}
}

/* 获取平台信息 */
function getPort( hash ){
	if( hash.length == 7 ){
		return hash.substr(0, 1);
	}else{
		return '';
	}
}

/* 生成随机字符 */
function genTag(request, response){

	var len = 6;
	var seed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var size = seed.length;
	var string = '';
	for (i = 0; i < len; i++) {
		string += seed.charAt(Math.floor(Math.random() * size));
	}

	if( response ){
		response.send( string );
	}else{
		return string;
	}
}

////////////////////////

function setUrl( request, response, data ){

	if( data ){

		console.log( 'INPUT', data );

		//追加域名
		if( data.command == 'append' ){

			if( data.replace ){
				try {
					var replace =JSON.parse( data.replace );
				} catch (e) {
					return response.send( { 'result' : 'replace 参数有误' } );
				}
			}

			data.domain = data.domain || conf.domain.join(' ');
			data.replace = JSON.stringify( Object.assign( conf.url_replace, replace ) );

		}else{
			//更新域名，验证口令
			if( conf.command && data.command != conf.command ){
				return response.send( { 'result' : '口令不正确' } );
			}
		}

		console.log( 'VALUE', data );

		////////////////////////
	
		var file = __dirname + '/extend.js';

		fs.readFile( file, 'utf8', function( err, body ) {

			body = body.replace( /exports.domain = '(.+?)'/, "exports.domain = '"+ data.domain.trim() +"'" );
			body = body.replace( /exports.url_replace = \{(.+?)\};/s, 'exports.url_replace = ' + data.replace.trim() + ';' );
			
			fs.writeFile( file, body, err => {
				//console.log( err );
				if( err ){
					response.send( { 'result' : err } );
				}else{
					response.send( { 'result' : 'Ok' } );
				}
			} );
			
		});	
		
	}else{
		//getTpl( response, 'seturl.html', { 'domain' : conf.domain.join(' '), 'replace' : JSON.stringify( conf.url_replace, null, '\t' ) } );
		getTpl( response, 'seturl.html', { 'domain' : conf.domain.join(' '), 'replace' : JSON.stringify( conf.url_replace ) } );
	}

}

/* 原始网址替换 */
function replace( url, query ){

	var raw = url;

	if( conf.url_replace ){
		for( old in conf.url_replace ){
			url = url.replace( old, conf.url_replace[old] );
		}
	}
	if( query ){
		for( key in query ){
			url = url.replace( new RegExp( '((&|\\?)'+ key +'=)([^&]*)(?=&|$)' ), '$1'+ query[key] );
		}
	}

	if( url != raw ){
		debug( 'RAWDATA', raw );
		debug( 'REPLACE', query );
		debug( 'REWRITE', url );
	}else{
		debug( 'ADDRESS', url );
	}

	return url;
}

/* 打印调试信息 */
function debug( ...msg ){
	conf.debug && console.log( ...msg );
}

////////////////////////

exports.getUrl = getUrl;
exports.addUrl = addUrl;
exports.whatIs = whatIs;
exports.statIs = statIs;
exports.report = report;
exports.setTpl = setTpl;
exports.getTpl = getTpl;
exports.genTag = genTag;
exports.setUrl = setUrl;
