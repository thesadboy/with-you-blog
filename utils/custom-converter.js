var md = require('node-markdown').Markdown;

module.exports = function(reStr)
{
	var dstStr = "";
	dstStr = md(reStr);
	dstStr = dstStr.replace(/<pre><code>/g,'<pre class="prettyprint"><code>');
	return dstStr;
}