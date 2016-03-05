<?php
/**
* creates the navigation bar
*/

$styleImagesUri = get_stylesheet_directory_uri() . '/style-imgs/';
?>
		<nav id="homeNavWrap" class="offScreen">
			<ul id="homeNav">
				<li id="newFeedsButtonWrap" class="buttonWrap clicked" data-section_id="newArticleSection">
					<button id="newFeedsButton" type="button">
						<span id="newButtonImage">
							New
						</span>
					</button>
				</li>
				<li id="savedPostsButtonWrap" class="buttonWrap" data-section_id="savedArticleSection">
					<button id="savedPostsButton" type="button">
						<span id="savedButtonImage">
							Saved
						</span>
					</button>
				</li>
				<li id="faqButtonWrap" class="buttonWrap" data-section_id="infoSection">
					<button id="faqButton" type="button">
						<span id="faqButtonImage" class="ir">
							Frequently Asked Questions
						</span>
					</button>
				</li>
				<li id="settingsButtonWrap" class="buttonWrap" data-section_id="userSettings">
					<button id="settingsButton" type="button">
						<span id="settingsButtonImage">
							Settings
						</span>
						<div class="style"></div>
					</button>
				</li>
			</ul>
			<footer class="close">
				<a href="#" class="closeButton ir">Close<span class="link"></span><span class="hover"></span></a>
			</footer>
		</nav>
		<div id="gateWrap">
			<div id="gate"></div>
			<div class="style"></div>
		</div>