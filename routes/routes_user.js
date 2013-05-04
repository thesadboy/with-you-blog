var db = require("../db/db")
	, crypto = require("crypto")
	,User = require("../db/User");

module.exports = function(app)
{
	app.get("/signup",function(req,res,next){
		res.render("signup",{
			title : "JOIN US",
		});
	});
	app.get("/signout",function(req,res,next){
		req.session.destroy();
		res.send({
			errorCode : 0,
			errorMsg : "登出成功"
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
			req.session.user = data[0];
			res.send({
				errorCode : 0,
				errorMsg : "注册成功"
			});
		});
	});
	//登录
	app.post("/signin",function(req,res,next){
		var userInfo = req.body['userInfo'];
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var user = new User(
			{
				userName : userInfo.username,
				password : md5.update(userInfo.password).digest('base64'),
				loginIp : req.connection.remoteAddress,
				loginTime : userInfo.loginTime
			});
		User.get(user.userName, function(err, data){
			if(err)
			{
				//登录失败
				res.send({
					errorCode : -1,
					errorMsg : "用户名或密码错误"
				});
			}
			else
			{
				if(data == null || user.password != data.password)
				{
					//密码错误
					res.send({
						errorCode : -1,
						errorMsg : "用户名或密码错误"
					});
				}
				else
				{
					//登录成功
					data.lastLoginIp = data.loginIp;
					data.loginIp = user.loginIp;
					data.lastLoginTime = data.loginTime;
					data.loginTime = user.loginTime;
					User.update(data, function(err){
						if(err)
						{
							res.send({
								errorCode : -1,
								errorMsg : "登录失败，服务器错误"
							});
						}
						else
						{
							User.get(user.userName, function(err, data){
								if(err)
								{
									//登录失败
									res.send({
										errorCode : -1,
										errorMsg : "登录失败，服务器错误"
									});
								}
								else
								{
									req.session.user = data;
									res.send({
										errorCode : 0,
										errorMsg : "登录成功"
									});
								}
							});
						}
					});
				}
			}
		});
	});
}