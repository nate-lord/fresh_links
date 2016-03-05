<?php
	/**
	* creates all the pop ups from posts
	*/

	$pop_up_ids = array('cancel_feed' => 711,
											'delete_account' => 713,
											'delete_post' => 715,
											'js_is_disabled' => 727,
											'login' => 722,
											'rss_search' => 709,
											'sign_up' => 705,
											'your_browser_is_old' => 725,
											'tour_mode' => 3787);
	
	foreach ($pop_up_ids as $pop_up_id) {
		$pop_up = get_post($pop_up_id);
		
		$content = $pop_up->post_content;
		$title = $pop_up->post_title;
		$id_field_key = 'field_54bd97e9aba4a';
		$id = get_field($id_field_key, $pop_up_id);
?>
	<div id="<?php echo $id; ?>" class="popUpWrap">
		<article class="popUpBox">
			<h1><?php echo $title; ?></h1>
			<?php echo $content; ?>
		</article>
	</div>
<?php
	} // end of foreach loop
?>