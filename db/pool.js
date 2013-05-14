var MongoClient = require('mongodb').MongoClient
	, Server = require('mongodb').Server
	, poolModule = require('generic-pool')
	, fs = require("fs")
	, argv = require("optimist").default("config",process.cwd()+"/config.json").argv;

try{
	options = JSON.parse(fs.readFileSync(argv.config));
} catch(e)
{
	throw new Error("could not read config " + argv.config + "internal error: " + e.toString());
}
module.exports = poolModule.Pool({
	name: 'with-you-blog-mongo-db',
	create: function(callback) {
		MongoClient.connect(options.database.url, {
			server:{poolSize:options.database.server_option.poolSize,auto_reconnect:options.database.server_option.auto_reconnect},
		}, function(err, db) {
			callback(err,db);
		});
	},
	destroy: function() {},
	idleTimeoutMillis: 30000,
	max:50,
	min:5,
	log: false
});