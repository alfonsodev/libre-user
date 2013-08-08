var fs = require('fs');
var express = require('express');
var https = require('https');
var http = require('http');
var LibreUser = require('../../lib/libre-user');
var libreUser = new LibreUser();
var app = express();
var debug = require('debug')('libre-user');


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));

app.use(libreUser.middleware());

debug('route / registering');

app.get('/', function(req, res) {
  debug('got /');
  res.render('index', { user: req.user });
});

app.get('/profile', libreUser.ensureAuthenticated, function(req, res) {
  res.render('profile', { user: req.user });
});

var options = {
  key: fs.readFileSync('libre-user-test-key.pem'),
  cert: fs.readFileSync('libre-user-test-cert.pem')
};

http.createServer(app).listen(3000);
https.createServer(options, app).listen(4333);
debug('listenging ong port 3000');
