var crypto = require("crypto")
	, Tag = require("../db/Tag");

module.exports = function(app)
{
	var cache = app.get('cache');
	app.get("/settings",function(req,res,next){
		res.render("settings",{
			title : "SYSTEM SETTINGS"
		});
	})
	app.get("/settings/tags",function(req,res,next){
		Tag.query({},function(err, data){
			res.render("settings_tags",{
				title : "SYSTEM SETTINGS",
				tags : data
			});
		});
	});
	app.post("/settings/tags/new",function(req,res,next){
		var tagInfo = req.body['tagInfo'];
		var tag = new Tag({
			tagName : tagInfo.tagName,
			tagDescription : tagInfo.tagDescription
		});
		tag.save(function(err, data){
			if(err)
			{
				res.send({
					errorCode : err.code,
					errorMsg : "添加失败"
				});
			}
			cache.del('tags');
			res.send({
				errorCode : 0,
				errorMsg : "添加成功"
			})
		});
	});
	app.post("/settings/tags/update",function(req,res,next){
		var tagInfo = req.body['tagInfo'];
		Tag.get(tagInfo._id,function(err, data){
			if(err)
			{
				res.send({
					errorCode : err.code,
					errorMsg : "修改失败"
				});
			}
			data.tagName = tagInfo.tagName || data.tagName;
			data.tagDescription = tagInfo.tagDescription || data.tagDescription;
			data.status = parseInt(tagInfo.status || data.status);
			Tag.update(data,function(err, data){
				if(err)
				{
					res.send({
						errorCode : err.code,
						errorMsg : "修改失败"
					});
				}
				cache.del('tags');
				res.send({
					errorCode : 0,
					errorMsg : "修改成功"				
				});
			});
		});
	});
	app.post("/settings/tags/delete",function(req,res,next){
		var tagInfo = req.body['tagInfo'];
		Tag.delete(tagInfo._id,function(err){
			if(err)
			{
				res.send({
					errorCode : err.code,
					errorMsg : "删除失败"
				});
			}
			cache.del('tags');
			res.send({
				errorCode : 0,
				errorMsg : "删除成功"
			});
		});
	});
	app.get("/tags",function(req,res,next){
		if(!cache.get('tags'))
		{
			app.get("initPostData")(function(err){
				if(err)
				{
					res.send({
						errorCode : -1,
						errorMsg : "加载数据失败"
					})
				}
				res.send({
					errorCode : 0,
					tags : cache.get('tags')
				});
			});
		}
		res.send({
			errorCode : 0,
			tags : cache.get('tags')
		});
	})
}