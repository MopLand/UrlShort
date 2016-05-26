#!/bin/sh
export PATH=/usr/bin:/usr/local/bin
export NODE_PATH=/usr/local/lib/node_modules

#app.js
file="$(cd "$(dirname "$0")" && pwd)"
node $file/app.js > /dev/null 2>&1

#chmod 0777 cron.sh
#set fileformat=unix
