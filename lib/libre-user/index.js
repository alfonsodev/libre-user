var express = require('express');
var passport = require('passport');
var util = require('util');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var debug = require('debug')('libre-user');

var libreUser = {};

libreUser.configure = function(app) {
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
libreUser.ensureAuthenticated = function(req, res, next) {
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
libreUser.serialize = function(user, done) {
  done(null, user);
};

/**
 * unserialize
 *
 * @param obj
 * @param done
 * @return
 */
libreUser.unserialize = function(obj, done) {
  done(null, obj);
};

/**
 * logout
 *
 * @param req
 * @param res
 * @return
 */
libreUser.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * init
 *
 * @return
 */
libreUser.init = function() {
  if (process.env['LIBRE_GOOGLE_CLIENT_ID'] && process.env['LIBRE_GOOGLE_CLIENT_SECRET']) {
    var googleOptions = {
      clientID: process.env['LIBRE_GOOGLE_CLIENT_ID'],
      clientSecret: process.env['LIBRE_GOOGLE_CLIENT_SECRET'],
      callbackURL: 'http://localhost:3000/oauth2callback'
    };

    passport.serializeUser(this.serialize);
    passport.deserializeUser(this.unserialize);

    var googleStrategy = new GoogleStrategy(googleOptions,
        function(accessToken, refreshToken, profile, done) {
          process.nextTick(function() {
            return done(null, profile);
          });
        }
        );

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

    app.get('/logout', this.logout);

    return app;

  } else {
    throw new Error('LIBRE_GOOGLE_CLIENT_ID and LIBRE_GOOGLE_CLIENT_SECRET env vars need to be defined');
  }
};

module.exports = libreUser;
