

/**
 * Expose libre-user library
 *
 */
module.exports = process.env.LIBRE_USER_COV ? require('./lib-cov/libre-user') :
    require('./lib/libre-user');

