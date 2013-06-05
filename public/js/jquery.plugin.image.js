$.fn.imageBox = function(options){
	var defaults = {
		isEscKey: true,
		onShow : function(clickImg,titleBox,commentBox){
			console.log(clickImg);
			console.log(titleBox);
			console.log(commentBox);
		},
		onPrev : function(clickImg,titleBox,commentBox){
			console.log(clickImg);
			console.log(titleBox);
			console.log(commentBox);
		},
		onNext : function(clickImg,titleBox,commentBox){
			console.log(clickImg);
			console.log(titleBox);
			console.log(commentBox);
		}
	};
	var $_opts = $.extend(defaults,options)
	$(this).click(function (e) {
		var _scroll_top = $(window).scrollTop();
		var $_this = $(this).attr('src') ? $(this) : $(this).find('img:first');
		var _image_box_backdrop = $('<div class="image-box-backdrop"></div>');
		var _image_box_container = $('<div class="image-box-container"></div>');
		var _image_box_content = $('<div class="image-box-content"></div>');
		var _image_box_inner_content = $('<div class="image-box-inner-content">');
		var _image_box_close = $('<div class="image-box-close">×</div>');
		var _image_box_inner_content_left = $('<div class="image-box-inner-content-left"></div>');
		var _image_box_options = $('<div class="image-options"></div>');
		var _image_box_btn_prev = $('<div class="image-page image-box-prev" title="上一张"><i></i></div>');
		var _image_box_btn_next = $('<div class="image-page image-box-next" title="下一张"><i></i></div>');
		var _image_box_title_bar = $('<div class="image-title-bar"></div>');
		var _image_box_title_bar_inner = $('<div class="image-title-bar-inner"></div>');
		var _image_box_image = $('<img src="'+$_this.attr("src")+'" />');
		var _image_box_inner_content_right = $('<div class="image-box-inner-content-right"></div>');
		var _image_box_inner_content_right_comment = $('<div class="image-box-inner-content-right-comment"></div>');
		_image_box_title_bar.append(_image_box_title_bar_inner);
		_image_box_options.append(_image_box_btn_prev);
		_image_box_options.append(_image_box_btn_next);
		_image_box_options.append(_image_box_title_bar);
		_image_box_inner_content_left.append(_image_box_options);
		_image_box_inner_content_left.append(_image_box_image);
		_image_box_inner_content_right.append(_image_box_inner_content_right_comment);
		_image_box_inner_content.append(_image_box_close);
		_image_box_inner_content.append(_image_box_inner_content_left);
		_image_box_inner_content.append(_image_box_inner_content_right);
		_image_box_content.append(_image_box_inner_content);
		_image_box_container.append(_image_box_content);
		var resetImageSize = function()
		{
			var _image_box_inner_content_left_height = _image_box_inner_content_left.height();
			var _image_box_image_height = _image_box_image.height();
			var _image_box_image_margin_top = (_image_box_inner_content_left_height - _image_box_image_height)/2 + 'px';
			_image_box_image.css('margin-top',_image_box_image_margin_top);
			_image_box_backdrop.remove();
			$(document.body).append(_image_box_backdrop);
		};
		var close = function(){
			_image_box_container.remove();
			$('.image-box-body-root-container').removeClass('image-box-body-root-container-fixed').removeAttr('style');
			$(window).scrollTop(_scroll_top);
			_image_box_backdrop.fadeOut(function(){
				_image_box_backdrop.remove();
			});
		};
		$('div.image-box-body-root-container').css('top', -_scroll_top +'px').addClass('image-box-body-root-container-fixed');
		$(document.body).append(_image_box_backdrop);
		_image_box_backdrop.fadeIn('fast',function(){
			$(document.body).append(_image_box_container);
			resetImageSize();
			$(window).resize(function(){
				resetImageSize();
			});
			//各种事件监听
			_image_box_inner_content_left.mouseover(function(event) {
				_image_box_options.show();
			}).mouseleave(function(event) {
				_image_box_options.hide();
			});
			_image_box_close.click(function (e) {
				close();
			});
			_image_box_btn_prev.click(function (e) {
				$_opts.onPrev($_this,_image_box_title_bar_inner,_image_box_inner_content_right_comment);
			});
			_image_box_btn_next.click(function (e) {
				$_opts.onNext($_this,_image_box_title_bar_inner,_image_box_inner_content_right_comment);
			});
			if($_opts.isEscKey)
			{
				$(document).bind("keydown", function(e) {
					if (e.keyCode == 27) {
						close();
					}
				});
			}
			$_opts.onShow($_this,_image_box_title_bar_inner,_image_box_inner_content_right_comment);
		});
	});
}