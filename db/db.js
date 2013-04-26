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
module.exports = new  Db(options.database.db, new Server(options.database.host, Connection.DEFAULT_PORT, {}));