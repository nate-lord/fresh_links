<?php
	/**
	* the content of the fourth slide in the tutorial if the user has Opera
	*/

	$style_imgs = get_stylesheet_directory_uri() . '/style-imgs/';
?>
<header>
	<p><em>Learn more about feeds</em></p>
	<h1>
		<object type="image/svg+xml" data="<?php echo $style_imgs; ?>operaRssIcon.svg" class="operaRssIcon">
			rss icon
		</object>
		Some Site
	</h1>
</header>
<p><em>Subscribe to this feed<span>using [------------^] Subscribe</span></em></p>
<article>
	<h1>Some Site</h1>
	<p><em><span>Stay up to date on everything going on at Some Site and </span>somesite.com.</em></p>
</article>