$(document).ready(function(){
	//点击取消登录时的操作
	$("#sign-in-close").click(function (e) {
		$("#sign-in-form-reset").trigger("click");
		$("#sign-in-modal").modal("hide");
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
			username : $("#input-username").val(),
			password : $("#input-password").val(),
			createTime : new Date()
		}
		$(_this).button("loading");
		$.post("/signup",{"userInfo":userInfo},function(data,status){
			if(status == "success")
			{
				if(data.errorCode != 0)
				{
					$("#reg-error").html(data.errorMsg);
				} else{
					$("#reg-error").html(data.errorMsg)
					setTimeout(function(){
						window.location.href="/";
					},3000);
				}
			}
			$(_this).button("reset");
		});
	});
    var pagedown_editor = new Markdown.Editor();
    pagedown_editor.run();
    $("#preview").click(function () {
		var converter = new Markdown.Converter();
		var markdown_content = $("#wmd-input").val();
		if (!markdown_content) {
			$("div#markdownpreview").html("Empty Markdown Content.");
		} else {
			$("div#markdownpreview").html(converter.makeHtml(markdown_content));
		}
	});
});

