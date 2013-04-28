var Db = require("mongodb").Db
	,Connection = require("mongodb").Connection
	,Server = require("mongodb").Server
	, fs = require("fs")
	, argv = require("optimist").default("config",process.cwd()+"/config.json").argv;

try{
	options = JSON.parse(fs.readFileSync(argv.config));
} catch(e)
{
	throw new Error("could not read config " + argv.config + "internal error: " + e.toString());
}
module.exports = new  Db(options.database.db, new Server(options.database.host, options.database.port || Connection.DEFAULT_PORT, {}),{"auto_reconnect":options.database.server_option.auto_reconnect,"poolSize":options.database.server_option.poolSize,"safe":true});