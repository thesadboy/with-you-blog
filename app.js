var express = require('express')
	, routes = require('./routes/routes.js')
	, http = require('http')
	, path = require('path')
	, MongoStore = require("connect-mongo")(express)
	, fs = require("fs")
	, argv = require("optimist").default("config",process.cwd()+"/config.json").argv;

var app = express();
try{
	options = JSON.parse(fs.readFileSync(argv.config));
} catch(e)
{
	throw new Error("could not read config " + argv.config + "internal error: " + e.toString());
}
// all environments
app.set('port', options.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('options',options);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	secret : options.database.cookieSecret,
	store : new MongoStore({
		db : options.database.db
	})
}));
app.use(function(req,res,next){
	res.locals.user = req.session.user || null;
	next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
