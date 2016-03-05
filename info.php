<?php
	/**
	* creates the FAQ page
	*/

	$info_ids = array('what_is_a_feed' => 740,
										'find_a_feed_steps' => 742,
										'quick_search_for_a_feed' => 734,
										'can_i_use_atom_instead_of_rss' => 729,
										'one_of_my_posts_looks_funk' => 732,
										'why_does_this_exist' => 738,
										'credits_etc' => 736);
	
	$golden_question_url = get_template_directory_uri() . '/style-imgs/goldenQuestion.svg';
?>

<section id="infoSection" class="currentMainSection">
	<header class="sectionHeader">
		<div class="buttonWrap menuButtonWrap">
			<button class="ir menuButton">Toggle menu</button>
		</div>
		<h1>Info</h1>
	</header>
	
<?php
	foreach ($info_ids as $info_id) {
		$info_post = get_post($info_id);

		$content = $info_post->post_content;
		$title = $info_post->post_title;
?>

	<article class="postWrap">
		<header class="expandablePostHeader roundCorners outDent">
				<div class="postThumbWrap">
					<img class="postThumb" style="background-image:url(<?php echo $golden_question_url; ?>)">
				</div>
				<h1 class="postTitle"><a class="expandableButton" href="#"><?php echo $title; ?></a></h1>
		</header>
		
		<div class="expandableContentWrap closed">
			<div class="expandableContent">
				<?php echo $content; ?>
		 	</div>
		</div>
	</article>

<?php
	}
?>
</section>