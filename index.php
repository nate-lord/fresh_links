<?php
	/**
	* the index page
	*/

	$templatePart = (is_user_logged_in() ? 'in' : 'out');
	
	get_header( 'desktop');
	get_template_part( 'logged', $templatePart );
	get_footer();
?>