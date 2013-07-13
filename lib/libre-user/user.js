var debug = require('debug')('libre-user-user');
var user = function(userModel) {
	this.userModel = userModel;
};

user.prototype.find = function(idOrEmail) {
	return {};
};

module.exports = user;