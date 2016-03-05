<?php
	/**
	* the fourth slide in the tutorial
	*/
	
	$browser;
	
	global $is_chrome;
	global $is_safari;
	global $is_opera;
	global $is_gecko;

	if( $is_chrome ) {
		$browser = 'chrome';
	} elseif( $is_safari ) {
		$browser = 'safari';
	} elseif( $is_opera ) {
		$browser = 'opera';
	} elseif( $is_gecko ) {
		$browser = 'firefox';
	} else { // fall back to ie
		$browser = 'ie';
	}
	
	
	$style_imgs = get_stylesheet_directory_uri() . '/style-imgs/';

?>
<div class="browserWrap slide3" id="userAgentBrowserWrap">
	<figure class="browser userAgentBrowser" id="<?php echo $browser . 'Browser'; ?>">
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
				<object type="image/svg+xml" data="<?php echo $style_imgs; ?>arrow.svg" class="arrow">
			  	important
				</object>
				<div class="addressFieldWrap">
					<p class="url">somesite.com/feeds/all.xml</p>
				</div>
			</div>
		</section>
		<section class="body">
			<figure id="<?php echo $browser . 'Body' ?>">
<?php
	get_template_part( 'find-a-feed/no-rss/' . $browser . '-instructions' );
?>
			</figure>
		</section>
		<figcaption class="instruction">
			<p>If you see an error screen <em>that's fine.</em> Copy the URL at the top. Paste it in "Add new feed" in your settings and you're all set.</p>
		</figcaption>
		<div class="style browserBottom"></div>
	</figure>
</div>