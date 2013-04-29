$(document).ready(function(){
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
					},3000);
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
	//用户注册时的一些功能
	$("#sign-up-cancel").click(function (e) {
		history.back();
	});
	$("#sign-up-reg").click(function (e) {
		_this = this;
		//注册
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
					$("#reg-error").html(data.errorMsg);
				} else{
					$("#reg-error").html(data.errorMsg);
					setTimeout(function(){
						window.location.href="/";
					},3000);
				}
			}
			$(_this).button("reset");
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
});

