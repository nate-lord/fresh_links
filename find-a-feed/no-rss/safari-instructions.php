<?php
	/**
	* the content of the fourth slide in the tutorial if the user has Safari
	*/

	$style_imgs = get_stylesheet_directory_uri() . '/style-imgs/';
?>
<object type="image/svg+xml" data="<?php echo $style_imgs; ?>safariCompass.svg" id="safariCompass">
	safari compass
</object>
<figcaption>
	<h1>No RSS reader is installed.</h1>
	<p>
		<em>Safari can't open</em><br class="removeableText"/>
		<em>"http://<span class="removeableText">www.</span>somesite.com/feed<span class="removeableText">.xml</span>"<span class="removeableText"> because</span></em><span class="removeableText"><br />
		<em>Safari can't display RSS feeds. You can search the Mac App Store for an RSS app.</em><br /></span>
	</p>
</figcaption>