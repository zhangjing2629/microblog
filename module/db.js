//var setting = require('../settings.js');
//var Db = require('mongodb').Db;
//var Connection = require('mongodb').Connection;
//var Server = require('mongodb').Server;
//
//module.exports = new Db(setting.db, new Server(setting.host, Connection.DEFAULT_PORT, {}), {safe: true});
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server("127.0.0.1", 27017, {}), {safe: true});
