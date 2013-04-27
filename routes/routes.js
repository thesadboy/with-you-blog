var db = require("../db/db")
	, crypto = require("crypto")
	,User = require("../db/User");
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
	app.get("/signup",function(req,res,next){
		res.render("signup",{
			title : "JOIN US",
		});
	});
	app.post("/signup",function(req,res,next){
		var userInfo = req.body['userInfo'];
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var user = new User(
			{
				userName : userInfo.username,
				password : md5.update(userInfo.password).digest('base64'),
				loginIp : req.connection.remoteAddress,
				lastLoginIp : req.connection.remoteAddress,
				createTime: userInfo.createTime
			});
		user.save(function(err,data){
			if(err)
			{
				res.send({
					errorCode : err.code,
					errorMsg : "注册失败"
				});
				return;
			}
			res.send({
				errorCode : 0,
				errorMsg : "注册成功"
			});
		});
	});
};
module.exports = route;