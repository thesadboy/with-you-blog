var userRoute = require('./routes_user')
	,settingRoute = require("./routes_setting")
	,Tag = require("../db/Tag");
function route(app){
	app.locals({
		nav:"home",
	});
	app.get("/",function(req,res,next){
		res.render("index",{
			title : "WITH YOU, JUST YOU & ME",
			nav : "home"
		});
	});
	app.get("/photos",function(req,res,next){
		res.render("photos",{
			title : "SWEET MOMENT",
			nav : "photos"
		});
	});
	app.get("/blogs",function(req,res,next){
		res.render("blogs",{
			title: "SWEET DESCRIPTION",
			nav : "blogs"
		});
	});
	app.get("/about",function(req,res,next){
		res.render("about",{
			title : "ABOUT YOU, ABOUT ME",
			nav : "about"
		});
	});
	app.get("/post/editor/:operation",function(req,res,next){
		Tag.query({status:1},function(err, data){
			res.render("post_editor",{
				title : "WRITE YOUR FEEL",
				operation : req.params.operation,
				tags : data
			});
		});
	});
	userRoute(app);
	settingRoute(app);
};
module.exports = route;