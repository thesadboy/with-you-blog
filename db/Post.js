var pool = require("./pool")
	,BSON = require("mongodb").BSONPure;
function Post(post)
{
	this._id = post._id;
	this.type = post.type;
	this.imgUrl = post.imgUrl;
	this.postTitle = post.postTitle;
	this.description = post.description;
	this.content = post.content;
	this.tags = post.tags;
	this.createTime = post.createTime;
	this.updateTime = post.updateTime;
	this.author = post.author;
	this.reply = post.reply != null ? post.reply : 0;
	this.hits = post.hits != null ? post.hits : 0;
}
module.exports = Post;
Post.prototype.save = function(callback)
{
	var post = {
		_id : this._id,
		type : this.type,
		imgUrl : this.imgUrl,
		postTitle : this.postTitle,
		description : this.description,
		content : this.content,
		tags : this.tags,
		createTime : this.createTime,
		updateTime : this.updateTime,
		author : this.author,
		reply : this.reply,
		hits : this.hits
	}
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection("posts",function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.insert(post,{safe:true},function(err,tag){
				pool.release(db);
				return callback(err,tag);
			});
		});
	});
}
Post.get = function(postId, callback){
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection("posts",function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.findOne({_id:new BSON.ObjectID(postId)},function(err, doc){
				pool.release(db);
				if(doc)
				{
					var post = new Post(doc);
					return callback(err, post);
				}
				return callback(err);
			});
		});
	});
}
Post.update = function(post, callback){
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection("posts",function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.save(post,{safe:true},function(err, doc){
				pool.release(db);
				if(doc)
				{
					var post = new Post(doc);
					return callback(err, post);
				}
				return callback(err);
			});
		});
	});
}
Post.query = function(conditions, startData, pageSize, sortOptions, callback){
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection("posts",function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.count(conditions,function(err, count){
				if(err)
				{
					return callback(err);
				}
				collection.find(conditions).sort(sortOptions).skip(startData).limit(pageSize).toArray(function(err, docs){
					pool.release(db);
					if(err)
					{
						return callback(err);
					}
					var posts = [];
					docs.forEach(function(doc,index){
						var post = new Post(doc);
						posts.push(post);
					});
					return callback(err, posts, count);
				});
			});
		});
	});
}
Post.delete = function(postId, callback){
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection("posts",function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.remove({_id: new BSON.ObjectID(postId)},{safe : true},function(err){
				pool.release(db);
				return callback(err);
			});
		});
	});
}