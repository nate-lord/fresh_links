<?php
	/**
	* the first slide in the tutorial
	*/

	$style_imgs = get_stylesheet_directory_uri() . '/style-imgs/';
?>
<div class="browserWrap initSlide slide0" id="googleBrowserWrap">
	<figure class="browser shadowBottomWave" id="googleBrowser">
		<div class="style topRightShadow"></div>
		<div class="style rightSideShadow"></div>
		<section class="header">
			<div class="menuBarWrap">
				<figure class="sizeControl">
				</figure>
				<figure class="tab">
					<span class="ir x"></span>
				</figure>
			</div>
			<div class="addressFieldWrap">
				<p class="url">google.com</p>
			</div>
		</section>
		<section class="body" id="google">
			<figure id="googleWrap">
				<figcaption id="googleMasthead"><span
				class="blue">G</span><span class="red">o</span><span class="yellow">o</span><span class="blue">g</span><span class="green">l</span><span class="red">e</span></figcaption>
				<object type="image/svg+xml" data="<?php echo $style_imgs; ?>arrow.svg" class="arrow">
			  	important
				</object>
				<p id="googleSearch">somesite rss feed</p>
			</figure>
		</section>
		<figcaption class="instruction">
			<p>
				RSS feeds are the way websites signal they published a new article. To use it we need a website's RSS feed web address (aka URL) which we get through a search.
			</p>
		</figcaption>
		<div class="style browserBottom"></div>
	</figure>
</div>