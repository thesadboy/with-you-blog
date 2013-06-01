var Post = require("../db/Post")
	,converter = require("../utils/custom-converter");

module.exports = function(app){
	var cache = app.get('cache');
	//文章详细
	app.get('/photo/:postId',function(req,res,next){
		var postId = req.params.postId;
		var post;
		Post.get(postId,function(err, data){
			if(!err)
			{
				post = data;
				//将该博客的浏览量增加一个
				post.hits ++;
				Post.update(post,function(err){
					if(err)
					{
						res.send({
							errorCode: -1,
							errorMsg:'获取照片信息失败'
						});
					}
					post.content = converter(post.content);
					res.send({
						errorCode : 0,
						post : post
					});
				});
			}
		});
	});
}