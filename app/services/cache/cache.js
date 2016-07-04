var Memcached = require('memcached');
var configs = require('../../../configs/cache');

module.exports = new Memcached(configs.address + ':' + configs.port);
