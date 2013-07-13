var express = require('express');
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

app.get('/profile', libreUser.ensureAuthenticated, function(req, res){
			res.render('profile', { user: req.user });
		});

app.listen(3000);
debug('listenging ong port 3000');
