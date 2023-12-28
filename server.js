require('dotenv').config({path: 'config-env.env'});
const express = require('express');
const bodyParser = require('body-parser');
const expressBooms = require('express-boom');
const cors = require('cors');
const db = require('./server/db');
const compression = require('compression');
const api = require('./server/api');
const PORT = process.env.PORT || 6666;

var corsOptions = function (req, callback) {
  var whitelist = [
    'http://localhost:3000',
    'http://magic-post.ddns.net:80',
    'http://magic-post.ddns.net:3000',
    'http://magic-post.ddns.net',
    'http://116.101.54.45:80/',
    'http://116.101.54.45:3000/',
    'http://59.153.225.105:3000'

]
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true }
    } else {
      corsOptions = { origin: false }
    }
    callback(null, corsOptions)
  }



const app = express();
db.ready.then(() => {
    app.use(compression());
    app.use(expressBooms());
    app.set('trust proxy', true);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/info', (req, res) => {
        res.send('THIS IS A SERVER');
    });
    app.use('/test', (req, res) => {
      res.send("OKOKOKOK")
    })
    app.use('/api', cors(corsOptions), api);
    app.use('/api/*', cors(corsOptions), (req, res) => {
        res.status(500).send({message: 'LỖI CORS RỒI !'})
    });
    app.listen(PORT || 3000, err => {
        if (err) throw err;
        console.log(`> Ready HTTP on http://localhost:${PORT}`);
    });

})