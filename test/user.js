var should = require('should');
var User = require('../lib/libre-user/user.js');
var userFakeModel = {};
var user = new User(userFakeModel);

describe('to find a user', function() {
	it('can be found by id', function() {

		var theUser = user.find(1);
		theUser.should.be.a('object');

	});

	it('can be found by email also', function() {
		var theUser = user.find('admin@localhost.com');
		theUser.should.be.a('object');
	});
});