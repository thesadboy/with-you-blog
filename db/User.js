var pool = require("./pool");
function User(user){
	this._id = user._id;
	this.userName = user.userName;
	this.password = user.password;
	this.name = user.name;
	this.email = user.email;
	this.birth = user.birth;
	this.createTime = user.createTime;
	this.loginTime = user.loginTime;
	this.lastLoginTime = user.lastLoginTime;
	this.loginIp = user.loginIp;
	this.lastLoginIp = user.lastLoginIp;
};
module.exports = User;

User.prototype.save = function(callback)
{
	//存入Mongodb的文档
	var user = this;
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('users',function(err, collection){
			if(err)
			{
				return callback(err);
			}
			//为userName属性添加索引
			collection.ensureIndex('userName', {unique : true});
			//写入user文档
			collection.insert(user,{safe:true},function(err, user){
				callback(err,user);
				pool.release(db);
			});
		});
	});
}
User.get = function(username,callback){
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('users',function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.findOne({userName:username}, function(err, doc){
				pool.release(db);
				if(doc)
				{
					var user = new User(doc);
					callback(err, user);
				}
				else
				{
					callback(err);
				}
			});
		});
	});
};
User.update = function(user, callback){
	pool.acquire(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('users',function(err, collection){
			if(err)
			{
				return callback(err);
			}
			collection.save(user, {safe:true}, function(err, doc){
				pool.release(db);
				if(doc)
				{
					var user = new User(doc);
					callback(err, user);
				}
				else
				{
					callback(err);
				}
			});
		});
	});
}