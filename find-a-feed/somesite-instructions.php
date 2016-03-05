<?php
	/**
	* the third slide in the tutorial
	*/

	$style_imgs = get_stylesheet_directory_uri() . '/style-imgs/';
?>
<div class="browserWrap slide2" id="somesiteBrowserWrap">
	<figure class="browser shadowBottomWave" id="somesiteBrowser">
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
				<p class="url">somesite.com/feeds</p>
			</div>
		</section>
		<section class="body" id="somesite">
			<header>
				<h1>
					Somesite Feeds
					<object type="image/svg+xml" data="<?php echo $style_imgs; ?>somesiteRssIcon.svg" id="somesiteRssIcon">
				  	rss icon
					</object>
				</h1>
				<em>home / feeds</em>
			</header>
			<nav>
				<em>home</em>
				<em>sports</em>
				<em>news</em>
				<em>entertainment</em>
			</nav>
			<article class="first">
				<h1><mark>All feeds</mark></h1>
				<object type="image/svg+xml" data="<?php echo $style_imgs; ?>arrow.svg" class="arrow">
			  	important
				</object>
				<p>
					<object type="image/svg+xml" data="<?php echo $style_imgs; ?>rssIcon.svg" class="rssIcon">
				  	rss icon
					</object>
					<span class="removeableText">All </span>stories<span class="removeableText"> from somesite</span>
				</p>
			</article>
			<article class="second">
				<h1>Sports</h1>
				<p>
					<object type="image/svg+xml" data="<?php echo $style_imgs; ?>rssIcon.svg" class="rssIcon">
				  	rss icon
					</object>
					<span class="removeableText">The best </span>sports stories<span class="removeableText"> from somesite</span>
				</p>
			</article>
			<article class="third">
				<h1>World News</h1>
				<p>
					<object type="image/svg+xml" data="<?php echo $style_imgs; ?>rssIcon.svg" class="rssIcon">
				  	rss icon
					</object>
					<span class="removeableText">Somesite </span>world news<span class="removeableText"> reports</span>
				</p>
			</article>
		</section>
		<figcaption class="instruction">
			<p>There may be multiple feeds, select the one you want.</p>
		</figcaption>
		<div class="style browserBottom"></div>
	</figure>
</div>