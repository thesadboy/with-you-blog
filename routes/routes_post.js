var db = require("../db/db")
	,Post = require("../db/Post");

module.exports = function(app){
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
}