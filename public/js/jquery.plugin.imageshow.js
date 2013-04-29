$.fn.imageshow = function(options){
	var defaults = {
		isEscKey  : true	
	}
	var opts = $.extend(defaults, options);
	$(this).click(function(event) {
		_this = this;
		var img = $(this).find("img:first");
		var _bg = '<div id="imageshow-bg"></div>';
		$(document.body).append(_bg);
		$("#imageshow-bg").animate({"opacity":"0.5"}, "normal",function(){
			var _container = '<div id="imageshow-container"></div>';
			$(document.body).append(_container);
			$("#imageshow-container").animate({"width":"800px","height":"400px"}, "normal",function(){
				var _container_left = '<div id="imageshow-container-left-top"></div><div id="imageshow-container-left-bottom"></div><div id="imageshow-container-right"></div>';
				$("#imageshow-container").append(_container_left);
				var _image_box = '<div id="imageshow-imagebox"></div>';
				$("#imageshow-container-left-top").append(_image_box);
				var _image_description_box = '<div id="imageshow-description-box"></div>';
				$("#imageshow-container-left-bottom").append(_image_description_box);
				var _image_reply_box = '<div id="imageshow-reply-box"></div>';
				$("#imageshow-container-right").append(_image_reply_box);
				//将图片放入到相应的位置
				var _image = '<img id="image-show" src="' + $(img).attr("src") + '"/>';
				$("#imageshow-imagebox").append(_image);
				$("#image-show").load(function(e){
					var _margin_top = (-$(this).height()/2) + 'px';
					var _margin_left = (-$(this).width()/2) + 'px';
					$(this).css({"margin-top":_margin_top, "margin-left":_margin_left});
				});
				//将描述信息放到相应的位置
				$("#imageshow-description-box").html($(_this).attr("data-desc") || "");
				//添加关闭按钮
				var _close = '<a href="javascript:" id="imageshow-close"></a>'
				$("#imageshow-container").append(_close);
				$("#imageshow-close").click(function (e) {
					$("div#imageshow-bg").remove();
					$("#imageshow-container ").remove();
					$(document).unbind("keydown");
				});

				if(opts.isEscKey)
				{
					$(document).bind("keydown",function(e){
						if(e.keyCode == 27)
						{
							$("#imageshow-close").trigger("click");
						}
					});
				}
			});
		});
	});
};