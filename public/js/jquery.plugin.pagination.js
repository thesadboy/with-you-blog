$.fn.pagination = function(options) {
	$this = this;
	$this.defaults = {
		pages: 1,
		page: 1,
		onpage: function(page) {
			console.log(arguments);
		}
	}
	$this.opts = $.extend($this.defaults, options);
	$this.init = function() {
		var before = 2;
		var after = 2;
		var html = '';
		while ($this.page - before < 1) {
			after--;
			before++;
		}
		while (new Number($this.opts.page) + new Number(after) > $this.opts.pages) {
			after--;
			before++;
		}
		if ($this.opts.page - before < 1) {
			before = $this.opts.page - 1;
		}
		html += '<ul>';
		html += '<li class="' + ($this.opts.page == 1 ? "disabled" : "") + '" page="' + ($this.opts.page - 1 > 0 ? $this.opts.page - 1 : 1) + '"><a href="javascript:">&laquo;</a></li>';
		for (var i = $this.opts.page - before; i <= new Number($this.opts.page) + new Number(after); i++) {
			html += '<li class="' + ($this.opts.page == i ? "active" : "") + '" page="' + i + '"><a href="javascript:">' + i + '</a></li>';
		}
		html += '<li class="' + ($this.opts.page == $this.opts.pages ? "disabled" : "") + '" page="' + ($this.opts.page + 1 < $this.opts.pages ? $this.opts.page + 1 : $this.opts.pages) + '"><a href="javascript:">&raquo;</a></li>';
		html += '</ul>';
		$($this).html(html);
		$($this).find("li").click(function(e) {
			$this.opts.page = $(this).attr("page");
			$this.opts.onpage($this.opts.page);
			$this.init();
		});
	};
	$this.init();
}