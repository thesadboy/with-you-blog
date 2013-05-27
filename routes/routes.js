var userRoute = require('./routes_user')
	,settingRoute = require("./routes_setting")
	,postRoute = require("./routes_post")
	,replyRoute = require("./routes_reply")
	,Post = require("../db/Post")
	,Tag = require("../db/Tag");
function route(app){
	var cache = app.get('cache');
	//初始化部分数据
	app.set('initPostData',function(callback){
		Post.query({type:'blog'},0,10,{createTime:-1},function(err, data, count){
			if(!err)
			{
				cache.put('latest_post',data, 60000);
				Post.query({type:'blog'},0,10,{updateTime:-1},function(err, data, count){
					if(!err)
					{
						cache.put('latest_reply',data, 60000);
						if(!cache.get('tags'))
						{
							Tag.query({status : 1},function(err, data){
								if(!err)
								{
									cache.put('tags',data);
									if(callback)
										return callback();
								}
								else
								{
									if(callback)
										return callback(err);
								}
							});
						}
						else
						{
							if(callback)
								return callback();
						}
					}
					else
					{
						if(callback)
							return callback(err);
					}
				});
			}
			else
			{
				if(callback)
					return callback(err);
			}
		});
	});
	app.get("initPostData")();
	app.locals({
		nav:"home",
	});
	app.get("/*",function(req,res,next){
		if(!cache.get("latest_reply") || !cache.get("latest_post") || !cache.get("tags")){
			app.get("initPostData")(function(){
				next();
			});
		} else{
			next();
		}
	});
	app.get("/",function(req,res,next){
		Post.query({},0,10,{createTime:-1},function(err, data, count)
			{
				var posts = [];
				if(!err)
				{
					posts = data;
				}
				res.render("index",{
					title : "WITH YOU, JUST YOU & ME",
					nav : "home",
					posts : posts
				});
			});
	});
	app.get("/photos",function(req,res,next){
		res.render("photos",{
			title : "SWEET MOMENT",
			nav : "photos"
		});
	});
	app.get("/blogs",function(req,res,next){
		var page = req.query.page || 1;
		var pageSize = 20;
		var pages = 0;
		var posts = [];
		Post.query({},(page -1) * pageSize, pageSize, {updateTime:-1}, function(err, data, count){
			if(!err)
			{
				posts = data;
				var extCount = count % pageSize;
				pages = (count - extCount) / pageSize;
				pages = extCount  == 0 ? pages : pages + 1;
				pages = pages == 0 ? pages + 1 : pages;
			}
			res.render("blogs",{
				title: "SWEET DESCRIPTION",
				nav : "blogs",
				pages : pages,
				page : page,
				posts : posts
			});
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
	postRoute(app);
	replyRoute(app);
};
module.exports = route;