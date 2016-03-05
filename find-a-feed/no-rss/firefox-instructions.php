<?php
	/**
	* the content of the fourth slide in the tutorial if the user has Firefox
	*/

	$style_imgs = get_stylesheet_directory_uri() . '/style-imgs/';
?>
<div>
	<object type="image/svg+xml" data="<?php echo $style_imgs; ?>firefoxRssIcon.svg" class="firefoxRssIcon">
		rss icon
	</object>
	<div>
		<p><span class="line1">This is a "feed" of<span class="block1"> frequently changing</span> content<span class="block2"> on this site</span>.</span><br/>
<span class="line2"><span class="block2">You can </span><span class="cap">s</span>ubscribe<span class="block3"> to this feed</span> to recieve updates<span class="block1"> when this content changes</span>.</span></p>
		<p class="line3">Subscribe<span class="block1"> to this feed</span> using [------------^]</p>
		<p class="line4"><span class="block1">[-] Always </span><span class="cap">u</span>se [------------] to subscribe<span class="block1"> to feeds</span>.</p>
	</div>
</div>
<article>
	<h1>Some site</h1>
	<p class="line5">Stay up to date on<span class="block1"> everything going on at Some Site and</span> somesite.com.</p>
</article>