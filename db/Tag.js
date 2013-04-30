var _db = require("./db")
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
	_db.open(function(err,db){
		if(err)
		{
			callback(err);
		}
		db.collection("tags",function(err,collection){
			if(err)
			{
				_db.close();
				callback(err);
			}
			collection.ensureIndex('tagName',{unique:true});
			collection.insert(tag,{safe:true},function(err,tag){
				_db.close();
				callback(err,tag);
			});
		});
	});
}
Tag.get = function(tagId, callback){
	_db.open(function(err, db){
		if(err)
		{
			return callback(err);
		}
		db.collection('tags',function(err, collection){
			if(err)
			{
				_db.close();
				return callback(err);
			}
			collection.findOne({_id:new BSON.ObjectID(tagId)},function(err,doc){
				_db.close();
				if(doc)
				{
					var tag = new Tag(doc);
					callback(err, tag);
				}
				else
				{
					callback(err);
				}
			});
		});
	});
}
Tag.update = function(tag, callback)
{
	_db.open(function(err, db){
		if(err)
		{
			callback(err);
		}
		db.collection('tags',function(err, collection){
			if(err)
			{
				_db.close();
				callback(err);
			}
			collection.save(tag, function(err, doc){
				_db.close();
				if(doc)
				{
					var tag = new Tag(doc);
					callback(err, tag);
				}
				else
				{
					callback(err);
				}
			});
		});
	});
}
Tag.query = function(conditions, callback){
	_db.open(function(err,db){
		if(err)
		{
			callback(err);
		}
		db.collection('tags',function(err, collection){
			if(err)
			{
				_db.close();
				callback(err);
			}
			collection.find(conditions).sort({time:-1}).toArray(function(err, docs){
				_db.close();
				if(err)
				{
					callback(err);
				}
				else
				{
					var tags = [];
					docs.forEach(function(doc, index){
						var tag = new Tag(doc);
						tags.push(tag);
					});
					callback(err,tags);
				}
			});
		});
	});
}
Tag.delete = function(tagId, callback)
{
	_db.open(function(err, db){
		if(err)
		{
			callback(err);
		}
		db.collection('tags',function(err, collection){
			if(err)
			{
				_db.close();
				callback(err);
			}
			collection.remove({_id:new BSON.ObjectID(tagId)},function(err){
				_db.close();
				callback(err);
			});
		});
	});
}