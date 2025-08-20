
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import router from './router.js';
import conf from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

///////////////////

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	res.setHeader('Node', conf.nodeid);
	next();
});

app.use(function(req, res, next) {
    var err = null;
    try {
        decodeURIComponent(req.path)
    }catch(e) {
        err = e;
    }
    if( err ){
        console.log(err, req.url);
        res.status(500).send({ error: 'Invalid URL' });
        return;
    }
    next();
});

app.listen(conf.listen, function(){
	console.log( 'Started listening at port ' + conf.listen );
});

///////////////////

router(app, __dirname);