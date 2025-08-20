
import exts from './extend.js';

var conf = {

	//短网址根域名
	domain : 'localhost:3500'.split(' '),

	//打印调试信息
	debug : false,

	//监听的端口号
	listen : 3500,

	//服务器标识号
	nodeid : 127,

	/////////////////////////////

	//短地址最小长度
	min_vanity_length : 4,

	//每个IP每小时能产生的URL数量（0为不限制）
	num_of_urls_per_hour : 0,

	//允许URL规则
	url_allows : /(taobao|tmall|alimama|95095|jd|pinduoduo|kuaizhan)\.(com|hk)/gi,
	//exports.url_rule = /^https?:\/\/(shop\.m|s\.click|detail|taoquan|item|uland|detail\.yao)\.(taobao|tmall|alimama|95095)\.(com|hk)/gi;

	//是否对URL验证
	url_verify : false,

	//是否开启统计
	url_statis : false,

	//重定向方式：redirect, refresh
	url_direct : 'redirect',

	//安全验证口令
	command : '',

	//域名验证字符
	authcode : '',

	//是否开启替换（会进行多次替换）
	url_replace : {
		'elpmaxe.com' : 'example.com',
	},

	/////////////////////////////

	//是否开启UA验证
	api_review : false,

	//UA 加密字符串
	api_secret : 'veryide.com',

	//日志上报接口
	api_report : 'http://api.example.com/report',

	/////////////////////////////

	//商品查询与写入
	get_goods : 'SELECT * FROM goods WHERE segment = {SEGMENT}',
	add_goods : 'INSERT INTO goods SET name = ?, price = ?, thumb = ?, words = ?, segment = ?',

	//短网址相关SQL
	get_query : 'SELECT * FROM urls WHERE segment = ?',
	add_query : 'INSERT INTO urls SET url = ?, segment = ?, ip = ?, api = ?',
	check_url_query : 'SELECT * FROM urls WHERE url = ?',
	//exports.update_views_query = 'UPDATE urls SET num_of_clicks = {VIEWS} WHERE id = {ID}';
	//exports.insert_view = 'INSERT INTO stats SET ip = {IP}, url_id = {URL_ID}, referer = {REFERER}';
	insert_view : 'INSERT INTO {TABLE} SET ip = ?, url_id = ?, referer = ?, country = ?, area = ?, region = ?, city = ?, mobile = ?',
	check_ip_query : 'SELECT COUNT(id) as counted FROM urls WHERE datetime_added >= now() - INTERVAL 1 HOUR AND ip = ?',
	get_statis : 'CALL count_by_url_hash( ? )',

	/////////////////////////////

	//数据库配置
	host : '127.0.0.1',
	port : '3306',
	user : 'root',
	password : 'root',
	database : 'project_urlshort',

};

try {
	//var exts = require('./extend');
	for( var k in exts ){
		conf[k] = exts[k];
	}
	console.log('Loaded module extend.js');
	console.log(exts);
} catch (error) {
	console.log('Not found extend.js');
}

export default conf;