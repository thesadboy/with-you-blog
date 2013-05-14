var pool = require("./pool")
	,BSON = require("mongodb").BSONPure;
function Tag(tag)
{
	this._id = tag._id;
	this.tagName = tag.tagName;
	this.tagDescription = tag.tagDescription;
	this.status = tag.status != null ? tag.status : 1;
}

module.exports = Tag;

Tag.prototype.save = function(callback)
{
	var tag = {
		_id : this._id,
		tagName : this.tagName,
		tagDescription : this.tagDescription,
		status : this.status
	}
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection("tags",function(err,collection){
			if(err)
			{
				return callback(err);
			}
			collection.ensureIndex('tagName',{unique:true});
			collection.insert(tag,{safe:true},function(err,tag){
				pool.release(db);
				return callback(err,tag);
			});
		});
	});
}
Tag.get = function(tagId, callback){
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('tags',function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.findOne({_id:new BSON.ObjectID(tagId)},function(err,doc){
				pool.release(db);
				if(doc)
				{
					var tag = new Tag(doc);
					return callback(err, tag);
				}
				else
				{
					return callback(err);
				}
			});
		});
	});
}
Tag.update = function(tag, callback)
{
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('tags',function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.save(tag, function(err, doc){
				pool.release(db);
				if(doc)
				{
					var tag = new Tag(doc);
					return callback(err, tag);
				}
				else
				{
					return callback(err);
				}
			});
		});
	});
}
Tag.query = function(conditions, callback){
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('tags',function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.find(conditions).sort({tagName:-1}).toArray(function(err, docs){
				pool.release(db);
				if(err)
				{
					return callback(err);
				}
				else
				{
					var tags = [];
					docs.forEach(function(doc, index){
						var tag = new Tag(doc);
						tags.push(tag);
					});
					return callback(err,tags);
				}
			});
		});
	});
}
Tag.delete = function(tagId, callback)
{
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('tags',function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.remove({_id:new BSON.ObjectID(tagId)},{safe:true},function(err){
				pool.release(db);
				return callback(err);
			});
		});
	});
}