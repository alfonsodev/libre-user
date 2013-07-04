var express = require('express');
var passport = require('passport');
var util = require('util');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var debug = require('debug')('libre-user');

var libreUser = {};

libreUser.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
};

libreUser.init = function() {
    if ( !process.env['LIBRE_GOOGLE_CLIENT_ID'] || !process.env['LIBRE_GOOGLE_CLIENT_SECRET'] ) {
        throw new Error('LIBRE_GOOGLE_CLIENT_ID and LIBRE_GOOGLE_CLIENT_SECRET env vars need to be defined');
    }
    var googleOptions = {
        clientID: process.env['LIBRE_GOOGLE_CLIENT_ID'],
        clientSecret: process.env['LIBRE_GOOGLE_CLIENT_SECRET'],
        callbackURL: "http://localhost:3000/oauth2callback"
    };

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    var googleStrategy = new GoogleStrategy(googleOptions,
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          return done(null, profile);
        });
      }
    );

    passport.use(googleStrategy);

    var app = express();
    // configure Express
    app.configure(function() {
      debug('views dir ' + __dirname + '/views' );
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');

//TODO: Check cookieParser() is used
//TODO: Check bodyParser() is used
//TODO: Check methodOverride() is used
//TODO: Check sessions exists

      // Initialize Passport!  Also use passport.session() middleware, to support
      // persistent login sessions (recommended).

      app.use(passport.initialize());
      app.use(passport.session());
      app.use(app.router);
      app.use(express.static(__dirname + '/public'));
    });

    debug('route / registering');
    app.get('/', function(req, res){
        debug('got /');
      res.render('index', { user: req.user });
    });

    debug('route account');
    app.get('/account', this.ensureAuthenticated, function(req, res){
      res.render('account', { user: req.user });
    });

    debug('route login');
    app.get('/login', function(req, res){
      res.render('login', { user: req.user });
    });

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google',
      passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                                'https://www.googleapis.com/auth/userinfo.email'] }),
      function(req, res){
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
      });

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/oauth2callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    return app;
};

module.exports = libreUser;

