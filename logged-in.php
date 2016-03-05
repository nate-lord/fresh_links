<?php
/**
* creates the logged-in home page 
*/
?>

<div id="navAndContentWrap">
<?php
	get_template_part( 'nav' );
?>
	<div id="contentWrap">
		<div id="currentMainSectionWrap">
<?php
	// resets if unloaded on the save page
	update_user_meta( get_current_user_id(), 'article_type', 'fresh' );
	update_user_meta( get_current_user_id(), 'batch_number', 1 );
	
	get_template_part( 'articles' );
?>
		</div>
	</div>
	<div class="style"></div>
</div>
