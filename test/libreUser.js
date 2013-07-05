var should = require('should');
var libreUser = require('..');
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
		//overwrite en var so we can play safe with this test
		process.env['LIBRE_GOOGLE_CLIENT_ID'] = '';
		process.env['LIBRE_GOOGLE_CLIENT_SECRET'] = 'asfasfasd';

		libreUser.init.should.throwError();

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