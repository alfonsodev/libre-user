var should = require('should');
var LibreUser = require('..');
var libreUser = new LibreUser();
var express = require('express');

describe('When ensureAuthenticated function is called', function() {

	it('should call next function if req.isAuthenticated is true', function(done) {
		// mock user request
		var req = {};
		req.isAuthenticated = function() { return true; };
		// mock next and test is called
		var next = function() {
			true.should.be.true;
			done();
		};
		// Mock response
		var res = {};
		libreUser.ensureAuthenticated(req, res, next);
	});

	it('it should redirect to / if req.isAuthenticated is false', function(done) {
		// mock user request
		var req = {};
		req.isAuthenticated = function() { return false; };
		// mock next and test next is not called
		var next = function() {
			true.should.be.false;
			done();
		};

		// Mock response
		var res = {};
		res.redirect = function(route) {
			route.should.equal('/');
			done();
		}
		libreUser.ensureAuthenticated(req, res, next);
	});

});

describe('When init funciton is called', function () {
	it('should throw an exception if env vars are not defined', function() {
		// Overwrite en var so we can play safe with this test
		process.env['LIBRE_GOOGLE_CLIENT_ID'] = '';
		process.env['LIBRE_GOOGLE_CLIENT_SECRET'] = 'asfasfasd';

		libreUser.middleware.should.throwError();

	});

	it('returns an express application that can be used as middleware', function() {
		// Overwrite en var so we can play safe with this test
		process.env['LIBRE_GOOGLE_CLIENT_ID'] = 'secret token for google apis';
		process.env['LIBRE_GOOGLE_CLIENT_SECRET'] = 'asfasfasd';

		var app = libreUser.middleware();
		app.should.be.a('function');
	});

});

describe('Configure application', function () {
	it('bablabla', function() {
		var app = new express();
		var result = libreUser.configure(app);
		result.should.be.a('function');
		result.should.not.throw();
	});
});

describe('Serialize and unserialize user data', function() {
	it('Serialize user data', function(done) {
		var user = {
			name: 'Fake user',
			user: 'this@username.com'
		};

		var callback = function(error, userData) {
			should.equal(error, null);
			user.should.equal(userData);
			done();
		};

		var result = libreUser.serialize(user, callback);

	});

	it('Unserialize user data', function(done) {
		var user = {
			name: 'Fake user',
			user: 'this@username.com'
		};

		var callback = function(error, userData) {
			should.equal(error, null);
			user.should.equal(userData);
			done();
		};

		var result = libreUser.unserialize(user, callback);

	});
});


describe('Should logout the user session', function() {
	it('Should call logout request method, and redirect to /', function() {

		var req = {
			logout: function() {
				true.should.equal(true);
			}
		};

		var res = {
			redirect: function(where) {
				where.should.equal('/');
			}
		};

		libreUser.logout(req, res);

	});
});
