var pool = require("./pool")
	,BSON = require("mongodb").BSONPure
	,md = require("node-markdown").Markdown;
function Reply(reply)
{
	this._id = reply._id;
	this.postId = reply.postId;
	this.createTime = reply.createTime;
	this.author = reply.author;
	this.to = reply.to;
	this.content = reply.content;
	this.status = reply.status != null ? reply.status : 1;
}

module.exports = Reply;

Reply.prototype.save = function(callback)
{
	var reply =this;
	pool.acquire(function(err, db){
		if(err)
		{
			return callback(err);
		}
		db.collection("replies",function(err, collection){
			if(err)
			{
				pool.release(db);
				return callback(err);
			}
			collection.insert(reply,{safe:true},function(err, reply){
				pool.release(db);
				return callback(err, reply);
			});
		});
	});
}
Reply.get = function(replyId, callback)
{
	pool.acquire(function(err, db){
		if(err)
		{
			return callback(err);
		}
		db.collection("replies",function(err, collection){
			if(err)
			{
				pool.release(db);
				return callback(err);
			}
			collection.findOne({_id: new BSON.ObjectID(replyId)},function(err, doc){
				pool.release(db);
				if(doc)
				{
					var reply = new Reply(doc);
					return callback(err,post);
				}
				return callback(err);
			});
		});
	});
}
Reply.query = function(conditions, startData, pageSize, sortOptions, needConvert, callback)
{
	pool.acquire(function(err, db){
		db.collection("replies",function(err, collection){
			if(err)
			{
				pool.release(db);
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
					var replies = [];
					docs.forEach(function(doc,index){
						var reply = new Reply(doc);
						if(needConvert)
						{
							reply.content = md(reply.content);
						}
						replies.push(reply);
					});
					return callback(err, replies, count);
				});
			});
		});
	});
}