<?php
/**
* creates the footer for the site
*/
?>
		</div>
		<section class="offScreen" id="popUps">
			<?php get_template_part( 'popUps' ); ?>
		</section>
		<footer id="siteFooter" class="background">
			<figure id="sun"></figure>
			<figure id="clouds-a">
				<div class="cloud-1"></div>
				<div class="cloud-2"></div>
				<div class="cloud-3"></div>
				<div class="cloud-4"></div>
				<div class="cloud-5"></div>
				<div class="cloud-6"></div>
				<div class="cloud-7"></div>
			</figure>
			<figure id="clouds-b">
				<div class="cloud-1"></div>
				<div class="cloud-2"></div>
				<div class="cloud-3"></div>
				<div class="cloud-4"></div>
				<div class="cloud-5"></div>
				<div class="cloud-6"></div>
				<div class="cloud-7"></div>
			</figure>
			<figure id="ground"></figure>
		</footer>
		<div id="screenWidthStandardizer"></div>
<?php 
	wp_footer();
?>
	</body>
</html>