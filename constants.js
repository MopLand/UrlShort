
//短网址根域名
exports.domain = 'localhost:3500'.split(' ');

//打印调试信息
exports.debug = false;

//监听的端口号
exports.listen = 3500;

//服务器标识号
exports.nodeid = 127;

/////////////////////////////

//短地址最小长度
exports.min_vanity_length = 4;

//每个IP每小时能产生的URL数量（0为不限制）
exports.num_of_urls_per_hour = 10000;

//允许URL规则
exports.url_rule = /(taobao|tmall|alimama|95095)\.(com|hk)/gi;
//exports.url_rule = /^https?:\/\/(shop\.m|s\.click|detail|taoquan|item|uland|detail\.yao)\.(taobao|tmall|alimama|95095)\.(com|hk)/gi;

//是否对URL验证
exports.url_verify = false;

//是否开启统计
exports.url_statis = false;

/////////////////////////////

//是否开启UA验证
exports.api_review = false;

//UA 加密字符串
exports.api_secret = 'shihuizhu.com';

/////////////////////////////

//商品查询与写入
exports.get_goods = 'SELECT * FROM goods WHERE segment = {SEGMENT}';
exports.add_goods = 'INSERT INTO goods SET name = {NAME}, price = {PRICE}, thumb = {THUMB}, segment = {SEGMENT}';

//短网址相关SQL
exports.get_query = 'SELECT * FROM urls WHERE segment = {SEGMENT}';
exports.add_query = 'INSERT INTO urls SET url = {URL}, segment = {SEGMENT}, ip = {IP}, api = {API}';
exports.check_url_query = 'SELECT * FROM urls WHERE url = {URL}';
exports.update_views_query = 'UPDATE urls SET num_of_clicks = {VIEWS} WHERE id = {ID}';
//exports.insert_view = 'INSERT INTO stats SET ip = {IP}, url_id = {URL_ID}, referer = {REFERER}';
exports.insert_view = 'INSERT INTO {TABLE} SET ip = ?, url_id = ?, referer = ?, country = ?, area = ?, region = ?, city = ?, mobile = ?';
exports.check_ip_query = 'SELECT COUNT(id) as counted FROM urls WHERE datetime_added >= now() - INTERVAL 1 HOUR AND ip = {IP}';
exports.get_statis = 'CALL count_by_url_hash( ? )';

/////////////////////////////

//数据库配置
exports.host = '127.0.0.1';
exports.port = '3306';
exports.user = 'root';
exports.password = 'root';
exports.database = 'yourls';
