# Node.js + Express.js URL shortener
A simple URL shortener created with Node.js + Express.js + MySQL. This project is part of a tutorial: <https://ducode.org/url-shortener-in-node-js-express-js-mysql-tutorial-learning-by-doing.html>.

## Installation

1. Download the files to the location you would like application to be.
1. Go to the folder with the command line and execute `npm install`, so all dependencies will be installed.
1. In your MySQL database, create a new table and execute `urlshortener.sql`
1. In `config.js`, fill in the correct MySQL settings and fill in your root URL (e.g. http://d.co/ or http://localhost:3500/)
1. If you install this script on your server and you have a custom short domain, make sure you create a reverse proxy in your Apache or Nginx (or any other server), so your domain (e.g. d.co) points to `http://localhost:3500/` (or any other port number you've configured).

## Note

This script is meant to be used as a public URL shortener. If you want to use this script for personal use, you have to include some sort of authentication.

## Nginx
	
	server {
		listen 80;
		#listen 443 ssl;
		server_name url.taokebaohe.com ~^u\.([a-z0-9\.]+)\.(com|net|cn|so)$ ~^(www\.)?f([0-9]+)url\.com$;
		root /disk/www/url.taoke.com;
		error_page 500 502 503 504 =200 /public/errors/server_error.html;

		#access_log off;		
		error_log  /var/log/nginx/url.taoke.com-error.log;
		access_log  /var/log/nginx/url.taoke.com-aceess.log main;

		# 启动 ssl
		#ssl on;
		#ssl_certificate /disk/certs/url.taokebaohe.com.crt;
		#ssl_certificate_key /disk/certs/url.taokebaohe.com.key;
	
		if ($http_host != 'url.taokebaohe.com') {
			rewrite (.*)  http://url.taokebaohe.com$1 permanent;
			return 301;
		}
	
		# 转发请求给 Node
		location / {
	
			# 允许跨域访问
			add_header Access-Control-Allow-Origin *;
			
			# HTTP的请求端真实的IP
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			
			# 传递4xx和5xx错误信息到 Nginx
			fastcgi_intercept_errors on;
			
			# 后端 Node 端口
			proxy_pass http://127.0.0.1:3500;    
		} 
	}


## Startup
	1.使用pm2启动node：
	pm2 start /disk/app.js --watch

	2.dump这些进程列表：
	pm2 save

	3.生成自启动脚本：
	pm2 startup centos

## API

### 转换链接

	/add?url=URL
	/add?url=URL&vanity=Vanity

	URL		原始链接地址（仅支持淘宝、天猫地址）
	Vanity	自定义短链接（可选）

### 转换链接，支持商品信息

	/api?url=URL&apid=API&name=Name&price=Price&thumb=Thumb

	URL		原始链接地址（仅支持淘宝、天猫地址）
	API		API 标记（0~127）
	Name	商品名称
	Price	商品价格
	Thumb	商品图片

### 哈希测试

	/hash

### 链接还原

	/whatis?url=URL
	
	URL		短链接或完整地址

### 数据统计

	/statis?url=URL

	URL		短链接或完整地址
	
	