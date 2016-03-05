<?php
/**
* creates the how to find a feed tutorial
*/

	$style_imgs_dir = get_stylesheet_directory_uri() . '/style-imgs/';
?>
<section id="findAFeed" class="currentMainSection" data-slideIndex="0">
	<button class="ir closeTutorial" id="cancelTutorial">cancel</button>
	<nav id="findAFeedNav">
		<button class="ir" id="previousSlide" data-adjust="-1" type="button">Previous</button>
		<button class="ir" id="nextSlide" data-adjust="1" type="button">Next</button>
		<div id="exitToSiteWrap">
			<div class="closeTutorial ir" id="exitToSite">exit to site</div>
		</div>
	</nav>

<?php
	get_template_part( 'find-a-feed/google-instructions' );
	get_template_part( 'find-a-feed/googleResults-instructions' );
	get_template_part( 'find-a-feed/somesite-instructions' );
	get_template_part( 'find-a-feed/noRss-instructions' );
?>

	<footer class="progress"><var>1</var> of 4</footer>
</section>
