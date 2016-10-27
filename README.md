# Node.js + Express.js URL shortener
A simple URL shortener created with Node.js + Express.js + MySQL. This project is part of a tutorial: <https://ducode.org/url-shortener-in-node-js-express-js-mysql-tutorial-learning-by-doing.html>.

## Installation

1. Download the files to the location you would like application to be.
1. Go to the folder with the command line and execute `npm install`, so all dependencies will be installed.
1. In your MySQL database, create a new table and execute `urlshortener.sql`
1. In `constants.js`, fill in the correct MySQL settings and fill in your root URL (e.g. http://d.co/ or http://localhost:3500/)
1. If you install this script on your server and you have a custom short domain, make sure you create a reverse proxy in your Apache or Nginx (or any other server), so your domain (e.g. d.co) points to `http://localhost:3500/` (or any other port number you've configured).

## Note

This script is meant to be used as a public URL shortener. If you want to use this script for personal use, you have to include some sort of authentication.

## Nginx
	
	server {
		listen 80;
		server_name yqt.so www.yqt.so url.hgbang.com;
		root /disk/www/url.hgbang.com;
		error_page 500 502 503 504 =200 /public/errors/server_error.html;

		#access_log off;		
		error_log  /var/log/nginx/www.yqt.so-error.log;
		access_log  /var/log/nginx/www.yqt.so-aceess.log main;
	
		if ($http_host != 'yqt.so') {
			rewrite (.*)  http://yqt.so$1 permanent;
			return 301;
		}
	
		location / {
			add_header Access-Control-Allow-Origin *;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_pass http://127.0.0.1:3500;    
	    } 
	}
