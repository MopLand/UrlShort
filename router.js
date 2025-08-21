
import path from 'path';
//import sharp from 'sharp';
import fetch from 'node-fetch';
import qrcode from 'qr-image';
import { execSync } from 'child_process';
import logic from './logic.js';
var route = function(app, base){
	
	//视图目录
	logic.setTpl( path.join(base, 'tpl/') );

	/**
	 * 首页入口
	 */
	app.get('/', function(req, res){
		
		//res.sendFile(path.join(__dirname, 'views/index.html'));
		//res.sendFile('views/index.html', { root: __dirname });

		//res.sendFile(path.join(__dirname, 'views/index.html'));
		//res.send('views/index.html');

		//const { execSync } = require('child_process');
		let revid = execSync('git rev-parse --short HEAD').toString().trim();
		let years = (new Date).getFullYear();

		logic.getTpl( res, 'index.html', {'revid': revid, 'years': years} );

	});
	
	/**
	 * 写入接口
	 * @param string url 长链接
	 * @param string vanity 短名称（可选）
	 */
	app.get('/add', function(request, response){
		var url = request.query['url'];
		var vanity = request.query['vanity'];
		logic.addUrl(url, request, response, { 'vanity' : vanity });
	});

	/**
	 * API 接口
	 * @param string api 标识
	 * @param string url 长链接
	 * @param string name 商品名称
	 * @param string price 商品价格
	 * @param string thumb 缩略图
	 * @param string words 口令
	 */
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
	
	/**
	 * 设置
	 */
	app.get('/set', function(request, response){
		logic.setUrl( request, response );
	});

	/**
	 * 保存设置
	 */
	app.post('/set', function(request, response){
		//console.log( request.body );
		//var domain = request.body['domain'];
		//var replace = request.body['replace'];
		//body { command: 口令 | append, domain: 原域名, replace: 新域名 }
		logic.setUrl( request, response, request.body, base );
	});
	
	/**
	 * 哈希测试
	 */
	app.get('/hash', function(request, response){
		response.setHeader('Access-Control-Allow-Origin','*');
		logic.genTag(request, response);
	});
	
	/**
	 * 查询接口
	 * @param string url 短链接
	 */
	app.get('/whatis', function(request, response){
		var url = request.query['url'];
		logic.whatIs(url, request, response);
	});
	
	/**
	 * 统计接口
	 * @param string url 短链接
	 */
	app.get('/statis', function(request, response){
		var url = request.query['url'];
		logic.statIs(url, request, response);
	});
	
	/**
	 * 二维码
	 * @param string text 文本
	 * @param integer size 尺寸
	 * @param integer margin 边距
	 */
	app.get('/qrcode', function(request, response){
		
		var text = request.query['text'];
		var size = request.query['size'] || 10;
		var margin = request.query['margin'] || 1;
		try {
			var img = qrcode.image(text, {size : parseInt(size), margin : parseInt(margin)} );
			//response.writeHead(200, {'Content-Type': 'image/png', 'Access-Control-Allow-Origin':'*'});
			response.writeHead(200, {'Content-Type': 'image/png'});
			img.pipe(response);
		} catch (e) {
			response.writeHead(414, {'Content-Type': 'text/html'});
			response.end('<h1>414 Request-URI Too Large</h1>');
		}
		
	});

	/**
	 * 合成海报
	 * @param string bg 背景
	 * @param string icon 图标
	 * @param integer x 水平位置
	 * @param integer y 垂直位置
	 * @param integer scale 缩放
	 */
	app.get('/poster', async function(req, res) {

		//const fetch = require('node-fetch');		

		try {
		  const { bg, icon, x = 0, y = 0, scale = 1 } = req.query;
		  
		  if (!bg || !icon) {
			return res.status(400).send('Missing required parameters: bg or icon');
		  }
		  
		  const positionX = parseInt(x, 10);
		  const positionY = parseInt(y, 10);
		  const scaleFactor = parseFloat(scale);
		  
		  // 从 URL 获取背景图
		  const bgResponse = await fetch(bg);
		  if (!bgResponse.ok) {
			throw new Error(`Failed to fetch background: ${bgResponse.statusText}`);
		  }
		  const backgroundBuffer = await bgResponse.arrayBuffer();
		  
		  // 从 URL 获取图标
		  const iconResponse = await fetch(icon);
		  if (!iconResponse.ok) {
			throw new Error(`Failed to fetch icon: ${iconResponse.statusText}`);
		  }
		  const iconBuffer = await iconResponse.arrayBuffer();
		  
		  // 处理背景图
		  const background = sharp(backgroundBuffer);
		  const bgMetadata = await background.metadata();
		  
		  // 处理图标并缩放
		  const iconImage = sharp(iconBuffer)
			.resize({
			  width: Math.round((bgMetadata.width || 800) * scaleFactor),
			  height: Math.round((bgMetadata.height || 600) * scaleFactor),
			  fit: 'contain'
			});
		  
		  // 合成图像
		  const compositeImage = await background
			.composite([{
			  input: await iconImage.toBuffer(),
			  left: positionX,
			  top: positionY
			}])
			.toBuffer();
		  
		  res.set('Content-Type', 'image/png');
		  res.send(compositeImage);
		  
		} catch (error) {
		  console.error('Error generating poster:', error.message);
		  res.status(500).send(`Error generating poster: ${error.message}`);
		}
	});
	
	/**
	 * 验证文本
	 */
	app.get('/:filename.txt', function(request, response){
		var segment = request.params.filename.trim();
		logic.getTxt(segment, request, response);
	});
	
	/**
	 * 短链入口
	 */
	app.get('/:segment', function(request, response){
		var segment = request.params.segment.trim();
		logic.getUrl(segment, request, response);
	});
}

//exports.route = route;
export default route;