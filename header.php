<?php
	/**
	* creates the head
	*/

	$is_mobile = wp_is_mobile();
	$is_user_logged_in = is_user_logged_in();
	$stylesheetUri = get_template_directory_uri() . '/fresh-links-styles/stylesheets/style.css';
	
	global $is_chrome;
	global $is_gecko;
	global $is_IE;
	global $is_iphone;
	global $is_opera;
	global $is_safari;
	
	$uaClass = '';
	$uaClass .= ( $is_chrome ? ' chrome ' : '' ); // ' ' padding just in case
	$uaClass .= ( $is_IE ? ' ie ' : '' );
	$uaClass .= ( $is_iphone ? ' iphone ' : '' );
	$uaClass .= ( $is_opera ? ' opera ' : '' );
	$uaClass .= ( $is_safari ? ' safari ' : '' );
	
	$uaClass = trim($uaClass);
	
	$tourClass = ( $_SERVER['QUERY_STRING'] === 'tour' ? 'tour' : 'no-tour' );
	
	$wpStyleFile = get_template_directory_uri() . '/style.css'; // temporary. change when you go live.
	
	$tamplateDir = get_template_directory_uri();
	
	if( $is_user_logged_in ){
		$title = 'new posts | ' . get_userdata( get_current_user_id() )->user_login;
		$htmlClass = 'loggedIn';
	} else {
		$title = 'your internet paperboy';
		$htmlClass = 'loggedOut';
	}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="<?php echo $htmlClass . ' ' . $uaClass . ' ' . $tourClass; ?>">
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title><?php echo $title; ?></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		
		<link rel="apple-touch-icon-precomposed" sizes="57x57" href="<?php echo $tamplateDir; ?>/apple-touch-icon-57x57.png" />
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?php echo $tamplateDir; ?>/apple-touch-icon-114x114.png" />
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?php echo $tamplateDir; ?>/apple-touch-icon-72x72.png" />
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="<?php echo $tamplateDir; ?>/apple-touch-icon-144x144.png" />
		<link rel="apple-touch-icon-precomposed" sizes="60x60" href="<?php echo $tamplateDir; ?>/apple-touch-icon-60x60.png" />
		<link rel="apple-touch-icon-precomposed" sizes="120x120" href="<?php echo $tamplateDir; ?>/apple-touch-icon-120x120.png" />
		<link rel="apple-touch-icon-precomposed" sizes="76x76" href="<?php echo $tamplateDir; ?>/apple-touch-icon-76x76.png" />
		<link rel="apple-touch-icon-precomposed" sizes="152x152" href="<?php echo $tamplateDir; ?>/apple-touch-icon-152x152.png" />
		<link rel="icon" type="image/png" href="<?php echo $tamplateDir; ?>/favicon-196x196.png" sizes="196x196" />
		<link rel="icon" type="image/png" href="<?php echo $tamplateDir; ?>/favicon-96x96.png" sizes="96x96" />
		<link rel="icon" type="image/png" href="<?php echo $tamplateDir; ?>/favicon-32x32.png" sizes="32x32" />
		<link rel="icon" type="image/png" href="<?php echo $tamplateDir; ?>/favicon-16x16.png" sizes="16x16" />
		<link rel="icon" type="image/png" href="<?php echo $tamplateDir; ?>/favicon-128.png" sizes="128x128" />
		<meta name="application-name" content="&nbsp;"/>
		<meta name="msapplication-TileColor" content="#FFFFFF" />
		<meta name="msapplication-TileImage" content="<?php echo $tamplateDir; ?>/mstile-144x144.png" />
		<meta name="msapplication-square70x70logo" content="<?php echo $tamplateDir; ?>/mstile-70x70.png" />
		<meta name="msapplication-square150x150logo" content="<?php echo $tamplateDir; ?>/mstile-150x150.png" />
		<meta name="msapplication-wide310x150logo" content="<?php echo $tamplateDir; ?>/mstile-310x150.png" />
		<meta name="msapplication-square310x310logo" content="<?php echo $tamplateDir; ?>/mstile-310x310.png" />
					
		<link rel="stylesheet" type="text/css" href="<?php echo $wpStyleFile; ?>" />
		<link rel="stylesheet" type="text/css" href="<?php echo $stylesheetUri; ?>" />
					
<?php wp_head(); ?>
		<script>google.load("feeds", "1", true);</script>
	</head>
	<body class="preload allFeeds">
		<div id="main">