<?php
// 24 functions

date_default_timezone_set( 'America/New_York' );
require_once 'Readability.php';

add_filter( 'show_admin_bar', '__return_false' ); // hides admin bar
remove_filter( 'the_content', 'wpautop' ); // strips <p> tags and <br/> when echoing the content.

function remove_old_posts() {
	/**
	* deletes posts if too old on login 
	*/
	
	if ( !is_user_logged_in() ) {
		return;
	}
	
	$user_id = get_current_user_id();
	
	$fresh_id = intVal( get_user_meta( $user_id, 'fresh_id', true ), 10 );
	
	$fresh_cat_obs = get_categories( array( 'parent' => $fresh_id, 'hide_empty' => 0 ) );
	
	$posts = array();
	
	$i = 0;
	
	$l = count( $fresh_cat_obs );
	
	for ( $i; $i < $l; $i = $i + 1 ) {
		$cat_id = $fresh_cat_obs[ $i ]->cat_ID;
		$cat_posts = get_posts( array( 'posts_per_page' => -1, 'category' => $cat_id ) );
		$posts = array_merge( $cat_posts, $posts );
	}
	
	$i = 0;
	
	$l = count( $posts );
	
	for ( $i; $i < $l; $i = $i + 1 ) {
		$post_id = $posts[ $i ]->ID;
		
		$freshnessSpanKey = 'field_54adc9e633f02';
		
		$freshnessSpan = intval( get_field( $freshnessSpanKey, $post_id ), 10 );
		
		if ( $freshnessSpan !== 0 ) {
			$appearance_date_key = 'field_54f8d7b7da760';
			$appearance_date = intval( get_field( $appearance_date_key, $post_id ), 10);
			
			$expirationDate = $appearance_date + $freshnessSpan;
			$now = time();
			
			if ( $now > $expirationDate ) {
				wp_delete_post( $post_id, true );
			}
		}
	}
}
remove_old_posts();

function limit_tour_login() {
	/**
	* logs user in or out to tour mode depending on query string of URL 
	*/
	
	$query_string = $_SERVER[ 'QUERY_STRING' ];
	$tour_user = get_user_by( 'login', 'tour' );
	$tour_id = $tour_user->ID;
	$tour = array(
		'action' => 'none',
		'arg' => 'none'
	);
	
	if ( is_user_logged_in() ) {
		$current_user_id = get_current_user_id();
		
		if ( $query_string !== 'tour' && ( $tour_id === $current_user_id ) ) {
			// log out and redirect to splash
			$tour[ 'action' ] = 'refresh';
			$tour[ 'arg' ] = wp_logout_url( home_url() );
			
		} elseif ( $query_string === 'tour' && ( $tour_id !== $current_user_id ) ) {
			// log current user out, log back in as tour
			wp_logout();
			
			wp_set_current_user( $tour_id, 'tour' );
			wp_set_auth_cookie( $tour_id );
			
			$creds = array(
				'user_login' => 'tour',
				'user_password' => 'password',
				'remember' => false
			);
			//o_action( 'wp_signon', $creds, false );
			wp_signon( $creds, false );
			
			$tour[ 'action' ] = 'refresh';
			$tour[ 'arg' ] = home_url() . '?tour';
		} elseif ( $query_string === 'tour' && ( $tour_id === $current_user_id ) ) {
			$tour[ 'arg' ] = 'isTour';
		}
	} else if ( $query_string === 'tour' ) {
		// log in as tour
		
		wp_set_current_user( $tour_id, 'tour' );
		wp_set_auth_cookie( $tour_id );
		
		$creds = array(
			'user_login' => 'tour',
			'user_password' => 'password',
			'remember' => false
		);
		
		wp_signon( $creds, false );
		
		$tour[ 'arg' ] = 'isTour';
	}
	$js_dir = get_template_directory_uri() . '/scripts/';
	
	wp_enqueue_script( 'tour_script', $js_dir . 'tour.js' );
	wp_localize_script(	'tour_script', 'Tour', $tour );
}
add_action( 'after_setup_theme', 'limit_tour_login' );

function add_or_remove_ignored_urls( $catId, $newUrls, $on_cat_creation = false ) {
	/**
	* update a category's list of ignored URLs (URLs that have already been present on timeline) 
	*
	* @param {int} - $catId : the category id to check URLs against
	* @param {array} - $newUrls : list of URL strings
	* @param {bool} - $on_cat_creation : (optional) checks if URLs are being added on a category's creation
	*
	* @return {array} - $newUrls : the URLs that are to be grabbed from external sites
	*/

	if ( $on_cat_creation ) {
		update_terms_meta( $catId, 'ignore', implode( ' ', $newUrls ) );
		
		return( get_terms_meta( $catId, 'ignore', true ) );
	}
	
	// refresh of all or one
	$oldUrls = get_terms_meta( $catId, 'ignore', true );
	$oldUrls = explode( ' ', $oldUrls );
	$newUrls = array_diff( $newUrls, $oldUrls );
	
	update_terms_meta( $catId, 'ignore', implode( ' ', $newUrls ) );
	
	return( $newUrls ); // these are the urls to be added from the refresh of this cat
}

function add_scripts() {
	/**
	* adds JS scripts to <head> and before the closing of the <body>
	*/
	
	// sets the initial vars from wp sent into script tag
	if ( is_user_logged_in() ) {
		$user_ob = wp_get_current_user();
		$user_id = $user_ob->ID;
		$user_name = $user_ob->user_login;
		
		$config = array(
			'ajaxUrl'	 => admin_url( 'admin-ajax.php' ),
			'userId'	 => $user_id,
			'userName' => $user_name
		);
		
		$settings = array(
			'doesWarnFreshCategoryDrop'	 => ( ( boolean ) get_user_meta( $user_id, 'does_warn_fresh_category_drop', true ) ),
			'doesWarnPostDrop'					 => ( ( boolean ) get_user_meta( $user_id, 'does_warn_post_drop', true ) ),
			'freshnessLimit'						 => intVal( get_user_meta( $user_id, 'freshness_limit', true ), 10 ),
			'isBackgroundAnimating'			 => ( ( boolean ) get_user_meta( $user_id, 'is_background_animating', true ) )
		);
			
		$master_id = intVal( get_user_meta( $user_id, 'master_id', true ), 10 );
		
		$master = array(
			'id'	 => $master_id,
			'name' => get_cat_name( $master_id )
		);
		
		$fresh_id = intVal( get_user_meta( $user_id, 'fresh_id', true ), 10 );
		
		$fresh_cats = get_categories( array( 'parent' => $fresh_id, 'hide_empty' => 0 ) );	
		
		$fresh = array(
			'id'	 => $fresh_id,
			'name' => get_cat_name( $fresh_id ),
			'cats' => ( count( $fresh_cats ) ? get_cat_info_from_raw_object( $fresh_cats ) : '' )
		);
		
		$frozen_id = intVal( get_user_meta( $user_id, 'frozen_id', true ), 10 );

		$frozen = array(
			'id'	 => $frozen_id,
			'name' => get_cat_name( $frozen_id )
		);
		
		$wpVars = array(
			'config'	 => $config,
			'settings' => $settings,
			'master'	 => $master,
			'fresh'		 => $fresh,
			'frozen'	 => $frozen
		);
	} else {
		$config = array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ) );
		$wpVars = array( 'config' => $config );
	}
	
	$js_dir = get_template_directory_uri() . '/scripts/';

	wp_enqueue_script( 'modernizr', $js_dir . 'modernizr.js', false, '2.7.1', false );
	
	wp_enqueue_script( 'prefixfree', $js_dir . 'prefixfree.js', false, '1', false );
	
	wp_enqueue_script( 'googleJsApi', 'https://www.google.com/jsapi', false, '1.0', false );

	wp_deregister_script( 'jquery' );
	
	wp_enqueue_script( 'jquery', $js_dir . 'jquery.js', false, false, true );

	wp_enqueue_script( 'plugins', $js_dir . 'plugins.js', array( 'jquery' ), '1.0.0', true );

	wp_register_script( 'ajax_admin_path' );

	wp_enqueue_script( 'my_script', $js_dir . 'script.js', array( 'jquery', 'modernizr', 'plugins' ), '1.0.0', true );

	wp_localize_script(	'my_script', 'Wp', $wpVars );
}
add_action( 'wp_enqueue_scripts', 'add_scripts' );

function delete_account() {
	/**
	* destroys a users account
	*
	* @return {object} - $result : notification of success or failure returned to JS for processing
	*/
	
	$result = array();
	$user_id = get_current_user_id();
	$user_name = get_userdata( $user_id )->user_login;
	$user_role = get_userdata( $user_id )->roles;
	$tour_user = get_user_by( 'login', 'tour' );
	$tour_id = $tour_user->ID;
	
	if( ( $user_id === 0 ) ||
			( $user_id === 1 ) ||
			( $user_id === $tour_id ) ||
			( $user_name === 'admin' ) ||
			( $user_role === 'administrator' ) )
	{
		
		$result = array(
			'message' => ( 'cannot delete ' . $user_name ),
			'isAccountDeleted' => false
		);
		
		echo( json_encode( $result ) );
		
		$user_id = null;
		
		die();
		
		return;
	}
	
	$fresh_id = get_user_meta( $user_id, 'fresh_id', true );
	$fresh_ids = get_user_meta( $user_id, 'fresh_category_ids', true );
	$frozen_id = get_user_meta( $user_id, 'frozen_id', true );
	$master_id = get_user_meta( $user_id, 'master_id', true );
	
	$cat_ids = array_merge ($fresh_ids, array( $fresh_id, $frozen_id, $master_id ) );
	
	$c = count( $cat_ids );
	$i = 0;
	
	for ( $i; $i < $c; $i = $i + 1 ) {
		wp_delete_category( $cat_ids[ $i ] );
	}
	
	$was_successful = wp_delete_user( $user_id );
	
	if ( $was_successful ) {
		$result = array(
			'message' => ( 'deleted ' . $user_name ),
			'isAccountDeleted' => true
		);
		
		echo( json_encode( $result ) );
	}
	
	die();
}
add_action( 'wp_ajax_nopriv_delete_account', 'delete_account' );
add_action( 'wp_ajax_delete_account', 'delete_account' );

function delete_category() {
	/**
	* deletes a single category
	*
	* @return {object} - $response : notification of success or failure returned to JS for processing
	*/
	
	$display_name = $_POST[ 'displayName' ];
	
	$user_id = get_current_user_id();
	
	$login = get_userdata( $user_id )->user_login;
	
	$display_name = explode( ' ', $display_name );
	$display_name = implode( '_', $display_name );
	
	
	$fresh_id = get_cat_ID( $login . '_' . $display_name . '_fresh' );
	$frozen_id = get_cat_ID( $login . '_' . $display_name . '_frozen' );

	$fresh_posts = get_posts( array( 'category' => $fresh_id, 'posts_per_page' => -1 ) );
	$frozen_posts = get_posts( array( 'category' => $frozen_id, 'posts_per_page' => -1 ) );
	
	$response = array(
		'didDeleteFresh'	=> false,
		'didDeleteFrozen' => false,
		'freshCatId'			=> $fresh_id,
		'frozenCatId'			=> $frozen_id
	);
	
	foreach ( $fresh_posts as $fresh_post ) {
		wp_delete_post( $fresh_post->ID );
	}
	
	$response[ 'didDeleteFresh' ] = wp_delete_category( $fresh_id );
	$fresh_ids = get_user_meta( $user_id, 'fresh_category_ids', true );
	$key = array_search( $fresh_id, $fresh_ids );
	
	unset( $fresh_ids[ $key ] );
	
	$fresh_ids = array_values( $fresh_ids );
	
	update_user_meta( $user_id, 'fresh_category_ids', $fresh_ids );

	echo json_encode( $response );
	
	die();
}
add_action( 'wp_ajax_nopriv_delete_category', 'delete_category' );
add_action( 'wp_ajax_delete_category', 'delete_category' );

function delete_this_post() {
	/**
	* deletes a post
	*/
	
	wp_delete_post( $_POST[ 'postId' ] );
	
	die();
}
add_action( 'wp_ajax_nopriv_delete_this_post', 'delete_this_post' );
add_action( 'wp_ajax_delete_this_post', 'delete_this_post' );

function get_cat_info_from_raw_object( $cat_ob ) {
	/**
	* description
	*
	* @param {object} - $cat_ob : processes an object from the google feed API
	*
	* @return {object} - $editted_arr : a cleaner object
	*/
	
	$c = count( $cat_ob );
	$editted_arr = array();
	$i = 0;
	
	if ( !$c ) {
		$editted_arr = false;
		return $editted_arr;
	}
	
	for ( $i; $i < $c; $i = $i + 1 ) {
		$id = $cat_ob[ $i ]->cat_ID;
		
		// the array value is a workaround.
		// looks like wp-category meta returns everything as array values.
		$editted_arr[ 'cat' . $id ] = array(
			'display_name' => get_terms_meta( $id, 'display_name' )[ 0 ],
			'display_url'	 => get_terms_meta( $id, 'display_url' )[ 0 ],
			'id'					 => $id,
			'ignore'			 => get_terms_meta( $id, 'ignore')[ 0 ],
			'rss_url'			 => get_terms_meta( $id, 'rss_url')[ 0 ]
		);
	}
	
	return $editted_arr;
}

function get_post_count( $cat_selection ) {
	/**
	* get the number of posts in a cat
	*
	* @param {type} - $cat_selection : 'fresh' || 'frozen'
	*
	* @return {int} - $post_count : the number of posts in the cat
	*/
	
	if ( $cat_selection === 'frozen' ) {
		$frozen_id = get_user_meta( get_current_user_id(), 'frozen_id', true );
		$post_count = get_category( $frozen_id )->category_count;
		
		return $post_count;
	}
	
	$post_count = 0;
	$cat_ids = get_user_meta( get_current_user_id(), 'fresh_category_ids', true );
	
	$get_posts_args = array(
		'posts_per_page' => -1,
		'category'			 => ''
	);
	
	foreach ( $cat_ids as $cat_id ) {
		$get_posts_args[ 'category' ] = $cat_id;
		$post_count = $post_count + count(get_posts($get_posts_args));
	}
	
	return $post_count;
	
}

function get_id_by_slug( $page_slug ) {
	/**
	* gets the id from a wp cat slug
	*
	* @param {string} - $page_slug : the slug
	*
	* @return {int || null} : the id || failure
	*/
	
	$page = get_page_by_path( $page_slug );
	
	if ( $page ) {
		return $page->ID;
	} else {
		return null;
	}
}

function get_this_post( $id, $type = 'fresh' ) {
	
	/**
	* get a single post object 
	*
	* @param {int} - $id : the post's id
	*
	* @return {html string} - $post : a processed, marked up article
	*/
	
	$post = '';
	
	$the_post = get_post( $id );
	
	$punc = array( '.', ',', '?', '!', ':', ';', '-', ')', "'", '"' );
	
	$non_breaking_spaces = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	
	$has_content_key = 'field_54ae9c3b5782c';
	
	if ( get_field( $has_content_key, $id ) ) {
		$has_content = true;
	} else {
		$has_content = false;
	}
	
	if ( $type === 'fresh' ) {
		$fresh_cat_id_key = 'field_54c9380ad869c';
		$fresh_cat_id = get_field( $fresh_cat_id_key, $id );
		$feed_title = get_terms_meta( $fresh_cat_id, 'display_name' )[ 0 ];
	} else {
		$post_category_name_if_frozen_key = 'field_55c4eaf2957ec';
		$feed_title = get_field( $post_category_name_if_frozen_key, $id );
	}
	
	$first_letter = strtoupper( $feed_title[ 0 ] );
	$first_space_pos = strpos( trim( $feed_title ), ' ' );
	
	if ( $first_space_pos && ( ( $first_letter === 'T') || ( $first_letter === 'A' ) ) ) {
		$first_word = strtoupper( substr( $feed_title, 0, $first_space_pos ) );
		
		if ( $first_word === 'THE' || $first_word === 'A' ) {
			$first_letter = strtoupper( $feed_title[ $first_space_pos + 1 ] );
		}
	}
	
	
	$thumb = '<figure class="postThumb"><p>' . $first_letter . '</p></figure>';
	
	if ( $has_content || $type === 'frozen' ) {
		$post_thumb_wrap_class = ' postThumbWrap viewedTextThumb';
	} else {
		$post_thumb_wrap_class = 'postThumbWrap  unviewedTextThumb';
	}
		
	// main image
	
	$main_image_object = wp_get_attachment_image_src( $image_id, 'large' );
	$main_image_object = ( !$main_image_object ? wp_get_attachment_image_src( $image_id, 'full' ) : $main_image_object );
	$post_header_class = 'postHeader waveBottom' . ( $main_image_object ? '' : ' noMainImage' );
	
	// time

	$fifteen_mins = 60 * 15;
	
	$now = time();
	$year = date( 'Y', $now );
	$month = date( 'F', $now );
	$week = intval( date( 'W', $now ) );
	$today = date( 'l', $now );
	$day_of_year = intval( date( 'z', $now ) );
	$day_num_in_week = intval( date( 'w', $now ) );
	$hour = date( 'g', $now );
	$minute;
	$am_pm = date( 'a', $now );
	
	$published_key = 'field_54ad91e5ddf4d';
	$published = intval( get_field( $published_key, $id ), 10 );
	
	$published_year = date( 'Y', $published );
	$published_month = date( 'F', $published );
	$published_week = intval( date( 'W', $published ) );
	$published_day_of_year = intval( date( 'z', $published ) );
	$published_num_in_month = date( 'j', $published ) . '<sup>' . date( 'S', $published ) . '</sup>';
	$published_day = date( 'l', $published );
	$published_num_of_week = intval( date( 'w', $published ) );
	$published_hour = date( 'g', $published );
	$published_am_pm = date( 'a', $published );
	
	if ( $year === $published_year &&
			 $month === $published_month && 
			 $week === $published_week &&
			 $today === $published_day &&
			 $hour === $published_hour &&
			 $am_pm === $published_am_pm )
	{
		$published_text = 'published just now.';
	}
	
	if ( $year === $published_year &&
			 $month === $published_month && 
			 $week === $published_week &&
			 $today === $published_day &&
			 $hour !== $published_hour )
	{
		$published_text = 'published today at ' . $published_hour . ' ' . $published_am_pm . '.';
	}
	
	if ( $year === $published_year &&
			 $month === $published_month && 
			 $week === $published_week &&
			 $today !== $published_day )
	{
		$published_text = 'published on ' . $published_day . ' at ' . $published_hour . ' ' . $published_am_pm . '.';
	}
	
	if ( $year === $published_year &&
			 $month === $published_month && 
			 $week === $published_week &&
			 $today !== $published_day &&
			 ( ( $published_num_of_week === $day_num_in_week - 1 ) ||
				 ( $published_num_of_week === 6 && $day_num_in_week === 0 ) ) )
	{
		$published_text = 'published yesterday at ' . $published_hour . ' ' . $published_am_pm . '.';
	}
	
	if ( $year === $published_year &&
			 $month === $published_month && 
			 $week !== $published_week &&
			 ( $published_week === $week - 1 ) )
	{
		$published_text = 'published on ' . $published_day . ' at ' . $published_hour . ' ' . $published_am_pm . '.';
	}
	
	if ( $year === $published_year &&
			 $month === $published_month && 
			 $week !== $published_week &&
			 ( $published_week !== $week - 1 ) )
	{
		$published_text = 'published on ' . $published_day . ' the ' . $published_num_in_month . '.';
	}
	
	if ( $year === $published_year &&
			 $month !== $published_month )
	{
		$published_text = 'published on the ' . $published_num_in_month . ' of ' .  $published_month . '.';
	}
	
	if ( $year !== $published_year ) {
		$published_text = 'published on the ' . $published_num_in_month . ' of ' .  $published_month . ', ' . $published_year . '.';
	}
	
	// the trashed date
	
	$trashed_key = 'field_54adc9e633f02';
	$trashed = intval( get_field( $trashed_key, $id ), 10);
	
	$appearance_date_key = 'field_54f8d7b7da760';
	$appearance_date = intval( get_field( $appearance_date_key, $id ), 10);
	
	if ( $trashed !== 0 ) {
		$trashed_day = date('l', $trashed + $appearance_date);
		$trashed_num_in_week = intval(date('w', $trashed + $appearance_date));
		$trashed_hour = date('g', $trashed + $appearance_date);
		$trashed_minute = date('i', $trashed + $appearance_date);
		$trashed_am_pm = date('a', $trashed + $appearance_date);
	}
	
	if ( $trashed !== 0 &&
			 $today === $trashed_day &&
			 $am_pm === $trashed_am_pm && 
			 $hour === $trashed_hour )
	{
		$minute = intval( date( 'i', $now ) );
		$trashed_minute = intval( $trashed_minute );
		$trashed_minute = ( $trashed_minute === 0 ? 60 : $trashed_minute );
		$minutes_until_trashed = $trashed_minute - $minute;
	}
	
	if ( $trashed !== 0 &&
			 $today === $trashed_day &&
			 $am_pm === $trashed_am_pm && 
			 $hour === $trashed_hour &&
			 $minutes_until_trashed < 1 )
	{
		$trashed_text = 'this article will be trashed if you refresh the page.';
	}
	
	if ( $trashed !== 0 &&
			 $today === $trashed_day &&
			 $am_pm === $trashed_am_pm && 
			 $hour === $trashed_hour &&
			 $minutes_until_trashed >= 1 )
	{
		$trashed_text = 'this article will be trashed in ' . $minutes_until_trashed . ' minutes.';
	}
	
	if ( $trashed !== 0 &&
			 $today === $trashed_day &&
			 ( $am_pm !== $trashed_am_pm || 
			 	 $hour !== $trashed_hour ) )
	{
		$trashed_text = 'this article will be trashed in ' . $minutes_until_trashed . ' minutes.';
	}
	
	if ( $trashed !== 0 &&
			 $today !== $trashed_day )
	{
		$trashed_text = 'this article will be trashed on ' . $trashed_day . ' at ' . $trashed_hour . ' ' . $trashed_am_pm . '.';
	}
	
	if ( $trashed !== 0 &&
			 $today !== $trashed_day &&
			 ( ( $trashed_num_in_week === $day_num_in_week + 1 ) || 
			 	 	 ( $trashed_num_in_week === 0 &&
						 $day_num_in_week === 6 )
			 ) 
		 )
	{
		$trashed_text = 'this article will be trashed tomorrow at ' . $trashed_hour . ' ' . $trashed_am_pm . '.';
	}
	
	if ( $trashed === 0 ) {
		$trashed_text = '';
	}

	$date_text = ( $type === 'fresh' ? $published_text . '<br/>' . $trashed_text : $published_text );
	
	// title
	
	$shortened_post_title = '';
	
	$post_title = get_the_title( $id );
	
	if( strlen( utf8_decode( $post_title ) ) + strlen( utf8_decode( $feed_title ) ) > 85 ) {
		$shortened_post_title = substr( trim( $post_title ), 0, 85 );
		$last_space = strrpos( $shortened_post_title, ' ' );
		
		if ( $last_space ) {
			$shortened_post_title = substr( $shortened_post_title, 0, $last_space );
			$shortened_length = strlen( utf8_decode( $shortened_post_title ) );
			$last_char = $shortened_post_title[ $shortened_length - 1 ];
			
			$i = 0;
			$c = count( $punc );
			for( $i ; $i < $c; $i = $i + 1 ) {
				if( $last_char === $punc[ $i ] ) {
					$shortened_post_title = substr( $shortened_post_title, 0, ( $shortened_length - 1 ) );
					
					break;
				}
			}
		}
	}
	
	if ( $shortened_post_title ) {
		$post_title_text = $shortened_post_title . '...';
		$title_title_attr = $feed_title . '/' . $post_title;
	} else {
		$post_title_text = $post_title;
		$title_title_attr = '';
	}
	
	$mobile_excerpt = '';
	$shortened_excerpt = '';
	
	$excerpt = $the_post->post_excerpt;
	
	if ( strlen( utf8_decode( $excerpt ) ) > 200 ) {
		$shortened_excerpt = substr( trim( $excerpt ), 0, 200 );
		$last_space = strrpos( $shortened_excerpt, ' ' );
		
		if ( $last_space ) {
			$shortened_excerpt = substr( $shortened_excerpt, 0, $last_space );
			$shortened_length = strlen( utf8_decode( $shortened_excerpt ) );
			$last_char = $shortened_excerpt[ $shortened_excerpt - 1 ];
			
			$i = 0;
			$c = count( $punc );
			for ( $i; $i < $c; $i = $i + 1 ) {
				if ( $last_char === $punc[ $i ] ) {
					$shortened_excerpt = substr( $shortened_excerpt, 0, ( $shortened_length - 1 ) );
					
					break;
				}
			}
		}
	}
	
	// mobile excerpt
	if( strlen( utf8_decode( $excerpt ) ) > 100 ) {
		$mobile_excerpt = substr( trim( $excerpt ), 0, 100);
		$last_space = strrpos( $mobile_excerpt, ' ' );
		
		if ( $last_space ) {
			$mobile_excerpt = substr( $mobile_excerpt, 0, $last_space );
			$shortened_length = strlen( utf8_decode( $mobile_excerpt ) );
			$last_char = $mobile_excerpt[ $mobile_excerpt - 1 ];
			
			$i = 0;
			$c = count($punc);
			for ( $i; $i < $c; $i = $i + 1 ) {
				if ( $last_char === $punc[ $i ] ) {
					$mobile_excerpt = substr( $mobile_excerpt, 0, ( $shortened_length - 1 ) );
					
					break;
				}
			}
		}
	}
	
	$shortened_excerpt = ( $shortened_excerpt ? $shortened_excerpt . '...' . $non_breaking_spaces : false );
	$mobile_excerpt = ( $mobile_excerpt ? $mobile_excerpt . '...' . $non_breaking_spaces : false );
	
	if ( $excerpt ) {
		$excerpt = $excerpt . $non_breaking_spaces;
		$post_header_text_class = 'postHeaderText';
	} else {
		$post_title = $post_title . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		$post_header_text_class = 'postHeaderText noExcerpt';
	}
	
	// author
	$author_key = 'field_54ad919bddf4c';
	$author = get_field( $author_key, $id );
	
	// link
	$link_key = 'field_54ad91ffddf4e';
	$link = get_field( $link_key, $id );
	
	// order
	$order_key = 'field_54b03ed94ede3';
	$order = get_field( $order_key, $id );
	
	$the_excerpt = '';
	
	if ( $excerpt ) {
		if ( $excerpt && $mobile_excerpt && $shortened_excerpt ) {
			
$the_excerpt = <<<EOD
	<div class="excerpt">
		<p class="mobileExcerpt">
			$mobile_excerpt
		</p>
		<p class="shortenedExcerpt">
			$shortened_excerpt
		</p>
	</div>
EOD;

		} else if ( $excerpt && $mobile_excerpt && !$shortened_excerpt ) {
			
$the_excerpt = <<<EOD
	<div class="excerpt">
		<p class="mobileExcerpt">
			$mobile_excerpt
		</p>
		<p class="fullExcerpt" data-does_switch="true">
			$excerpt
		</p>
	</div>
EOD;

		} else {
$the_excerpt = <<<EOD
	<div class="excerpt">
		<p class="fullExcerpt">
			$excerpt
		</p>
	</div>
EOD;
		}
	}
	
$main_header = <<<EOD
	<header class="expandablePostHeader roundCorners outDent">
		<div class="$post_thumb_wrap_class">
			$thumb
		</div>
		<div class="$post_header_text_class">
			<h2 class="postNameInfo" title="$title_title_attr">
				<span class="postTitle">
					<span class="theFeedTitle">$feed_title</span>
					<span class="thePostTitleSeperator">→</span>
					<span class="thePostTitle">$post_title_text</span>
				</span>
			</h2>
			$the_excerpt
		</div>
		<ul class="saveAndDeleteWrap">
			<li class="buttonWrap saveWrap">
				<button type="button" class="save ir">save post from auto trash</button>
			</li>
			<li class="buttonWrap trashWrap">
				<button type="button" class="trash ir">delete post</button>
			</li>
		</ul>
	</header>
EOD;

	$the_main_image = '';
	
	if ( $main_image_object ) {
$the_main_image = <<<EOD
	<figure class="mainImageWrap">
		<img class="mainImage" src="{$main_image_object[0]}" style="max-width:{$main_image_object[1]}px" />
	</figure>
EOD;
	}
	
$article_header = <<<EOD
	<header class="$post_header_class">
		$the_main_image
		<h3>$post_title</h3>
		<hr/>
		<p class="postDates">
			by $author
			$date_text
		</p>
	</header>
EOD;

$article_body = <<<EOD
	<article class="expandableContent">
		<div class="thePost waveTop waveBottom">
			<div class="postLoaderWrap">
				<div class="postLoader">
					<div class="postLoadingWavesWrap">
						<div class="postLoadingWaves"></div>
					</div>
				</div>
				<strong class="loadFigCaption">loading...</strong>
			</div>
		</div>
		<div class="sourceWrap waveBottom">
			<div>
				<a href="$link" class="source" target="_blank">source</a>
				<div class="hr"></div>
			</div>
		</div>
 	</article>
EOD;

$article_footer = <<<EOD
	<footer class="close waveTop closePost">
		<a href="#" class="closeButton ir">close<span class="link"></span><span class="hover"></span></a>
	</footer>
EOD;
	
	$the_article = '<div class="expandableContentWrap closed empty">' . $article_header . $article_body . $article_footer . '</div>';

	$article_class = 'postWrap' . ($has_content ? ' hasContent' : '');
	
	$data_has_content = ( $has_content ? 'true' : 'false' );
	
	$post = "<article data-has_content='$data_has_content' class='$article_class' data-id='$id' data-cat_id='$fresh_cat_id' data-url='$link' data-order='$order'>";
	
	$post = $post . $main_header . $the_article . '</article>';
	
	return $post;
}

function get_post_from_web() {
	/**
	* get an article from the web
	*
	* @return {html string} - $post : the article scrubbed by readability
	*/
	
	$url = $_POST[ 'url' ];
	
	$html = file_get_contents( $url );
	
	if ( extension_loaded( 'tidy' ) ) {
    $tidy = tidy_parse_string( $html, array(), 'UTF8' );
    $tidy->cleanRepair();
    $html = $tidy->value;
	}
	
	$readability = new Readability( $html, $url );
	
	$post = $readability->init();
	
	if ( $post ) {
		$post = $readability->getContent()->innerHTML;
		
    if ( extension_loaded( 'tidy' ) ) {
      $tidy = tidy_parse_string( $post, array( 'indent'=>true, 'show-body-only' => true ), 'UTF8' );
			
      $tidy->cleanRepair();
      
			$post = $tidy->value;
    }
	} else {
		$post = '<h4>sorry...</h4><p>I couldn\'t get anything. This <a href="' .
							$url .
						'" target="_blank">link</a> points to the original page.</a></p>';
	}
	
	echo $post;
	
	die();
}
add_action( 'wp_ajax_nopriv_get_post_from_web', 'get_post_from_web' );
add_action( 'wp_ajax_get_post_from_web', 'get_post_from_web' );

function get_selection_of_posts( $cat_selection, $offset, $length ) {
	/**
	* get a batch of posts for the user using in-site navigation 
	*
	* @param {string} - $cat_selection : 'fresh' || 'frozen'
	* @param {int} - $offset : the post number to begin the grab
	* @param {int} - $length : the number of posts to grab
	*
	* @return {array} - $result : an array of post ids
	*/
	
	// $cat_selection is either 'fresh', 'frozen', or a specific cat id
	$get_posts_args = array(
		'posts_per_page' => -1,
		'category'			 => '',
		'meta_key'			 => 'order',
		'orderby'				 => 'meta_value_num'
	);
	
	$result = array();
	
	$user_id = get_current_user_id();
	
	if ( $cat_selection === 'fresh' ) {
		$cat_selection = implode( ',', get_user_meta( $user_id, 'fresh_id', true ) );
	} else {
		$cat_selection = implode( ',', get_user_meta( $user_id, 'frozen_id', true) );
	}
	
	$posts = get_posts( $get_posts_args );
	
	foreach ( $posts as $post ) {
		$result[] = $post->ID;
	}
	
	$result = array_slice( $result, $offset, $length );
	
	return $result;
}

function login_user() {
	/**
	* logins in user
	*
	* @return {object} - $response : an object with meta info about the user
	*/
	
	/* logs in user if input fields are well formed.
		 returns config and settings info. */
	
	// json ob returned
	$response;
	
	// credentials used to sign on usr
	$sign_on_array;
	
	//signs on user
	$sign_on_array = array(
		'user_login' 		=> $_POST[ 'userName' ],
		'user_password'	=> $_POST[ 'password' ],
		'remember'			=> $_POST[ 'isUserRemembered' ]
	);
	
	$user = wp_signon( $sign_on_array, false );
	
	// does usr exist?
	if ( is_wp_error( $user ) ) {
		$response = array(
			'callbackFrom' => $_POST[ 'action' ],
			'userId'			 => false
		);

	} elseif ( !( $user instanceof WP_User ) ) {
		$response = array(
			'callbackFrom' => $_POST[ 'action' ],
			'userId'			 => 'huh'
		);
		
	} else {
		remove_old_posts();
		
		$user_id = $user->ID;
		
		$config = array(
			'ajaxUrl'	 => admin_url( 'admin-ajax.php' ),
			'userId'	 => $user_id,
			'userName' => $user->user_login
		);
		
		$settings = array(
			'doesWarnFreshCategoryDrop'	 => ( ( boolean ) get_user_meta( $user_id, 'does_warn_fresh_category_drop', true ) ),
			'doesWarnPostDrop'					 => ( ( boolean ) get_user_meta( $user_id, 'does_warn_post_drop', true ) ),
			'freshnessLimit'						 => intVal( get_user_meta( $user_id, 'freshness_limit', true ), 10),
			'isBackgroundAnimating'			 => ( ( boolean ) get_user_meta( $user_id, 'is_background_animating', true ) )
		);
			
		$master_id = intVal( get_user_meta( $user_id, 'master_id', true ), 10 );
		
		$master = array(
			'id'	 => $master_id,
			'name' => get_cat_name( $master_id )
		);
										 
		$fresh_id = intVal( get_user_meta( $user_id, 'fresh_id', true ), 10 );
		$fresh_cats = get_categories( array( 'parent' => $fresh_id, 'hide_empty' => 0 ) );
		$fresh_cats = get_cat_info_from_raw_object( $fresh_cats );
		
		$fresh = array(
			'id'	 => $fresh_id,
			'name' => get_cat_name( $fresh_id ),
			'cats' => $fresh_cats
		);
		
		$frozen_id = intVal( get_user_meta( $user_id, 'frozen_id', true ), 10 );
		
		$frozen = array(
			'id'	 => $frozen_id,
			'name' => get_cat_name( $frozen_id ),
		);
		
		$response = array(
			'callbackFrom' => $_POST[ 'action' ],
			'config'			 => $config,
			'settings'		 => $settings,
			'master'			 => $master,
			'fresh'				 => $fresh,
			'frozen'			 => $frozen
		);
		
	}

	echo json_encode( $response );
	
	die();
}
add_action( 'wp_ajax_nopriv_login_user', 'login_user' );
add_action( 'wp_ajax_login_user', 'login_user' );

function make_cats() {
	/**
	* creates two cats: one for the new articles, one for the saved ones, both pointing to the same website
	*
	* @return {object} - $return_cat_object : an object with meta data about the cats sent to JS for processing
	*/
	
	$additional_action = $_POST[ 'additionalAction' ];
	$display_url = $_POST[ 'displayUrl' ];
	$does_make_frozen_cat = filter_var( $_POST[ 'doesMakeFrozenCat' ], FILTER_VALIDATE_BOOLEAN );
	$name = $_POST[ 'nameVal' ];
	$posts = $_POST[ 'posts' ];
	$rss_url = $_POST[ 'rssUrl' ];
	
	$user_id = get_current_user_id();
	$login = get_userdata( $user_id )->user_login;
	
	$master_cat_id = get_category_by_slug( $login . '_' . 'master' )->term_id;
	
	$return_cat_object = array();
	
	$fresh_parent_id = get_category_by_slug( $login . '_' . 'fresh' )->term_id;
	$fresh_slug = transform_cat_name_to_slug( $name, $login, 'fresh' );
	$new_fresh_cat_id = wp_create_category( $fresh_slug, $fresh_parent_id );
	
	update_cat_id_array( $new_fresh_cat_id, 'fresh' );
	
	update_terms_meta( $new_fresh_cat_id, 'display_name', $name );
	update_terms_meta( $new_fresh_cat_id, 'display_url', $display_url );
	update_terms_meta( $new_fresh_cat_id, 'rss_url', $rss_url );
	update_terms_meta( $new_fresh_cat_id, 'ignore', 'none' );
		
	$return_cat_object[ 'freshCat' ] = array(
		'display_name' => $name,
		'display_url'	 => $display_url,
		'rss_url'			 => $rss_url,
		'id'					 => $new_fresh_cat_id
	);
	
	$parent_cats_arr = array(
		'master' => $master_cat_id,
		'type'	 => $fresh_parent_id,
		'parent' => $new_fresh_cat_id
	);
	
	if ( $does_make_frozen_cat ) {
		make_first_fresh_posts( $posts, $parent_cats_arr, $new_fresh_cat_id );
	}
	
	echo json_encode( $return_cat_object );
	
	die();
}
add_action( 'wp_ajax_nopriv_make_cats', 'make_cats' );
add_action( 'wp_ajax_make_cats', 'make_cats' );

function compare_published_dates( $a, $b ) {
	/**
	* compares dates to list array in chron order
	*
	* @param {object} - $a : the first date
	* @param {object} - $b : the second date
	*
	* @return {int} : value
	*/
	
	return $a[ 'publishedDate' ] - $b[ 'publishedDate' ];
}

function make_published_date( $published_date ) {
	$now = time();
	
	$fifteen_mins = 60 * 15;
	
	if ( $published_date !== '' ) {
		$published_date = strtotime( $published_date );
		$published_date = ( $published_date > $now ? $now : $published_date );
	} else {
		$published_date = $now;
	}
	
	$published_date = $fifteen_mins - ( $published_date % $fifteen_mins ) + $published_date;
	
	return $published_date;
}

function make_excerpt( $excerpt ) {
	/**
	* make the excerpt
	*
	* @param {html string} - $excerpt : the original value
	*
	* @return {html string} - $excerpt : the modifid value
	*/
	
	$excerpt = trim( strip_tags( $excerpt ) );
	
	if ( $excerpt[ 0 ] === '[' ) {
		$pos = strrpos( $excerpt, ']' ) + 1;
		
		if ( $pos !== false ) {
			$excerpt = trim( substr( $excerpt, $pos ) );
			$pos = strrpos( $excerpt, '[' );
			
			if ( $pos !== false ) {
				$excerpt = '';
			}
		} else {
			$excerpt = '';
		}
	}
	
	$excerpt = htmlspecialchars( $excerpt, ENT_QUOTES );
	
	$excerpt = removeUnwantedChars( $excerpt );
	
	return $excerpt;
}

function make_title( $title ) {
	/**
	* makes the title
	*
	* @param {html string} - $title : the original value
	*
	* @return {html string} - $title : the modified value
	*/
	
	$title = strip_tags( $title );
	$title = htmlspecialchars( $title, ENT_QUOTES );
	
	return $title;
}

function make_first_fresh_posts( $post_arr, $parent_cats_arr, $new_fresh_cat_id, $new_frozen_cat_id ) {
	/**
	* makes the first few posts when user first subscribes to a feed
	*
	* @param {array} - $post_arr : array of post ids
	* @param {array} - $parent_cats_arr : array of cat ids
	* @param {int} - $new_fresh_cat_id : new fresh cat id
	* @param {int} - $new_frozen_cat_id : new frozen cat id
	*/
	
	// $post_arr is a 2d ass arr from the front end with raw post data
	// $parent_cats_arr is an arr of parent categories ids
	// filter them here first
	
	$user_id = get_current_user_id();
	
	$c = count( $post_arr );
	$i = 0;

	for ( $i; $i < $c; $i = $i + 1 ) {
		$published_date = make_published_date( $post_arr[ $i ][ 'publishedDate' ] );
		$excerpt = make_excerpt( $post_arr[ $i ][ 'excerpt' ] );
		$title = make_title( $post_arr[ $i ][ 'title' ] );
		
		$args = array(
			'post_category' => $parent_cats_arr,
			'post_content'  => ' ',
			'post_excerpt'	=> $excerpt,
			'post_title'		=> $title,
			'post_status'		=> 'publish'
		);

		$new_post_id = wp_insert_post( $args );

		// $expiration_date
		$freshness_limit = get_user_meta( $user_id, 'freshness_limit', true );
		
		// forever === 0
		$expiration_date = ( $freshness_limit ? $published_date + $freshness_limit : 0 );
		
		$fresh_count = get_user_meta( $user_id, 'fresh_count', true ) + 1;
		update_user_meta( $user_id, 'fresh_count', $fresh_count );
		
		$author_field_key = 'field_54ad919bddf4c';
		update_field( $author_field_key, ucwords( $post_arr[ $i ][ 'author' ] ), $new_post_id );
		
		$expiration_date_field_key = 'field_54adc9e633f02';
		update_field( $expiration_date_field_key, $expiration_date, $new_post_id );
		
		$fresh_feed_id_field_key = 'field_54c9380ad869c';
		update_field( $fresh_feed_id_field_key, $new_fresh_cat_id, $new_post_id );
		
		$link_field_key = 'field_54ad91ffddf4e';
		update_field( $link_field_key, $post_arr[ $i ][ 'link' ], $new_post_id );
		
		$order_field_key = 'field_54b03ed94ede3';
		update_field( $order_field_key, $fresh_count, $new_post_id );
		
		$published_date_field_key = 'field_54ad91e5ddf4d';
		update_field( $published_date_field_key, $published_date, $new_post_id );
		
		$appearance_date_field_key = 'field_54f8d7b7da760';
		update_field( $appearance_date_field_key, strval( time() ), $new_post_id );
	}
}

function make_a_post( $args ) {
	/**
	* creates a single post 
	*
	* @param {object} - $args : all the info to make the post
	*/
	
	$user_id = $args[ 'user_id' ];
	
	// make the post
	$wp_insert_post_args = array(
		'post_category' => $args[ 'parents' ],
		'post_content'  => ' ',
		'post_excerpt'	=> $args[ 'excerpt' ],
		'post_title'		=> $args[ 'title' ],
		'post_status'	  => 'publish'
	);
	
	$new_post_id = wp_insert_post( $wp_insert_post_args );

	// set all the meta on the post
	$fresh_count = get_user_meta( $user_id, 'fresh_count', true ) + 1;
	update_user_meta( $user_id, 'fresh_count', $fresh_count );
	
	$order_field_key = 'field_54b03ed94ede3';
	update_field( $order_field_key, $fresh_count, $new_post_id );
	
	$freshness_limit = get_user_meta( $user_id, 'freshness_limit', true );
	
	if ( $freshness_limit ) {
		$expiration_date = $expiration_date + $freshness_limit;
	} else {
		$expiration_date = 0;
	}
	
	$expiration_date_field_key = 'field_54adc9e633f02';
	update_field( $expiration_date_field_key, $expiration_date, $new_post_id );
	
	$published_date_field_key = 'field_54ad91e5ddf4d';
	update_field( $published_date_field_key, $args[ 'published_date' ], $new_post_id );
	
	$appearance_date_field_key = 'field_54f8d7b7da760';
	update_field( $appearance_date_field_key, strval( time() ), $new_post_id );
	
	$fresh_parent_id_field_key = 'field_54c9380ad869c';
	update_field( $fresh_parent_id_field_key, $args[ 'parent_id' ], $new_post_id );
	
	$frozen_parent_id_field_key = 'field_54c97080555bb';
	update_field( $frozen_parent_id_field_key, $args[ 'frozen_parent_id' ], $new_post_id );
	
	$author_field_key = 'field_54ad919bddf4c';
	update_field( $author_field_key, ucwords( $args[ 'author' ] ), $new_post_id );
	
	$link_field_key = 'field_54ad91ffddf4e';
	update_field( $link_field_key, $args[ 'link' ], $new_post_id );
}

function refresh_posts() {
	/**
	* refreshes the new posts timeline
	*/
	
	$raw_posts = $_POST[ 'newPosts' ];
	$new_posts = array();
	
	$args;
		
	foreach ( $raw_posts as $cat ) {
		update_ignore_array( intval( $cat[ 'id' ], 10 ), $cat[ 'ignore' ] );
		
		$new_posts = array_merge( $new_posts, $cat[ 'new_posts' ] );
	}
	
	foreach ($new_posts as $key => $field) {
		$new_posts[ $key ][ 'publishedDate' ] = make_published_date( $field[ 'publishedDate' ] );
		$new_posts[ $key ][ 'title' ] = make_title( $field[ 'title' ] );
		$new_posts[ $key ][ 'excerpt' ] = make_excerpt( $field[ 'excerpt' ] );
		$new_posts[ $key ][ 'catId' ] = intval( $field[ 'catId' ], 10 );
	}
	
	usort( $new_posts, 'compare_published_dates' );
	
	$user_ob = wp_get_current_user();
	$user_id = $user_ob->ID;
	
	$fresh_cat_id = intval( get_user_meta( $user_id, 'fresh_id', true ), 10 );
	$master_id = intval( get_user_meta( $user_id, 'master_id', true ), 10 );
	
	foreach ( $new_posts as $new_post ) {
		$frozen_parent_name = substr_replace( get_cat_name( $new_post[ 'catId' ] ), 'frozen', -5 );
		
		$frozen_parent_id = get_cat_ID( $frozen_parent_name );
		
		$args = array(
			'user_id'					 => $user_id,
			'title'						 => $new_post[ 'title' ],
			'author'					 => $new_post[ 'author' ],
			'excerpt'					 => $new_post[ 'excerpt' ],
			'published_date'	 => $new_post[ 'publishedDate' ],
			'link'						 => $new_post[ 'link' ],
			'parents'					 => array( $master_id, $fresh_cat_id, $new_post[ 'catId' ] ),
			'parent_id'				 => $new_post[ 'catId' ],
			'frozen_parent_id' => $frozen_parent_id
		);
		
		make_a_post( $args );
	}
	
	die();
}
add_action( 'wp_ajax_nopriv_refresh_posts', 'refresh_posts' );
add_action( 'wp_ajax_refresh_posts', 'refresh_posts' );

function register_user() {
	/**
	* creates a new user
	*
	* @return {object} - $response : object for JS to process
	*/
	
	/* adds a user to the database if input fields are well formed.
		 adds base categories for that user.
		 returns config and settings info. */
	
	$fresh_id;								// fresh cat id
	$fresh_category_ids = array();			// arr of fresh cat ids
	$freshness_limit = 0;
	$frozen_id;								// parent frozen cat id
	$last_time_here;					// date in ms of last time visied
	$master_id;								// highest parent cat id for user
	$new_posts;								// arr of all new posts
	$fresh_count = 0;
	$frozen_count = 0;
	$sign_on_array;						// array of crediantials for sign on
	$sign_on;									// TEMP. this is a test for sign on return.
	$response;								// json ob returned
	$user_data;								// arr passed to make new account
	$user_id;									// id of new user
	$user_login = $_POST[ 'userName' ];
	$user_pass = $_POST[ 'password' ];
	$user_slug;
	
	// during the cleaning up of code unwrapped everything else after the if (wrapped in an else)
	
	if ( username_exists( $user_login ) ) {
		$response = array(
			'callbackFrom'	=> $_POST[ 'action' ],
			'userId'				=> false
		);
		
		echo json_encode( $response );
	
		die();
		
		return;
	}
	
	$user_data = array(
		'role' => 'contributor',
		'user_login' => $user_login,
		'user_pass'	 => $user_pass
	);
	
	// makes usr
	$user_id = wp_insert_user( $user_data );
	
	//signs on user
	$sign_on_array = array(
		'user_login' 		=> $user_login,
		'user_password'	=> $user_pass
	);
	
	$sign_on = wp_signon( $sign_on_array, false );
	
	// sets default usr cat meta
	$master_id = wp_create_category( $user_login . '_master', 0 );
	$fresh_id  = wp_create_category( $user_login . '_fresh', $master_id );
	$frozen_id = wp_create_category( $user_login . '_frozen', $master_id );
	
	// adds default metadata onto the user

	add_user_meta( $user_id, 'does_warn_fresh_category_drop', true );
	
	add_user_meta( $user_id, 'does_warn_post_drop', true  );

	add_user_meta( $user_id, 'fresh_category_ids', $fresh_category_ids );
	
	add_user_meta( $user_id, 'fresh_id', $fresh_id );
	
	add_user_meta( $user_id, 'freshness_limit', $freshness_limit );
	
	add_user_meta( $user_id, 'frozen_id', $frozen_id );
	
	add_user_meta( $user_id, 'master_id', $master_id );
	
	add_user_meta( $user_id, 'last_post_refresh', false );
	
	add_user_meta( $user_id, 'fresh_count', 0 );
	
	add_user_meta( $user_id, 'frozen_count', 0 );
	
	add_user_meta( $user_id, 'is_background_animating', true );
	
	add_user_meta( $user_id, 'article_type', 'fresh' );
	
	add_user_meta( $user_id, 'batch_number', 1 );
	
	add_user_meta( $user_id, 'last_time_here', date( 'Y-m-H-i-s' ) );
	
	// gets the settings form

	$config = array(
		'ajaxUrl'	 => admin_url( 'admin-ajax.php' ),
		'userId'	 => $user_id,
		'userName' => $user_login
	);
	
	$settings = array(
		'doesWarnFreshCategoryDrop'	 => true,
		'doesWarnFrozenCategoryDrop' => true,
		'doesWarnPostDrop'					 => true,
		'freshnessLimit'						 => $freshness_limit,
		'isBackgroundAnimating'			 => true
	);
		
	$master = array(
		'id'	 => $master_id,
		'name' => $user_login
	);
	
	$fresh = array(
		'id'	 => $fresh_id,
		'name' => $user_login . 'Fresh',
		'cats' => false
	);
	
	$frozen = array(
		'id'	 => $frozen_id,
		'name' => $user_login . 'Frozen'
	);
	
	$response = array(
		'callbackFrom' => $_POST[ 'action' ],
		'config'			 => $config,
		'settings'		 => $settings,
		'master'			 => $master,
		'fresh'				 => $fresh,
		'frozen'			 => $frozen
	);
	
	echo json_encode( $response );
	
	die();
}
add_action( 'wp_ajax_nopriv_register_user', 'register_user' );
add_action( 'wp_ajax_register_user', 'register_user' );

function removeUnwantedChars( $text ) {
	$unwanted_array = array(
		'Š'=>'S',
		'š'=>'s',
		'Ž'=>'Z',
		'ž'=>'z',
		'À'=>'A',
		'Á'=>'A',
		'Â'=>'A',
		'Ã'=>'A',
		'Ä'=>'A',
		'Å'=>'A',
		'Æ'=>'A',
		'Ç'=>'C',
		'È'=>'E',
		'É'=>'E',
		'Ê'=>'E',
		'Ë'=>'E',
		'Ì'=>'I',
		'Í'=>'I',
		'Î'=>'I',
		'Ï'=>'I',
		'Ñ'=>'N',
		'Ò'=>'O',
		'Ó'=>'O',
		'Ô'=>'O',
		'Õ'=>'O',
		'Ö'=>'O',
		'Ø'=>'O',
		'Ù'=>'U',
		'Ú'=>'U',
		'Û'=>'U',
		'Ü'=>'U',
		'Ý'=>'Y',
		'Þ'=>'B',
		'ß'=>'Ss',
		'à'=>'a',
		'á'=>'a',
		'â'=>'a',
		'ã'=>'a',
		'ä'=>'a',
		'å'=>'a',
		'æ'=>'a',
		'ç'=>'c',
		'è'=>'e',
		'é'=>'e',
		'ê'=>'e',
		'ë'=>'e',
		'ì'=>'i',
		'í'=>'i',
		'î'=>'i',
		'ï'=>'i',
		'ð'=>'o',
		'ñ'=>'n',
		'ò'=>'o',
		'ó'=>'o',
		'ô'=>'o',
		'õ'=>'o',
		'ö'=>'o',
		'ø'=>'o',
		'ù'=>'u',
		'ú'=>'u',
		'û'=>'u',
		'ý'=>'y',
		'þ'=>'b',
		'ÿ'=>'y',
		'“'=>'"',
		'”'=>'"',
		'‘'=>"'",
		'’'=>"'",
		'«'=>'"',
		'»'=>'"',
		'„'=>'"',
		'…'=>'...',
		'¥'=>' yen(s)/yuan(s)',
		'€'=>' euro(s)',
		'¡'=>' ',
		'¿'=>' ',
		'÷'=>'/',
		'×'=>'*',
		'℮'=>'~',
		'--'=>'—',
		'¦'=>'|',
		'©'=>' (copyright)',
		'®'=>' (registered trademark)',
		'℠'=>' (service mark)',
		'™'=>' (trademark)',
		'≤'=>' less than or equal to ',
		'≥'=>' greater than or equal to ',
		'≈'=>' approximately '
	);
	
	$text = strtr( $text, $unwanted_array );
	
	return $text;
}

function return_next_post() {
	/**
	* get a new post on timeline when deleting or saving one
	*
	* @return {html string} : the post
	*/
	
	$article_type = $_POST[ 'articleType' ];
	$order = intval( $_POST[ 'order' ], 10 ) - 1;
	
	$cat_ids = get_user_meta( get_current_user_id(), ( $article_type . '_category_ids' ), true );
	
	$args = array(
		'category__in' => $cat_ids,
		'meta_key' => 'order',
		'meta_value' => 0,
		'posts_per_page' => 1
	);
	
	for ( $i = $order; $i > -1; $i = $i - 1 ) {
		$args[ 'meta_value' ] = $i;
		
		$posts_array = get_posts( $args );
		
		if ( count( $posts_array ) ) {
			$next_post_id = $posts_array[ 0 ]->ID;
			break;
		}
	}
	
	echo( get_this_post( $next_post_id ) );
	
	die();
}
add_action( 'wp_ajax_nopriv_return_next_post', 'return_next_post' );
add_action( 'wp_ajax_return_next_post', 'return_next_post' );

function return_template_part() {
	
	$user_id = get_current_user_id();
	
	update_user_meta( $user_id, 'article_type', $_POST[ 'articleType' ] );
	
	update_user_meta( $user_id, 'batch_number', $_POST[ 'batchNumber' ] );
	
	echo get_template_part( $_POST[ 'templatePart' ] );
	
	die();
}
add_action( 'wp_ajax_nopriv_return_template_part', 'return_template_part' );
add_action( 'wp_ajax_return_template_part', 'return_template_part' );

function save_this_post() {
	/**
	* saves a single post
	*/
	
	$freshPostId = intval( $_POST[ 'postId' ], 10 );

	$user_id = get_current_user_id();
	
	$master_id = intval( get_user_meta( $user_id, 'master_id', true ), 10 );
	
	$frozen_id = intval( get_user_meta( $user_id, 'frozen_id', true ), 10 );
	
	$parent_cats_arr = array(
		'master' => $master_id,
		'parent'	 => $frozen_id
	);
	
	$freshPost = get_post( $freshPostId );
	
	$the_content = $freshPost->post_content;
	
	$the_title = $freshPost->post_title;
	
	$the_excerpt = $freshPost->post_excerpt;
	
	$args = array(
		'post_category' => $parent_cats_arr,
		'post_content'  => $the_content,
		'post_excerpt'	=> $the_excerpt,
		'post_title'		=> $the_title,
		'post_status'		=> 'publish'
	);

	$new_frozen_post_id = wp_insert_post( $args );
	
	if ( $new_frozen_post_id ) {
		$author_key = 'field_54ad919bddf4c';
		$author = get_field( $author_key, $freshPostId );
		update_field( $author_key, $author, $new_frozen_post_id );
	
		$published_date_key = 'field_54ad91e5ddf4d';
		$published_date = get_field( $published_date_key, $freshPostId );
		update_field( $published_date_key, $published_date, $new_frozen_post_id );
	
		$link_key = 'field_54ad91ffddf4e';
		$link = get_field( $link_key, $freshPostId );
		update_field( $link_key, $link, $new_frozen_post_id );
	
		$has_content_key = 'field_54ae9c3b5782c';
		$has_content = get_field( $has_content_key, $freshPostId );
		update_field( $has_content_key, $has_content, $new_frozen_post_id );
	
		$related_image_key = 'field_54c0273f74c2a';
		$related_image = get_field( $related_image_key, $freshPostId );
		update_field( $related_image_key, $related_image, $new_frozen_post_id );
		
		$fresh_feed_id_key = 'field_54c9380ad869c';
		$fresh_feed_id = get_field( $fresh_feed_id_key, $freshPostId );
		update_field( $fresh_feed_id_key, $fresh_feed_id, $new_frozen_post_id );
		
		$post_category_name_if_frozen = get_terms_meta( $fresh_feed_id, 'display_name' )[ 0 ];
		
		$post_category_name_if_frozen_key = 'field_55c4eaf2957ec';
		update_field( $post_category_name_if_frozen_key, $post_category_name_if_frozen, $new_frozen_post_id );
		
		// order
		
		$frozen_count = get_user_meta( $user_id, 'frozen_count', true ) + 1;
		update_user_meta( $user_id, 'frozen_count', $frozen_count );
		update_field( 'field_54b03ed94ede3', $frozen_count, $new_frozen_post_id );
		
		update_field( $frozen_feed_id_key, $frozen_feed_id, $new_frozen_post_id );
		
		$expiration_date_key = 'field_54adc9e633f02';
		update_field( $expiration_date_key, 0, $new_frozen_post_id );
		
		$return = wp_delete_post( $freshPostId );
	}

	die();
}
add_action( 'wp_ajax_nopriv_save_this_post', 'save_this_post' );
add_action( 'wp_ajax_save_this_post', 'save_this_post' );

function set_post_content() {
	/**
	* sets content to a post
	*/
	
	$has_content_key = 'field_54ae9c3b5782c';
	
	$post_id = intval( $_POST[ 'id' ], 10 );
	
	update_field( $has_content_key, true, $post_id );
	
	$updated_post = array(
		'ID'					 => $post_id,
		'post_content' => $_POST[ 'postContent' ]
	);
	
	$result = wp_update_post( $updated_post );
	
	echo( $result );

	die();
}
add_action( 'wp_ajax_nopriv_set_post_content', 'set_post_content' );
add_action( 'wp_ajax_set_post_content', 'set_post_content' );

function toggle_cloud_animation() {
	/**
	* starts / stops background cloud animation
	*/
	
	$bool =  intval( $_POST[ 'bool' ], 10 );
	
	$user_id = get_current_user_id();
	$was_successful = update_user_meta( $user_id, 'is_background_animating', $bool );
	
	if ( $was_successful ) {
		echo('is background animating?: ' . $bool);
	}
	
	die();
}
add_action( 'wp_ajax_nopriv_toggle_cloud_animation', 'toggle_cloud_animation' );
add_action( 'wp_ajax_toggle_cloud_animation', 'toggle_cloud_animation' );

function transform_cat_name_to_slug( $name, $login, $type ) {
	/**
	* description
	*
	* @param {string} - $name : cat name
	* @param {string} - $login : login name
	* @param {string} - $type : 'fresh' || 'frozen'
	*
	* @return {string} - $slug :
	*/
	
	$name = explode( ' ', $name );
	
	$slug = implode( '_', $name );
	$slug = $login . '_' . $slug . '_' . $type;
	
	return $slug;
}

function update_cat_id_array( $new_id, $type ) {
	/**
	* description
	*
	* @param {int} - $new_id : 
	* @param {string} - $type : 'fresh' || 'frozen'
	*/
	
	$user_id = get_current_user_id();
	$key = $type . '_category_ids';
	$cat_ids = get_user_meta( $user_id, $key, true );
	
	if ( !count( $cat_ids ) ) {
		$cat_ids = array( $new_id );
	} else {
		array_push( $cat_ids, $new_id );
	}
	
	update_user_meta( $user_id, $key, $cat_ids );
}

function update_ignore_array( $cat_id, $urls ) {
	/**
	* description
	*
	* @param {id} - $cat_id :
	* @param {array} - $urls :
	*/
	
	$urls = implode( ' ', $urls );
	
	update_terms_meta( $cat_id, 'ignore', $urls );
}

function update_cat_name() {
	
	$new_base_name = $_POST[ 'newBaseName' ];
	$old_base_name = $_POST[ 'oldBaseName' ];
	
	if ( count( explode( ' ', $new_base_name ) ) > 1 ) {
		$new_base_name = transform_cat_name_to_slug( $new_base_name );
	} else {
		$new_base_name = '_' . $new_base_name . '_';
	}
	
	if ( count( explode( ' ', $old_base_name ) ) > 1 ) {
		$old_base_name = transform_cat_name_to_slug( $old_base_name );
	} else {
		$old_base_name = '_' . $old_base_name . '_';
	}
	
	$returned_ids = array( 'freshId' => false );
	
	$user_name = get_userdata( get_current_user_id() )->user_login;

	$fresh_cat_id = get_cat_ID( $user_name . $old_base_name . 'fresh' );
	update_terms_meta( $fresh_cat_id, 'display_name', $_POST[ 'newBaseName' ] );
	
	$args = array(
 	  'name' => ( $user_name  . $new_base_name . 'fresh' ),
 		'slug' => ( $user_name  . strtolower( $new_base_name ) . 'fresh' )
	);
	
  wp_update_term( $fresh_cat_id, 'category', $args );
	
	$returned_ids[ 'freshId' ] = $fresh_cat_id;

	echo json_encode( $returned_ids );

	die();
}
add_action( 'wp_ajax_nopriv_update_cat_name', 'update_cat_name' );
add_action( 'wp_ajax_update_cat_name', 'update_cat_name' );

function update_freshness_limit() {
	/**
	* description 
	*/
	
	$user_id = get_current_user_id();
	$freshness_limit = intval( $_POST[ 'freshnessLimit' ], 10 );
	$was_successful = update_user_meta( $user_id, 'freshness_limit', $freshness_limit );
	
	if ( $was_successful ) {
		echo( 'new freshness limit: ' . $freshness_limit );
	}
	
	die();
}
add_action( 'wp_ajax_nopriv_update_freshness_limit', 'update_freshness_limit' );
add_action( 'wp_ajax_update_freshness_limit', 'update_freshness_limit' );

function update_one_setting() {
	/**
	* description
	*
	* @return {array} - $response :
	*/
	
	$val = $_POST[ 'val' ];
	$meta_key = $_POST[ 'metaKey' ];
	$user_id = get_current_user_id();
	
	if ( $val === 'true' ) {
		$val = true;
	} elseif ( $val === 'false' ) {
		$val = false;
	} else {
		$val = intval( $val, 10 );
	}
	
	update_user_meta( $user_id, $meta_key, $val);
	
	$response = array( $meta_key => get_user_meta( $user_id, $meta_key, true ) );
	
	echo json_encode( $response );
	
	die();
}
add_action( 'wp_ajax_nopriv_update_one_setting', 'update_one_setting' );
add_action( 'wp_ajax_update_one_setting', 'update_one_setting' );

function user_add_or_remove_ignored_urls() {
	/**
	* description
	*
	* @return {array} - $return :
	*/
	
	$return = add_or_remove_ignored_urls( $_POST[ 'catId' ], $_POST[ 'urls' ], true );
	
	echo( $return );
	
	die();
}
add_action( 'wp_ajax_nopriv_user_add_or_remove_ignored_urls', 'user_add_or_remove_ignored_urls' );
add_action( 'wp_ajax_user_add_or_remove_ignored_urls', 'user_add_or_remove_ignored_urls' );
?>
