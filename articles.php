<?php
	/**
	* creates the new and saved feed timeline pages
	*/

	$user_id = get_current_user_id();
	$login = get_userdata($user_id)->user_login;
	
	$style_imgs_dir = get_stylesheet_directory_uri() . '/style-imgs/';
	
	$article_type = get_user_meta($user_id, 'article_type', true);
	$page_heading = ($article_type === 'fresh' ? 'New feeds' : 'Saved Feeds');
	
	$post_count = get_post_count( $article_type );
	$does_user_have_any_posts = ( !$post_count ? false : true );
	
	$parent_cat_id = intval( get_user_meta($user_id, ( $article_type . '_id' ), true ), 10);
	
	if ( $article_type === 'fresh' ) {
		$article_cats = get_categories( array('parent' => $parent_cat_id, 'hide_empty' => 0) );
		$is_user_subscribed_to_feeds = ( count( $article_cats ) ? true : false );
	} else {
		$is_user_subscribed_to_feeds = true;
	}
?>
<section id="articleSection" class="currentMainSection <?php echo $article_type; ?>Articles">
	<header class="sectionHeader">
		
<?php
	$posts_per_page = 10;
	
	$batch_number = intval(get_user_meta($user_id, 'batch_number', true), 10);
	
	$batch_count = intval( ceil( $post_count / $posts_per_page ), 10 );
	
	$batch_wrap_class = $article_type;
	
	if( $article_type === 'fresh' ) {
		$batch_wrap_class = $batch_wrap_class . ( $batch_count < 2 ? ' hidden' : '' );
	} else {
		$article_nav_class = ( $batch_count < 2 ? 'hidden' : '' );
	}
	
	$post_remainder = $post_count % $posts_per_page;
	$post_remainder = ( $post_remainder !== 0 ? $post_remainder : $posts_per_page );

	$max_length_attr = strlen( strval($batch_count) );
	if( $batch_count < 10 ) {
		$num_digits_class = 'oneDigit';
	} else if( $batch_count < 100 ) {
		$num_digits_class = 'twoDigits';
	} else if( $batch_count < 1000 ) {
		$num_digits_class = 'threeDigits';
	} else if( $batch_count < 10000 ) {
		$num_digits_class = 'fourDigits';
	} else {
		$num_digits_class = 'fiveDigits';
	}
?>
		<div class="buttonWrap menuButtonWrap">
			<button class="ir menuButton">Toggle menu</button>
		</div>
		<h1><?php echo $page_heading; ?></h1>
		
<?php
	if( $is_user_subscribed_to_feeds ):
?>
		<nav id="articleNav" class="<?php echo $article_nav_class; ?>">
			<div id="batchWrap" class="<?php echo $batch_wrap_class; ?>">
<?php if($batch_number > 1): ?>
				<div class="buttonWrap sky" id="previousBatchWrap">
					<button class="sky ir" type="button" id="previousBatch">previous</button>
				</div>
<?php endif; ?>
				<span id="jumpToBatchWrap" >
					<span class="skyInputWrap"><input type="text" id="jumpToBatch" maxlength="<?php echo $max_length_attr; ?>" class="<?php echo $num_digits_class; ?>" data-posts_per_batch="<?php echo $batch_count; ?>" data-page_num="<?php echo $batch_number; ?>" value="<?php echo $batch_number; ?>" autocomplete="off" /></span><span id="pageCountWrap"> of <var id="pageCount" class="<?php echo $num_digits_class; ?>" data-post_remainder="<?php echo $post_remainder; ?>"><?php echo $batch_count; ?></var></span>
				</span>
<?php if($batch_number !== $batch_count): ?>
				<div class="buttonWrap sky" id="nextBatchWrap">
					<button class="sky ir" type="button" id="nextBatch">next</button>
				</div>
<?php endif; ?>
			</div>
<?php if($article_type === 'fresh'): ?>
			<div class="buttonWrap sky" id="refreshWrap">
				<button class="sky" type="button" id="refresh">Refresh</button>
			</div>
<?php endif; ?>		
		</nav>
<?php
	endif;
?>
	</header>

<?php
	if( $is_user_subscribed_to_feeds && $does_user_have_any_posts ):

		echo('<div id="timeline">');
		
		if ( $article_type === 'fresh' ) {
			$category__in = get_user_meta( $user_id, ( $article_type . '_category_ids' ), true);
		} else {
			$category__in = get_user_meta( $user_id, 'frozen_id', true );
		}
		
		$args = array(
			'category__in' => $category__in,
			'posts_per_page' => $posts_per_page,
			'meta_key' => 'order',
			'offset' => ( ( $batch_number - 1 ) * $posts_per_page ),
			'order' => 'DESC',
			'orderby' => 'meta_value_num'
		);
		
		$the_query = new WP_Query( $args );

		if ( $the_query->have_posts() ) :
			while ( $the_query->have_posts() ) :
				
				$the_query->the_post();
				
				echo get_this_post( get_the_ID(), $article_type );
				
				wp_reset_postdata();
				
			endwhile;
		endif;
		
		echo('</div>');
	endif; // end of: the user is subscribed to a feed and has posts
	
	if($is_user_subscribed_to_feeds && !$does_user_have_any_posts):
		$no_feeds_class = ($article_type === 'fresh' ? 'showNoPostsMessage' : 'showNoSavedPostsMessage');
?>
		<article id="noFeedsWrap" class="<?php echo $no_feeds_class; ?>">
			<?php get_template_part( 'noPosts' ); ?>
		</article>
<?php
	endif; // end of: the user is subscribed to a feed and DOESN'T has posts
	
	if(!$is_user_subscribed_to_feeds):
		$no_feeds_class = ($article_type === 'fresh' ? 'showNoFeedsMessage' : 'showNoSavedPostsMessage');
?>
	<article id="noFeedsWrap" class="<?php echo $no_feeds_class; ?>">
		<?php get_template_part( 'noPosts' ); ?>
	</article>
<?php
	endif; // end of: the user is NOT subscribed to a feed
?>
</section>