var _db = require("./db");
function User(user){
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
	var user = {
		userName : this.userName,
		password : this.password,
		name : this.name,
		email : this.email,
		birth : this.birth,
		createTime : this.createTime,
		loginTime : this.loginTime,
		lastLoginTime : this.lastLoginTime,
		loginIp : this.loginIp,
		lastLoginIp : this.lastLoginIp
	}
	_db.open(function(err, db){
		if(err)
		{
			callback(err,null);
		}
		db.collection('users',function(err, collection){
			if(err)
			{
				_db.close()
				callback(err, null);
			}
			//为userName属性添加索引
			collection.ensureIndex('userName', {unique : true});
			//写入user文档
			collection.insert(user,{safe:true},function(err, user){
				_db.close();
				callback(err,user);
			});
		});
	});
}