var g_tags = [];
$(document).ready(function() {
	//code pretty
	prettyPrint();
	//输入框事件监听
	$("#input-password").keypress(function(event) {
		if (event.keyCode == 13) {
			$("#sign-in").trigger("click");
		}
	});
	//点击取消登录时的操作
	$("#sign-in-close").click(function(e) {
		$("#sign-in-form-reset").trigger("click");
		$("#sign-in-modal").modal("hide");
	});
	//登录
	$("#sign-in").click(function(e) {
		_this = this;
		$(_this).button("loading");
		var userInfo = {
			username: $("#input-username").val(),
			password: $("#input-password").val(),
			loginTime: new Date()
		};
		$.post("/signin", {
			"userInfo": userInfo
		}, function(data, status) {
			if (status == "success") {
				if (data.errorCode != 0) {
					//登录失败
					$("#sign-in-error").html(data.errorMsg);
					$(_this).button("reset");
				} else {
					//登录成功
					$("#sign-in-error").parent().parent().removeClass("error").addClass("success");
					$("#sign-in-error").html(data.errorMsg);
					setTimeout(function() {
						window.location.href = window.location.href;
					}, 1500);
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
	$("#sign-up-cancel").click(function(e) {
		history.back();
	});
	//输入框事件监听
	$("#reg-input-repassword").keypress(function(event) {
		if (event.keyCode == 13) {
			$("#sign-up-reg").trigger("click");
		}
	});
	$("#sign-up-reg").click(function(e) {
		_this = this;
		//注册
		//验证

		$("#reg-input-username").parent().parent().removeClass("error");
		$("#reg-input-password").parent().parent().removeClass("error");
		$("#reg-input-repassword").parent().parent().removeClass("error");
		if (!$("#reg-input-username").val().match(/^\w{6,20}$/)) {
			//用户名不可用
			$("#reg-input-username").parent().parent().addClass("error");
			$("#reg-error").html("用户名不可用");
			return;
		}
		if (!$("#reg-input-password").val().match(/^\w{6,20}$/)) {
			//用户密码不可用
			$("#reg-input-password").parent().parent().addClass("error");
			$("#reg-error").html("用户密码不可用");
			return;
		}
		if ($("#reg-input-password").val() != $("#reg-input-repassword").val()) {
			//两次密码不一致
			$("#reg-input-password").parent().parent().addClass("error");
			$("#reg-input-repassword").parent().parent().addClass("error");
			$("#reg-error").html("两次密码不一致");
			return;
		}
		var userInfo = {
			username: $("#reg-input-username").val(),
			password: $("#reg-input-password").val(),
			createTime: new Date()
		};
		$(_this).button("loading");
		$.post("/signup", {
			"userInfo": userInfo
		}, function(data, status) {
			if (status == "success") {
				if (data.errorCode != 0) {
					if (data.errorCode == 11000) {
						$("#reg-error").html("用户名已经被注册，请换一个用户名再试");
					} else {
						$("#reg-error").html(data.errorMsg);
					}
					$(_this).button("reset");
				} else {
					$("#reg-error").parent().parent().removeClass("error").addClass("success");
					$("#reg-error").html(data.errorMsg);
					setTimeout(function() {
						window.location.href = "/";
					}, 1500);
				}
			}
		});
	});
	//登出的取消
	$("#sign-out-close").click(function(e) {
		$("#sign-out-modal").modal("hide");
	});
	$("#sign-out").click(function(e) {
		var _this = this;
		$(this).button("loading");
		$.get("/signout", function(data, status) {
			if (status == "success") {
				window.location.href = window.location.href;
			}
		});
	});
	//将标签信息放到右边的列表中
	$.get("/tags", function(data, status) {
		if (status == "success") {
			if (data.errorCode == 0) {
				g_tags = data.tags;
				var items = '';
				for (var i = 0; i < g_tags.length; i++) {
					items += '<li><a class="' + getrandomBadgeStyle() + '" href="/tag/' + g_tags[i]._id + '">' + g_tags[i].tagName + '</a></li>';
				}
				$("ul#right-tags").html(items);
			}
		}
	});
	//将最新发表的博客放到右边的列表中
	$.get("/post/latest/post", function(data, status) {
		if (status == "success") {
			if (data.errorCode == 0) {
				g_latest_post = data.posts;
				var items = '';
				for (var i = 0; i < g_latest_post.length; i++) {
					items += '<li><a href="/post/' + g_latest_post[i]._id + '"title="' + g_latest_post[i].postTitle + '">' + g_latest_post[i].postTitle + '</a></li>';
				}
				$("ul#latest_post").html(items);
			}
		}
	});
	//将最新回复的博客放到右边的列表中
	$.get("/post/latest/reply", function(data, status) {
		if (status == "success") {
			if (data.errorCode == 0) {
				g_latest_reply = data.posts;
				var items = '';
				for (var i = 0; i < g_latest_reply.length; i++) {
					items += '<li><a href="/post/' + g_latest_reply[i]._id + '" title="' + g_latest_reply[i].postTitle + '">' + g_latest_reply[i].postTitle + '</a></li>';
				}
				$("ul#latest_reply").html(items);
			}
		}
	});
	//发表博客
	$("#blog-btn-post").click(function(e) {
		var _this = this;
		$(_this).button("loading");
		//验证
		$("#post-title").parent().parent().removeClass("error");
		$("#post-description").parent().parent().removeClass("error");
		if ($("#post-title").val().replace(/[ ]/g, "").length < 5) {
			$("#new-blog-error").html("文章标题不能小于五个字符");
			$("#post-title").parent().parent().addClass("error");
			$(_this).button("reset");
			setTimeout(function() {
				$("#new-blog-error").html("");
			}, 1500);
			return;
		}
		if ($("#post-description").val().replace(/[ ]/g, "").length < 5) {
			$("#new-blog-error").html("文章描述不能小于五个字符");
			$("#post-description").parent().parent().addClass("error");
			$(_this).button("reset");
			setTimeout(function() {
				$("#new-blog-error").html("");
			}, 1500);
			return;
		}
		if ($("#wmd-input").val().replace(/[ ]/g, "").length < 10) {
			$("#new-blog-error").html("文章内容不能小于十个字符");
			$(_this).button("reset");
			setTimeout(function() {
				$("#new-blog-error").html("");
			}, 1500);
			return;
		}
		var tags = [];
		var selectedTagsEle = $("#editor-tagslist a.label-info");
		for (var i = 0; i < selectedTagsEle.length; i++) {
			for (var j = 0; j < g_tags.length; j++) {
				if ($(selectedTagsEle[i]).attr("tagId") == g_tags[j]._id) {
					tags.push(g_tags[j]);
				}
			}
		}
		var postInfo = {
			type: "blog",
			postTitle: $("#post-title").val(),
			description: $("#post-description").val(),
			content: $("#wmd-input").val(),
			tags: tags
		}
		$.post("/post", {
			postInfo: postInfo
		}, function(data, status) {
			if (status == "success") {
				if (data.errorCode == 0) {
					$("#new-blog-error").parent().parent().removeClass("error").addClass("success");
					$("#new-blog-error").html(data.errorMsg);
					setTimeout(function() {
						window.location.href = "/blogs";
					}, 1000);
				} else {
					$("#new-blog-error").html(data.errorMsg);
					setTimeout(function() {
						$("#new-blog-error").html("");
					}, 1500);
					$(_this).button("reset");
				}
			}
		});
	});
	//发表回复
	$("#new-comment-reply").click(function(e) {
		var _this = this;
		$(_this).button("loading");
		//验证
		if ($("#wmd-input").val().replace(/[ ]/g, "").length < 5) {
			$("#new-comment-error").html("回复内容不能少于五个字符");
			$(_this).button("reset");
			setTimeout(function() {
				$("#new-comment-error").html("");
			}, 1500);
			return;
		}
		//验证通过，发表回复
		var replyInfo = {
			postId: $("#post-id").val(),
			to: $("#reply-to").val(),
			content: $("#wmd-input").val()
		};
		$.post("/reply", {
			replyInfo: replyInfo
		}, function(data, status) {
			if (status == "success") {
				if (data.errorCode == 0) {
					//发表回复成功
					$("#new-comment-reset").trigger("click");
					$(_this).button("reset");
					commentsPagination($("#post-id").val(),true);
				}
			}
		});
	});
	//分页
	//Blog
	$("#blog-pagination li").click(function(event) {
		if ($(this).hasClass("active") || $(this).hasClass("disabled")) {
			return;
		}
		window.location.href = "/blogs/?page=" + $(this).attr("page");
	});
});
//获取随机的label样式

function getRandomLabelStyle() {
	var ranNum = parseInt(Math.random() * (6 - 1 + 1) + 1);
	switch (ranNum) {
		case 1:
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
		default:
			return "label";
	}
}
//获取随机的badge样式

function getrandomBadgeStyle() {
	var ranNum = parseInt(Math.random() * (6 - 1 + 1) + 1);
	switch (ranNum) {
		case 1:
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
		default:
			return "badge";
	}
}
//Blog回复分页

function commentsPagination(postId,needReply) {
	$.get("/replies", {
		page: 1,
		postId : postId
	}, function(data, status) {
		if (status == "success") {
			if (data.errorCode == 0) {
				var repliesData = data.data;
				$('#post-reply-total').html("回复("+repliesData.count+")");
				flashPageInfo(repliesData.replies, needReply);
				$("#comments-page").pagination({
					pages: repliesData.pages,
					onpage: function(page) {
						$.get("/replies", {
							page: page,
							postId : postId
						}, function(data, status) {
							if (status == "success") {
								if (data.errorCode == 0) {
									flashPageInfo(data.data.replies, needReply);
								}
							}
						});
					}
				});
			}
		}
	});
	var flashPageInfo = function(replies, needReply) {
		var aHtml = new Array();
		for (var i = 0; i < replies.length; i++) {
			aHtml.push('<div class="comment">');
			aHtml.push('<table border="0" cellspacing="0" cellpadding="0"');
			aHtml.push('<tr>');
			aHtml.push('<td class="comment-left" valign="top">');
			aHtml.push('<img src="/img/bg.jpg" />');
			aHtml.push('</td>');
			aHtml.push('<td class="comment-right" align="left" valign="top">');
			aHtml.push('<div class="comment-right-top">')
			aHtml.push('<a class="user" href="/user/' + replies[i].author._id + '">' + replies[i].author.userName + '</a>');
			aHtml.push('<span>&nbsp;[' + new Date(replies[i].createTime).format() + '] 回复&nbsp;</span>');
			if (replies[i].to) {
				aHtml.push('<a class="user" href="/user/' + replies[i].to._id + '">' + replies[i].to.userName + '</a>');
			}
			if (needReply) {
				aHtml.push('<a class="comment-right-reply" href="javascript:" to="' + replies[i].author.userName + '">回复TA</a>');
			}
			aHtml.push('</div>')
			aHtml.push('<div class="comment-right-content">' + replies[i].content + '</div>');
			aHtml.push('</td>');
			aHtml.push('</tr>');
			aHtml.push('</table>');
			aHtml.push('</div>');
		}
		var sHtml = aHtml.join("");
		$("#post-reply").html(sHtml);
		//code pretty
		prettyPrint();
	}
}
//时间格式化
Date.prototype.format = function()
{
	var formated = '';
	formated += this.getFullYear();
	formated += '-';
	formated += this.getMonth() + 1 < 10 ? '0' + (this.getMonth() + 1) : this.getMonth() + 1;
	formated += '-';
	formated += this.getDate() < 10 ? '0' + this.getDate() : this.getDate();
	formated += ' ';
	formated += this.getHours() < 10 ? '0' + this.getHours() : this.getHours();
	formated += ':';
	formated += this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes();
	formated += ':';
	formated += this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds();
	return formated;
}