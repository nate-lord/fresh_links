<?php
	/**
	* creates the settings page
	*/
	
	$template_dir = get_template_directory_uri() . '/';
	$user_id = get_current_user_id();
	$login = get_userdata($user_id)->user_login;
	$fresh_id = get_user_meta($user_id, 'fresh_id', true);
	$fresh_cats = get_categories( array('parent' => $fresh_id, 'hide_empty' => 0) );
	$fresh_cats = get_cat_info_from_raw_object($fresh_cats);
	
	// new post life span
	$freshness_limit = get_user_meta( $user_id, 'freshness_limit', true ) / (60 * 60 * 24);
	if( $freshness_limit === 1 ) {
		$freshness_text = '1 Day';
		$range_class = 'position1';
	} else if( $freshness_limit === 1.5 ) {
		$freshness_text = '36 Hours';
		$range_class = 'position2';
	} else if( $freshness_limit === 2 ) {
		$freshness_text = '2 Days';
		$range_class = 'position3';
	} else if( $freshness_limit === 2.5 ) {
		$freshness_text = '2.5 Days';
		$range_class = 'position4';
	} else if( !$freshness_limit ) {
		$freshness_text = 'Forever';
		$range_class = 'position5';
	}
	
	// background animating
	$is_background_animating = get_user_meta( $user_id, 'is_background_animating', true );
	if( $is_background_animating ){
		$toggle_animation_element = '<input id="isBackgroundAnimating" type="checkbox" />';
	} else {
		$toggle_animation_element = '<input id="isBackgroundAnimating" class="checked" type="checkbox" checked="checked" />';
	}
	
	$style_imgs_dir = get_stylesheet_directory_uri() . '/style-imgs/';
?>
<section id="userSettings" class="currentMainSection">
	
	<header class="waveBottom">
		<div class="buttonWrap menuButtonWrap">
			<button class="ir menuButton">Toggle menu</button>
		</div>
		<h1>Menu & Settings</h1>
		<nav id="settingsNav">
			<a href="#logOutWrap">Log Out</a>
			<a href="#addFeedsWrap">Add Feeds</a>
			<a href="#editFeedsWrap">Edit Feeds</a>
			<a href="#articleLifeSpanWrap">Article Life Span</a>
			<a href="#backgroundAnimationSettingWrap">Background</a>
			<a href="#deleteAccountWrap">Delete Account</a>
		</nav>
	</header>
	
	<article id="logOutWrap" class="waveBottom waveTop">
		<h2>Bye bye</h2>
		<div class="buttonWrap">
			<a id="logOut" class="button" href="<?php echo wp_logout_url( home_url() ); ?>">Log Out</a>
		</div>
	</article>

	<article id="addFeedsWrap" class="waveBottom waveTop">
		<h2>Add a feed</h2>
		<p class="info">You need RSS feed urls.</p>
		<p class="info">If you don't know what those are or how to get them click <span class="inlineButton launchTutorial">here</span> to launch a tutorial.</p>
		<input type="text" id="newFeedTitle" placeholder="Feed Title" />
		<p class="error"></p>
		<input type="url" id="newFeedUrl" placeholder="Feed Url" />
		<p class="error"></p>
		<div class="buttonWrap">
			<button id="createFeed" type="button">Create Feed</button>
		</div>
	</article>

	<article id="editFeedsWrap" class="waveBottom waveTop">
		<h2>Edit your feeds</h2>
<?php if(!$fresh_cats): ?>
		<p class="info" data-other_instructions="Title edits will show up the next time you visit the page.">
			You currently are not subscribed to any feeds.
		</p>	
<?php endif;
			if($fresh_cats): ?>
		<p class="info" data-other_instructions="You currently are not subscribed to any feeds.">
			Title edits will show up the next time you visit the page.
		</p>
<?php
	$i = 0;
	foreach ($fresh_cats as $fresh_cat) {
		$feed_info_class = ($i ? 'canEdit feedInfo' : 'canEdit feedInfo first');
		$display_name = $fresh_cat['display_name'];
		$display_url = $fresh_cat['display_url'];
		$rss_url = $fresh_cat['rss_url'];
?>
		<div class="<?php echo $feed_info_class; ?>" data-feed_name="<?php echo $display_name; ?>">
			<div class="hr"></div>
			<input type="text" class="existingFeedTitle" data-original_value="<?php echo $display_name; ?>" value="<?php echo $display_name; ?>" readonly />
			<p class="error"></p>
			<input type="url" class="existingFeedUrl" data-rss_url="<?php echo $rss_url; ?>" value="<?php echo $display_url; ?>" readonly />
			<div class="buttonWrap saveOrEditFeedWrap">
				<button class="saveOrEditFeed edit" type="button">Edit</button>
			</div>
			<div class="buttonWrap trashWrap">
				<button class="trash ir" type="button">Trash</button>
			</div>
		</div>
<?php		
		$i = $i + 1;
	} // ends loop
	endif; ?>
	</article>

	<article id="articleLifeSpanWrap" class="waveBottom waveTop">
		<h2>New post life span</h2>
		<p class="info">The number of days new posts remain on the timeline before getting trashed.</p>
		<p class="info">This won't effect saved posts or any posts currently on the timeline.</p>
		
		<div id="rangeStuff">
			<div id="range">
				<div id="rangePit">
					<div id="rangeHandleWrap">
						<div id="rangeHandle" class="<?php echo $range_class; ?>" data-class_data="<?php echo $range_class; ?>"></div>
					</div>
				</div>
			</div>
			<p id="rangeResultWrap">
				<var id="rangeResult"><?php echo $freshness_text; ?></var>
			</p>
		</div>
	</article>

	<article id="backgroundAnimationSettingWrap" class="waveBottom waveTop">
		<h2>Background animation</h2>
		<label>Stop the background animation? <?php echo $toggle_animation_element; ?><span class="style"></span></label>
	</article>

	<article id="deleteAccountWrap" class="waveBottom waveTop">
		<h2>Delete account</h2>
		<p class="info">This cannot be undone.</p>
		<div class="buttonWrap">
			<button id="deleteAccount" type="button">Delete account</button>
		</div>
	</article>
	
	<footer class="toTop waveTop">
		<a href="#" class="toTopButton ir">To Top<span class="link"></span><span class="hover"></span></a>
	</footer>
</section>