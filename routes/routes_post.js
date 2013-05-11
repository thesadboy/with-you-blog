var db = require("../db/db")
	,Post = require("../db/Post")
	,md = require("node-markdown").Markdown;

module.exports = function(app){
	var cache = app.get('cache');
	app.post("/post",function(req,res,next){
		var postInfo = req.body['postInfo'];
		var post = new Post({
			type : postInfo.type,
			imgUrl : postInfo.imgUrl,
			postTitle : postInfo.postTitle,
			description : postInfo.description,
			content : postInfo.content,
			tags : postInfo.tags,
			createTime : new Date(),
			updateTime : new Date(),
			author : res.locals.user
		});
		post.save(function(err,data){
			if(err)
			{
				res.send({
					errorCode : -1,
					errorMsg : "文章发表失败'"
				});
			}
			console.log(data);
			res.send({
				errorCode : 0,
				errorMsg : "发表成功",
				data : {
					post : data
				}
			});
		});
	});
	//获取最新发布的文章
	app.get('/post/latest/post',function(req,res,next){
		if(!cache.get('latest_post'))
		{
			app.get('initPostData')(function(err){
				if(err)
				{
					res.send({
						errorCode : -1,
						errorMsg : "获取最新发布文章失败"
					});
				}
				res.send({
					errorCode : 0,
					posts : cache.get('latest_post')
				});
			});
		}
		res.send({
			errorCode : 0,
			posts : cache.get('latest_post')
		});
	});
	//获取最新回复的文章
	app.get('/post/latest/reply',function(req,res,next){
		if(!cache.get('latest_reply'))
		{
			app.get('initPostData')(function(err){
				if(err)
				{
					res.send({
						errorCode : -1,
						errorMsg : "获取最新发布文章失败"
					});
				}
				res.send({
					errorCode : 0,
					posts : cache.get('latest_reply')
				});
			});
		}
		res.send({
			errorCode : 0,
			posts : cache.get('latest_reply')
		});
	});
	//文章详细
	app.get('/post/:postId',function(req,res,next){
		var postId = req.params.postId;
		var post;
		Post.get(postId,function(err, data){
			if(!err)
			{
				post = data;
				//将该博客的浏览量增加一个
				post.hits ++;
				Post.update(post,function(err){
					post.content = md(post.content);
					res.render('post',{
						title: data.postTitle,
						nav : "blogs",
						post : data
					});
				});
			}
		});
	});
}