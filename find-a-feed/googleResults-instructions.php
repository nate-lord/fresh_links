<?php
	/**
	* the second slide in the tutorial
	*/

	$style_imgs = get_stylesheet_directory_uri() . '/style-imgs/';
?>
<div class="browserWrap slide1" id="googleResultsBrowserWrap">
	<figure class="browser shadowBottomWave" id="googleResultsBrowser">
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
				<p class="url">google.com/?gws_rd=ssl#q=somesite+rss+feed"</p>
			</div>
		</section>
		<section class="body" id="googleResultsWrap">
			<figure id="googleResults">
				<object type="image/svg+xml" data="<?php echo $style_imgs; ?>arrow.svg" class="arrow">
		  		important
				</object>
				<article>
					<h1><mark>RSS feeds - Somesite</mark></h1>
					<p><em>www.somesite.com/feeds</em></p>
					<p><em>stay up to date with everything<span class="removeableText"> somesite with rss feeds</span></em></p>
				</article>
				<article>
					<h1>Somesite</h1>
					<p><em>www.somesite.com</em></p>
					<p><em>your somesite dot com</em></p>
				</article>
			</figure>
		</section>
		<figcaption class="instruction">
			<p>
				Select the appropriate one.
			</p>
		</figcaption>
		<div class="style browserBottom"></div>
	</figure>
</div>