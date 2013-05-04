$(document).ready(function(){
	//输入框事件监听
	$("#input-password").keypress(function(event) {
		if(event.keyCode == 13)
		{
			$("#sign-in").trigger("click");
		}
	});
	//点击取消登录时的操作
	$("#sign-in-close").click(function (e) {
		$("#sign-in-form-reset").trigger("click");
		$("#sign-in-modal").modal("hide");
	});
	//登录
	$("#sign-in").click(function (e) {
		_this = this;
		$(_this).button("loading");
		var userInfo = {
			username : $("#input-username").val(),
			password : $("#input-password").val(),
			loginTime : new Date()
		};
		$.post("/signin",{"userInfo": userInfo},function(data,status){
			if(status == "success")
			{
				if(data.errorCode != 0)
				{
					//登录失败
					$("#sign-in-error").html(data.errorMsg);
					$(_this).button("reset");
				}
				else
				{
					//登录成功
					$("#sign-in-error").html(data.errorMsg);
					setTimeout(function(){
						window.location.href=window.location.href;
					},1500);
				}
			}
		});
	});
	//照片的鼠标移上去的效果
	$(".photos > .photo").mouseover(function(event) {
		$(this).addClass("photo-mouse-over");
	}).mouseout(function(event) {
		$(this).removeClass("photo-mouse-over");
	});
	//为所有的tags添加随机样式
	$(".tags a").addClass(getRandomLabelStyle);
	//为所有的回复数目添加随机样式
	$("span.reply a").addClass(getrandomBadgeStyle);
	//用户注册时的一些功能
	$("#sign-up-cancel").click(function (e) {
		history.back();
	});
	//输入框事件监听
	$("#reg-input-repassword").keypress(function(event) {
		if(event.keyCode == 13)
		{
			$("#sign-up-reg").trigger("click");
		}
	});
	$("#sign-up-reg").click(function (e) {
		_this = this;
		//注册
		//验证

		$("#reg-input-username").parent().parent().removeClass("error");
		$("#reg-input-password").parent().parent().removeClass("error");
		$("#reg-input-repassword").parent().parent().removeClass("error");
		if(!$("#reg-input-username").val().match(/^\w{6,20}$/))
		{
			//用户名不可用
			$("#reg-input-username").parent().parent().addClass("error");
			$("#reg-error").html("用户名不可用");
			return;
		}
		if(!$("#reg-input-password").val().match(/^\w{6,20}$/))
		{
			//用户密码不可用
			$("#reg-input-password").parent().parent().addClass("error");
			$("#reg-error").html("用户密码不可用");
			return;
		}
		if($("#reg-input-password").val() != $("#reg-input-repassword").val())
		{
			//两次密码不一致
			$("#reg-input-password").parent().parent().addClass("error");
			$("#reg-input-repassword").parent().parent().addClass("error");
			$("#reg-error").html("两次密码不一致");
			return;
		}
		var userInfo = {
			username : $("#reg-input-username").val(),
			password : $("#reg-input-password").val(),
			createTime : new Date()
		};
		$(_this).button("loading");
		$.post("/signup",{"userInfo":userInfo},function(data,status){
			if(status == "success")
			{
				if(data.errorCode != 0)
				{
					if(data.errorCode == 11000)
					{
						$("#reg-error").html("用户名已经被注册，请换一个用户名再试");
					}
					else
					{
						$("#reg-error").html(data.errorMsg);
					}
					$(_this).button("reset");
				} else{
					$("#reg-error").parent().parent().removeClass("error").addClass("success");
					$("#reg-error").html(data.errorMsg);
					setTimeout(function(){
						window.location.href="/";
					},1500);
				}
			}
		});
	});
	//登出的取消
	$("#sign-out-close").click(function (e) {
		$("#sign-out-modal").modal("hide");
	});
	$("#sign-out").click(function (e) {
		var _this = this;
		$(this).button("loading");
		$.get("/signout",function(data,status){
			if(status == "success")
			{
				window.location.href = window.location.href;
			}
		});
	});
	//将标签信息放到右边的列表中
	$.get("/tags",function(data,status){
		if(status == "success")
		{
			if(data.errorCode == 0)
			{
				var tags = data.tags;
				var items = '';
				for(var i = 0; i < tags.length ; i ++)
				{
					items += '<li><a class="'+getrandomBadgeStyle()+'" href="/tag/:'+tags[i]._id+'">'+tags[i].tagName+'</a></li>';
				}
				$("ul#right-tags").html(items);
			}
		}
	});
});
//获取随机的label样式
function getRandomLabelStyle()
{
	var ranNum = parseInt(Math.random()*(6-1+1)+1);
	switch(ranNum)
	{
		case 1 :
			return "label";
		case 2:
			return "label label-success";
		case 3:
			return "label label-warning";
		case 4:
			return "label label-important";
		case 5:
			return "label label-info";
		case 6:
			return "label label-inverse";
		default :
			return "label";
	}
}
//获取随机的badge样式
function getrandomBadgeStyle()
{
	var ranNum = parseInt(Math.random()*(6-1+1)+1);
	switch(ranNum)
	{
		case 1 :
			return "badge";
		case 2:
			return "badge badge-success";
		case 3:
			return "badge badge-warning";
		case 4:
			return "badge badge-important";
		case 5:
			return "badge badge-info";
		case 6:
			return "badge badge-inverse";
		default :
			return "badge";
	}
}