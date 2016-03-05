<?php
/**
* creates the splash page if the user is logged out
*/

$intro = get_post( get_id_by_slug('intro') );
?>
		<ul id="splashNav">
			<li class="buttonWrap sky">
				<button id="login" type="button" class="sky">
					Log In
				</button>
			</li>
			<li class="buttonWrap sky">
				<button id="signUp" type="button" class="sky">
					Sign Up
				</button>
			</li>
			<li class="buttonWrap sky">
				<button type="button" class="about sky">
					About
				</button>
			</li>
		</ul>
		<header id="splashAboutWrap">
			<article id="splashAbout" class="hideAbout">
				<div id="rectFront">
					<h1 id="splashAboutHeader"><?php echo $intro->post_title; ?></h1>
				</div>
				<div id="rectTop">
					<p id="splashAboutContent">
						<?php echo $intro->post_content; ?>
					</p>
				</div>
			</article>
		</header>
