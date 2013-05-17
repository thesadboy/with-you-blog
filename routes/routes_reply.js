var Post = require("../db/Post"),
	Reply = require("../db/Reply"),
	User = require("../db/User"),
	md = require("node-markdown").Markdown;

module.exports = function(app) {
	var cache = app.get('cache');
	app.post("/reply", function(req, res, next) {
		var replyInfo = req.body['replyInfo'];
		var reply = new Reply({
			postId: replyInfo.postId,
			author: res.locals.user,
			createTime: new Date(),
			content: replyInfo.content
		});
		User.get(replyInfo.to, function(err, user) {
			if (err) {
				res.send({
					errorCode: -1,
					errorMsg: "发表回复失败"
				});
			}
			if(user._id != reply.author._id)
			{
				reply.to = user;
			}
			Post.get(replyInfo.postId, function(err, post) {
				if (err) {
					res.send({
						errorCode: -1,
						errorMsg: "发表回复失败"
					});
				}
				post.updateTime = new Date();
				Post.update(post, function(err) {
					if (err) {
						res.send({
							errorCode: -1,
							errorMsg: "发表回复失败"
						});
					}
					reply.save(function(err, reply) {
						if (err) {
							res.send({
								errorCode: -1,
								errorMsg: "发表回复失败"
							});
						}
						res.send({
							errorCode: 0,
							errorMsg: "发表回复成功"
						});
					});
				});
			});
		});
	});
	app.get("/replies",function(req,res,next){
		var postId = req.query.postId || 0;
		var page = req.query.page || 1;
		var pageSize = 20;
		var pages = 0;
		var replies = [];
		Reply.query({status:1, postId : postId},(page -1) * pageSize, pageSize,{createTime:-1},function(err, data, count){
			if(!err)
			{
				replies = data;
				var extCount = count % pageSize;
				pages = (count - extCount) / pageSize;
				pages = extCount  == 0 ? pages : pages + 1;
				pages = pages == 0 ? pages + 1 : pages;
				res.send({
					errorCode : 0,
					data : {
						count: count,
						pages : pages,
						page : page,
						replies : replies
					}
				});
			}
			else
			{
				res.send({
					errorCode : -1,
					errorMsg : "获取回复信息失败"
				});
			}
		});
	});
}