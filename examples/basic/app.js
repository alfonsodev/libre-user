var express = require('express');
var libreUser = require('../../lib/libre-user');
var app = express();
var debug = require('debug')('libre-user');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));

app.use(libreUser.init());
app.get('/profile', libreUser.ensureAuthenticated, function(req, res){
			res.render('profile', { user: req.user });
		});

app.listen(3000);
debug('listenging ong port 3000');
