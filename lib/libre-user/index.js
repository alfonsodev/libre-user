var express = require('express');
var passport = require('passport');
var util = require('util');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var nano = require('nano')('http://localhost:5984');
var db = nano.use('libre-user');
var bcrypt = require('bcrypt');
var emailRecipient = "success@simulator.amazonses.com";

var debug = require('debug')('libre-user');
var libreUser = function() {
};

libreUser.prototype.middleware = function(){
  if (process.env['LIBRE_GOOGLE_CLIENT_ID'] && process.env['LIBRE_GOOGLE_CLIENT_SECRET']) {
    var googleOptions = {
      clientID: process.env['LIBRE_GOOGLE_CLIENT_ID'],
      clientSecret: process.env['LIBRE_GOOGLE_CLIENT_SECRET'],
      callbackURL: 'http://localhost:3000/oauth2callback'
    };
    var _googleStrategyCallback = function(accessToken, refreshToken, profile, done) {
      var doProfile = function() {
        return done(null, profile);
      };
      process.nextTick(doProfile);
    };

    passport.serializeUser(this.serialize);
    passport.deserializeUser(this.unserialize);

    var googleStrategy = new GoogleStrategy(googleOptions, _googleStrategyCallback);

    passport.use(googleStrategy);

    var app = express();
    // configure Express
    app.configure(this.configure(app));
    app.get('/auth/google',
        passport.authenticate('google',
            { scope: ['https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'] }));

    app.get('/oauth2callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

    app.post('/signup', function(req, res) {
        var userDoc = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password1
        };
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userDoc.password, salt, function(err, hash) {
                userDoc.password = hash;             
                db.insert(userDoc, function(err, body){
                    //Send confirmation email. 
                    res.send('worked!');
                });
            });
        });
    });

    app.get('/signup', function(req, res) {
        res.render('signup');
    });

    app.get('/logout', this.logout);

    return app;

  } else {
    throw new Error('LIBRE_GOOGLE_CLIENT_ID and LIBRE_GOOGLE_CLIENT_SECRET env vars need to be defined');
  }
};

libreUser.prototype.configure = function(app) {
  return function () {
    //TODO: Check cookieParser() is used
    //TODO: Check bodyParser() is used
    //TODO: Check methodOverride() is used
    //TODO: Check sessions exists

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.set('views', __dirname + '/views');
  };
 };

/**
 * ensureAuthenticated
 *
 * @param req
 * @param res
 * @param next
 * @return
 */
libreUser.prototype.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
};

/**
 * serialize
 *
 * @param user
 * @param done
 * @return
 */
libreUser.prototype.serialize = function(user, done) {
  done(null, user);
};

/**
 * unserialize
 *
 * @param obj
 * @param done
 * @return
 */
libreUser.prototype.unserialize = function(obj, done) {
  done(null, obj);
};

/**
 * logout
 *
 * @param req
 * @param res
 * @return
 */
libreUser.prototype.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * init
 *
 * @return
 */
libreUser.prototype.init = function() {
 
};

module.exports = libreUser;
