var userRoutes = require('./routes_user');
function route(app){
	app.locals({
		nav:"home"
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
	app.get("/post/blog",function(req,res,next){
		res.render("post_blog",{
			title : "WRITE YOUR FEEL"
		});
	});
	userRoutes(app);
};
module.exports = route;