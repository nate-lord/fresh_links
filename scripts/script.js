$(function() {
	var C, 	// alais for FRESH_LINKS.config
			$El,		// alais for FRESH_LINKS.cachedElements
			FRESH_LINKS,
			F,			// alais for FRESH_LINKS.funcs
			S,			// alais for FRESH_LINKS.settings
			u = undefined;
	
	FRESH_LINKS = {
		
		cachedElements: {
			/* for all cached elements which may change */
			addNewFeedWrap: u,
			body: $( 'body' ),
			closeMobileNav: u,
			clouds: $( '#clouds-b, #clouds-a' ),
			cloudsA: $( '#clouds-a' ),
			cloudsB: $( '#clouds-b' ),
			contentWrap: u,
			currentMainSectionWrap: u,
			daysFreshWrap: u, // holds days fresh radio grp
			deny: $( '.deny' ), // cancel on pop ups
			dropFreshCategoryPopUp: $( '#dropFreshCategoryPopUp' ),
			// !* dropFrozenCategoryPopUp: $( '#dropFrozenCategoryPopUp' ),
			dropPostPopUp: $( '#dropPostPopUp' ),
			dropUser: u,		// btn: delete acct
			dropUserPopUp: $( '#dropUserPopUp' ),
			feed: u, // the feed input to make new feed
			homeNavWrap: u,
			html: $( 'html' ),
			loginMenuButton: $( '#login' ),
			loginPopUp: $( '#loginPopUp' ),
			loginPopUpButton: $( '#loginPopUp .enter' ), 	// splash login btn
			main: $( '#main' ),
			passwordError: u,// hold error message
			popUpClose: $( '#popUpsWrap .close' ),
			popUpConfirm: $( '#popUpsWrap .confirm' ),
			popUpDeny: $( '#popUpsWrap .deny' ),
			rangePit: u,
			register: u, 		// sign in/up register radio btn
			rememberMe: u, 	// sign in/up checkbox
			screenWidthStandardizer: $( '#screenWidthStandardizer' ),
			scrollGrip: u,
			searchWebForFeeds: u, // btn opns new tab, google for query + 'rss'
			settingsForm: u,
			siteHeader: $( '#siteHeader' ),
			signUpMenuButton: $( '#signUp' ),
			signUpPopUpButton: $( '#signUpPopUp .register' ), // splash sign up btn
			signUpPopUp: $( '#signUpPopUp' ),
			splashAboutBtn: u, // splash about btn
			rectTop: u,
			rectFront: u,
			splashAboutWrap: u,
			theDisplay: $( '#theDisplay' ), // holds main content
			timeline: u,
			title: $( 'title' ),
			toggleSettings: u, // btn: show/hide setting form
			track: u, 					// track in settings form
			userNameError: u,	// hold error message
			window: $( window )
		},
		
		config: {
			/* for all constant variables that are non-secure and non-functions.
				 if user isn't logged in on init, populated by the ajax call in trySignInOrRegisterUser.
				 else from the c data object in the init page load. */
			ajaxUrl: Wp.config.ajaxUrl,	// url used in ajax
			blur: 'blur',
			click: 'click',		// click equivilent
			cloudId: u,
			cloudTimer: u,
			cloudDistance: u, // distance of cloud animation
			cloudsDuration: u, // cloud animation duration
			cloudsWidth: u, // device width
			doCubeFlipAnimation: u,
			focus: 'focus', // focus equivilent
			keypress: 'keypress',
			keydown: 'keydown',
			isChrome: $( 'html' ).hasClass( 'chrome' ),
			isIphone: $( 'html' ).hasClass( 'iphone' ),
			isMacAndNonMobile: u, // used for custom scrolling
			isTour: ( Tour.arg === 'isTour' ? true : false ),
			isSafari: $( 'html' ).hasClass( 'safari' ),
			hasTouch: $( 'html' ).hasClass( 'touch' ),
			hasTransitionsAndTransforms: ( $( 'html' ).hasClass( 'csstransitions' ) && $( 'html' ).hasClass( 'csstransforms' ) ),
			hasRgba: $( 'html' ).hasClass( 'rgba' ),
			haveCloudsAnimated: false, // 
			master: u, // object {id:int, name:"str"} [name === username]
			mouseenter: 'mouseenter', // mouseenter equivilent
			mousedown: 'mousedown', // mousedown equivilent
			mouseleave: 'mouseleave', // mouseleave equivilent
			mousemove: 'mousemove', // mousemove equivilent
			mouseup: 'mouseup', // mouseup equivilent
			mousewheel: 'mousewheel',
			readabilityToken: u,
			readabilityUrl: 'https://www.readability.com/api/content/v1/parser?url=',
			scroll: 'scroll',
			userId: u,
			userName: u
		},

		settings: {
			/* settings that the user may adjust.
				 if user isn't logged in on init, populated by the ajax call in trySignInOrRegisterUser.
				 else from the c data object in the init page load. */
			batchFeeds: {
				articleType: '',
				batchCount: 0,
				isFocused: false,
				$jumpToBatch: u,
				keyCodes: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 13, 8, 37, 39], // 0-9 then enter, delete, l arrw, r arrw
				$next: u,
				numDigits: 0,
				$pageCount: u,
				postRemainder: 0,
				postsPerBatch: 4,
				$prev: u,
				tensPlace: 0
			},
			cloudAnimationCounter: u,
			currentSection: 'newArticleSection',
			doesWarnFreshCategoryDrop: u,	// show pop up when drop fresh cat?
			// !* doesWarnFrozenCategoryDrop: u,// show pop up when drop froze cat?
			doesWarnPostDrop: u,		// show pop up when drop post?
			fresh: {},
			// ? freshCategoryIds: u,
			freshnessLimit: u,			// num (ms) of days bf post is dropped
			frozen: {},
			// !* frozenCategoryIds: u,		// arr of frozen cat ids
			genericPopUpArg: {},
			globalHolder: {},
			isBackgroundAnimating: u,
			isScreenLarge: u,
			isUserLoggedIn: $( 'html' ).hasClass( 'loggedIn' ),
			range: {
				maxLeft: 180,
				minOffset: 0,
				pageX: 0,
				text: '',
				width: 0
			},
			scrollGripScrollMax: 0,
			timelineScrollMax: 0,
			stopAction: {},
			timelineHeight: 0,
			timer: {},
			title: '',
			tutorialSlideIndex: 0,
			vpHeight: 0,
			vpWidth: 0
		},
		
		funcs: {
			
			addFeedIfExists: function( feedOb ) {
				/**
				* description
				*
				* @called : click ev on #createFeed
				* @calls : getNewPostInfoFromRawEntries,
				*					 makeDisplayUrl,
				*					 addInitIgnoredUrls,
				*					 transitionOutInputFeedInfo,
				*					 insertFeedInfo,
				*					 showMalformedInputWarning
				*
				* @group : add feed / interactive style
				* @page : settings
				*
				* @params {object} - feedOb = {
				*						$addFeedsWrap: {jquery object}, 
				*						additionalAction: {jquery object},
				*						$name: {jquery object},
				*						doesMakeFrozenCat: {boolean},
				*						nameVal: {string},
				*						$url: {jquery object},
				*						urlVal: {url string}
				*					}
				*/
				
				var feed;
				
				feedOb.action = 'make_cats';
				feedOb.freshId = S.fresh.id;
				feedOb.frozenId = S.frozen.id;
				feedOb.userId = C.userId;
				
				feed = new google.feeds.Feed( feedOb.urlVal );
				feed.setNumEntries(6);
				
				feed.load( function( feeds ) {
					var displayUrl,
							rawEntries = feeds.feed.entries,
							entries = [],
							l = rawEntries.length;
							
					if ( l ) {
						entries[ 0 ] = rawEntries[ 3 ];
						
						if ( l > 1 ) {
							entries[ 1 ] = rawEntries[ 4 ];
						}
						
						if ( l > 2 ) {
							entries[ 2 ] = rawEntries[ 5 ];
						}
						
						entries = F.getNewPostInfoFromRawEntries( entries );
						
						displayUrl = F.makeDisplayUrl( feedOb.urlVal );
						
						$.ajax({
							type: 'POST',
							url: C.ajaxUrl,
							data: {
								action: feedOb.action,
								additionalAction: feedOb.additionalAction,
								displayUrl: displayUrl,
								// !* doesMakeFrozenCat: feedOb.doesMakeFrozenCat,
								posts: entries,
								nameVal: feedOb.nameVal,
								rssUrl: feedOb.urlVal,
								userId: C.userId
							},
							success: function( data ) {
								catData = $.parseJSON( data );
								
								S[ 'fresh' ][ 'cats' ][ 'cat' + catData.freshCat.id ] = catData.freshCat;
								
								F.addInitIgnoredUrls( catData.freshCat.id, feedOb.urlVal );
								
								F.transitionOutInputFeedInfo();
								
								F.insertFeedInfo( catData.freshCat.display_name, catData.freshCat.display_url, catData.freshCat.rss_url );
							}
						});
					}
					
					if ( !l ) {
						// console.log( 'was no feed' );
						F.showMalformedInputWarning( feedOb.$url.next( '.error' ), feedOb.$url, 'url does not point to a feed' );
						delete S.stopAction.addFeed;
					}
				});
				
			},
			
			addInitIgnoredUrls: function( id, url ) {
				/**
				* description
				*
				* @called : addFeedIfExists
				*
				* @group : utility / get posts from db / get posts from web
				* @page : settings
				*
				* @params {int} - id : the WP category id
				* @params {url string} - url : the original article's outside url
				*/
				
				var feed = new google.feeds.Feed( url );
				
				feed.setNumEntries( 30 );
				
				feed.load( function( feeds ) {
					var i = 0,
							ignoredUrls = [],
							rawEntries = feeds.feed.entries,
							l = rawEntries.length;
							
					if ( l > 2 ) {
						rawEntries = rawEntries.slice( 2, l );
						l = l - 2;
					} else {
						return;
					}
					
					for ( i; i < l; i = i + 1) {
						ignoredUrls[ i ] = rawEntries[ i ][ 'link' ];
					}
					
					S[ 'fresh' ][ 'cats' ][ 'cat' + id ][ 'ignore' ] = ignoredUrls;
					
					$.ajax({
						type: 'POST',
						url: C.ajaxUrl,
						data: {
							action: 'user_add_or_remove_ignored_urls',
							catId: id,
							urls: ignoredUrls
						}
					});
				});
				
			},
			
			articleRefreshTransition: function() {
				/**
				* description
				*
				* @called : click ev on #refresh
				*						keydown ev on #jumpToBatch
				*						click ev on #previousBatch, #nextBatch
				* @calls : togglePageLoadingIcon
				*
				* @group : get posts from db / get posts from web / sub nav
				* @page : settings
				*/
				
				$( '#articleSection' ).velocity(
					{ opacity: 0 },
					{ duration: 300,
						complete: function() {
							$( this ).remove();
							F.togglePageLoadingIcon();
						}
					}
				);
				
			},
			
			askWantsTutorial: function() {
				/**
				* description
				*
				* @called : trySignInOrRegisterUser
				* @calls : toggleSplashAbout
				*
				* @group : tutorial
				* @page : splash / editor line
				*/
				
				var $ask4Tut,
						$ask4TutWrapper,
						delayDur,
						$skippedTut,
						$skippedTutWrapper;
						
				$ask4Tut = '<h1>Success.</h1>' + 
									 '<p>Fresh links use RSS feed URLs to deliver your articles. ' +
									 	 '<strong>It\'s really easy.</strong> All you need to do to copy and paste ' +
										 'a web address:' +
									 '</p>' +
									 '<ul>' +
									 	 '<li class="buttonWrap sky">' +
											 '<button id="signUpTutorial" class="sky" type="button">Tutorial</button>' +
										 '</li>' + 
										 '<li class="buttonWrap sky">' + 
											 '<button id="skip" class="sky" type="button">Skip</button>' +
										 '</li>' +
									 '</ul>';
									 
				$skippedTut = '<h1>That\'s fine.</h1>' +
									 		'<p>Input the URL\'s within the <span class="settings"></span> ' +
									 			'(settings) menu. The tutorial is available in the ' +
									 			'<strong>info</strong> menu.' +
									 		'</p>' +
									 		'<ul class="continueWrap">' +
									 			'<li class="buttonWrap sky">' +
									 				'<button id="continue" class="sky">Continue</button>' +
									 			'</li>' +
									 		'</ul>';	
									 
				$ask4TutWrapper = $El.splashAboutWrap.hasClass( 'showAbout' ) ? $El.rectFront : $El.rectTop;
				
				// length of toggleSplashAbout animation transitions
				delayDur = ( C.doCubeFlipAnimation ? 1000 : 200 );
		
				$skippedTutWrapper = $El.splashAboutWrap.hasClass( 'showAbout' ) ? $El.rectTop : $El.rectFront;
				
				$ask4TutWrapper
					.empty()
					.append( $( $ask4Tut ) );
								
				F.toggleSplashAbout();
				
				window.setTimeout( function() { 
					$skippedTutWrapper.empty()
						.append( $( $skippedTut ) );
				}, delayDur );
						
			},
			
			bindUiActions: function() { 
				/**
				* description
				*
				* @called : loadTemplatePartIntoFrame,
				*						init
				* @calls : many
				*
				* @group : init
				* @page : all
				*/
				
				if ( S.isUserLoggedIn ) {
					
					$El.main.on( C.click, '#userSettings .toTop', function() {
						$( '#userSettings' )
							.velocity(
								'scroll',
								{ duration: 450,
									container: $( '#currentMainSectionWrap' )
								}
						);
					});
					
					$El.main.on( C.click, '#settingsNav a', function() {
						var $elem = $( this ).attr( 'href' );
						
						$( $elem )
							.velocity(
								'scroll',
								{ duration: 450,
									container: $( '#currentMainSectionWrap' )
								}
						);
					});
					
					$El.main.on( C.mouseenter + ' touch', '.expandablePostHeader', function( e ) {
						var $this;
						
						if( C.hastouch && e.type === 'mouseenter' ) {
							return;
						}
						
						$this = $( this );
						
						$this
							.addClass( 'animateDown' )
							.removeClass( 'animateUp' );
						
						if( e.type === 'touch' ) {
							window.setTimeout( function() {
								$this
									.addClass( 'animateUp' )
									.removeClass( 'animateDown' );
							}, 100);
						}
					});
					
					$El.main.on( C.mouseleave, '.expandablePostHeader', function( e ) {
						if( C.hastouch ) {
							return;
						}
						
						$( this )
							.addClass( 'animateUp' )
							.removeClass( 'animateDown' );
						
					});
					
					$El.main.on( C.click, '#refresh', function() {
						/**
						* description
						*
						* @calls : articleRefreshTransition,
						*					 getNewArticles
						*
						* @group : get posts from web
						* @page : settings
						*/
						
						F.articleRefreshTransition();
						F.getNewArticles();
					});

					$( '#theTester' ).on( 'click', function() {
						/**
						* description
						*
						* @calls : 
						*
						* @group : 
						* @page : 
						*/
						
						// ?
						
						// F.updateBatchFeeds();
						// F.getOneMorePost();
					});

					$El.main.on( C.focus + ' ' + C.blur, '#jumpToBatch', function( e ) {
						/**
						* description
						*
						* @group : sub nav / interactive style
						* @page : timeline
						*/
						
						var newValue,
								oldValue;
								
						S.batchFeeds.isFocused = ( e.type === 'focusin' ? true : false );
						
						if ( S.batchFeeds.isFocused ) {
							S.batchFeeds.$jumpToBatch.val( '' );
						} else {
							oldValue = parseInt( S.batchFeeds.$jumpToBatch.val() );
							
							if ( isNaN( oldValue ) ) {
								newValue = S.batchFeeds.initValue;
								
							} else if ( oldValue > S.batchFeeds.batchCount ) {
								newValue = S.batchFeeds.batchCount;
								
							} else if ( oldValue === 0 ) {
								newValue = 1;
								
							} else {
								newValue = oldValue;
								
							}
							
							S.batchFeeds.initValue = newValue;
							S.batchFeeds.$jumpToBatch.val(newValue);
						}
						
					});
					
					$El.main.on( C.keydown, '#jumpToBatch', function( e ) {
						/**
						* description
						*
						* @calls : articleRefreshTransition,
						*					 loadTemplatePartIntoFrame
						*
						* @group : sub nav / get posts from db
						* @page : timeline
						*/
						
						var batchNum;
						
						if ( S.batchFeeds.keyCodes.indexOf( e.which ) === -1 ) {
							e.preventDefault();
							return;
						}
						
						if ( e.which === 13 ) {
							S.batchFeeds.$jumpToBatch.trigger( C.blur );
							
							if ( S.batchFeeds.initValue === S.batchFeeds.pageNum ) {
								return;
							}
							
							batchNum = S.batchFeeds.$jumpToBatch.val();
							
							F.articleRefreshTransition();
							F.loadTemplatePartIntoFrame( 'articles', $El.currentMainSectionWrap, S.batchFeeds.articleType, batchNum );
						}
						
					});
					
					$El.main.on( C.click, '#previousBatch, #nextBatch', function() {
						/**
						* description
						*
						* @calls : articleRefreshTransition,
						*					 loadTemplatePartIntoFrame
						*
						* @group : sub nav / get posts from db
						* @page : timeline
						*/
						
						var batchNum,
								id = $( this ).attr( 'id' ),
								leftCompare = ( id === 'nextBatch' ? S.batchFeeds.initValue : S.batchFeeds.pageNum ),
								rightCompare = ( id === 'nextBatch' ? S.batchFeeds.pageNum : S.batchFeeds.initValue ),
								pageNumChange = ( id === 'nextBatch' ? 1 : -1 );
						
						if ( leftCompare > rightCompare ) {
							batchNum = S.batchFeeds.initValue;
						} else {
							batchNum = S.batchFeeds.pageNum + pageNumChange;
						}
						
						F.articleRefreshTransition();
						F.loadTemplatePartIntoFrame( 'articles', $El.currentMainSectionWrap, S.batchFeeds.articleType, batchNum );
					});
					
					$( '#rssSearchPopUp' ).on(C.focus, '.malformed', function() {
						/**
						* description
						*
						* @calls : hideMalformedInputWarning
						*
						* @group : 
						* @page : 
						*/
						
						var $input = $( this ),
								$error = $input.next();
						
						F.hideMalformedInputWarning( $input, $error );
					});
					
					$El.main.on( C.focus, '.malformed', function() {
						/**
						* description
						*
						* @calls : hideMalformedInputWarning
						*
						* @group : 
						* @page : settings / faq
						*/
						
						var $input = $( this ),
								$error = $input.next();
						
						F.hideMalformedInputWarning( $input, $error );
					});
					
					$( '#deletePostsPopUp .deny, #rssSearchPopUp .deny, #cancelFeedPopUp .deny, #deleteAccountPopUp .deny, #deletePostPopUp .deny, #tourModePopUp .deny' )
						.on(C.click, function() {
						/**
						* description
						*
						* @calls : hidePopUp
						*
						* @group : pop ups
						* @page : timeline / settings
						*/
						
							F.hidePopUp();
						});
					
					$El.main.on( C.click, '#infoSearch', function() {
						/**
						* description
						*
						* @calls : searchWebForFeeds
						*
						* @group : 
						* @page : 
						*/
						
						var query = $( this ).parent().prev().val();
						
						F.searchWebForFeeds( query );
					} );
					
					$El.main.on( C.click, '.expandableButton, .postHeaderText', function( e ) {
						/**
						* description
						*
						* @calls : getAnimationDuration,
						*					 togglePostButton,
						*					 togglePostContent,
						*					 getPostFromDb,
						*					 getPostFromWeb
						*
						* @group : toggle post / get posts from web / get posts from db
						* @page : timeline
						*/
						
						var animationDuration,
								$this = $( this ),
								id,
								isOnInfoPage = ( $this.hasClass( 'expandableButton' ) ? true : false ),
								$header = ( isOnInfoPage ? $this.parent().parent() : $this.parent() ),
								height = 0,
								$post,
								$expandableContentWrap = $header.next(),
								isPostOpen = ( $expandableContentWrap.hasClass( 'open' ) ? true : false );
						
						e.preventDefault();
						
						
						$expandableContentWrap.children().each( function() {
							height = height + $( this ).outerHeight();
						});
						
						height = ( isOnInfoPage ? height : height + 65 );
						
						animationDuration = F.getAnimationDuration( height, 900 );
						
						if ( !isPostOpen ) {
							F.togglePostButtonCorners( $header );
						}
						
						F.togglePostContent( $expandableContentWrap, height, isOnInfoPage );
						
						if ( !isOnInfoPage && !isPostOpen && $expandableContentWrap.hasClass( 'empty' ) ) {
							$post = $header.parent();
							
							F.getPostFromWeb( $post );
						}
					});
				
					$El.main.on( C.click, '.closePost', function( e ) {
						/**
						* description
						*
						* @calls : getAnimationDuration,
						*					 togglePostContent,
						*					 togglePostButton
						*
						* @group : toggle post
						* @page : timeline
						*/
						
						var animationDuration,
								$expandableContentWrap = $( this ).parentsUntil( '.postWrap' ),
								height = 0;
						
						e.preventDefault();
						
						$expandableContentWrap
							.children()
								.each( function() {
									height = height + $( this ).outerHeight();
								}
						);

						
						
						F.togglePostContent( $expandableContentWrap, height );
					});
					
					$El.main.on( C.click, '.saveAndDeleteWrap .save, .saveAndDeleteWrap .trash', function() {
						/**
						* description
						*
						* @calls : deleteOrSavePost
						*
						* @group : save posts / delete posts
						* @page : timeline
						*/
						
						var $this = $( this ),
								$post = $this.parentsUntil( '.postWrap' ).parent(),
								action = ( $this.hasClass( 'save' ) ? 'save' : 'trash' );
								
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
							
							return;
						}
						
						F.deleteOrSavePost( $post, action );
					});

					$El.contentWrap.on( C.click, '.saveOrEditFeed.save', function() {
						/**
						* description
						*
						* @calls : tryToEditExisitingCatName
						*
						* @group : add feed
						* @page : settings
						*/
						
						var $feedInfo = $( this ).parent().parent(),
								$existingFeedTitle = $feedInfo.find( '.existingFeedTitle' ),
								response;
								
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
					
							return;
						}
								
						if ( $existingFeedTitle.hasClass( 'malformed' ) ) {
							return;
						}
						
						F.tryToEditExisitingCatName( $feedInfo );
					});
					
					$El.contentWrap.on( C.click, '.saveOrEditFeed.edit', function() {
						/**
						* description
						*
						* @calls : isUnsavedFeedInfoEdited,
						*					 revertUnsavedFeedInfo,
						*					 makeFeedInfoEditable,
						*					 makeFeedInfoNonEditable
						*
						* @group : interactive style / add feed / delete feed
						* @page : settings
						*/
						
						var $canEdit = $( this ).parent().parent(),
								$canSave = $canEdit.siblings( '.canSave' ),
								duration = 0, // length of time for revertUnsavedFeedInfo()
								returned;
								
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
					
							return;
						}
								
						if ( $canSave.length ) {
							returned = F.isUnsavedFeedInfoEdited( $canSave );
							duration = ( returned ? 300 : 0 );
							
							if ( returned ) {
								// has been edited. returned is an object.
								F.revertUnsavedFeedInfo( returned );
								duration = 300;
							}
							
							window.setTimeout( function() {
								F.makeFeedInfoEditable( $canEdit );
								F.makeFeedInfoNonEditable( $canSave );
							}, duration );
							
						} else {
							F.makeFeedInfoEditable( $canEdit );
						}
					});

					$El.contentWrap.on( C.click, '#deleteAccount', function() {
						/**
						* description
						*
						* @calls : showPopUp
						*
						* @group : pop ups
						* @page : settings
						*/
						
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
							
							return;
						}
						
						F.showPopUp( 'deleteAccount' );
					});
					
					$( '#deleteAccountPopUp' ).on( C.click, '.confirm', function() {
						/**
						* description
						*
						* @calls : deleteAccount
						*
						* @group : delete user
						* @page : settings
						*/
						
						// delete account
						F.deleteAccount();
					});

					$El.contentWrap.on( C.click, '.feedInfo .trash', function() {
						/**
						* description
						*
						* @calls : showPopUp,
						*					 removeFeed,
						*					 deleteCategory
						*
						* @group : delete feed / pop ups
						* @page : settings
						*/
						
						// note: structure to remain static for selector
						var $feedInfo = $( this ).parent().parent(),
								displayName = $feedInfo.data( 'feed_name' );
								
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
					
							return;
						}
								
						if ( S.doesWarnFreshCategoryDrop ) {
							S.genericPopUpArg.$feedInfo = $feedInfo;
							S.genericPopUpArg.displayName = displayName;
							
							F.showPopUp( 'cancelFeed' );
						} else {
							F.removeFeed( $feedInfo );
							F.deleteCategory( displayName );
						}
					});
					
					$( '#cancelFeedPopUp .confirm' ).on( C.click, function() {
						/**
						* description
						*
						* @calls : hidePopUp,
						*					 removeFeed,
						*					 deleteCategory
						*
						* @group : delete feed
						* @page : settings
						*/
						
						F.hidePopUp();
						
						setTimeout( function() {
							F.removeFeed( S.genericPopUpArg.$feedInfo );
							F.deleteCategory( S.genericPopUpArg.displayName );
							S.genericPopUpArg = {};
						}, 600 );
						
					});
					
					$( '#cancelFeedPopUp [type="checkbox"] + .style' ).on( C.click, function() {
						/**
						* description
						*
						* @calls : updateOneSetting
						*
						* @group : pop ups
						* @page : settings
						*/
						
						S.doesWarnFreshCategoryDrop = ( S.doesWarnFreshCategoryDrop ? false : true );
						
						F.updateOneSetting( S.doesWarnFreshCategoryDrop, 'does_warn_fresh_category_drop' );
					});

					$El.contentWrap.on( C.mousedown, '#rangePit', function( e ) {
						/**
						* description
						*
						* @calls : changeGripPosition,
						*					 getLeftDrag
						*
						* @group : interactive style / freshness limit
						* @page : settings
						*/
						
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
							
							return;
						}
						
						F.changeGripPosition( F.getLeftDrag( e.pageX ) );
						
						$El.html.on( C.mousemove, function( ev ) {
							F.changeGripPosition( F.getLeftDrag( ev.pageX ) );
						} );
					
						$El.html.on( C.mouseleave, function( ev ) {
							F.stopDrag( F.getLeftDrag( ev.pageX ) );
						} );
					
						$El.html.on( C.mouseup, function( ev ) {
							F.stopDrag( F.getLeftDrag( ev.pageX ) );
						} );
					});
					
					$El.contentWrap.on( C.click, '#settingsNav > a', function( e ) {
						/**
						* description
						*
						* @calls : scrollSectionTo
						*
						* @group : sub nav
						* @page : settings
						*/
						
						var articleId = $( this ).attr( 'href' );
						
						e.preventDefault();
						F.scrollSectionTo( $( articleId ) );
					});
					
					$El.contentWrap.on( C.click, '.toTopButton', function( e ) {
						/**
						* description
						*
						* @calls : scrollSectionTo
						*
						* @group : sub nav
						* @page : settings
						*/
						
						e.preventDefault();
						
						F.scrollSectionTo( 0 );
					});
					
					$El.contentWrap.on( C.click, '.launchTutorial', function() {
						/**
						* description
						*
						* @calls : launchTutorial
						*
						* @group : tutorial
						* @page : all but splash
						*/
						
						F.launchTutorial();
					});

					$El.main.off( C.click, '#nextSlide, #previousSlide' ).on( C.click, '#nextSlide, #previousSlide', function() {
						/**
						* description
						*
						* @calls : changeTutorialSlide
						*
						* @group : tutorial
						* @page : all but splash
						*/
						
						var int = $( this ).data( 'adjust' );
						
						if ( ( int + S.tutorialSlideIndex < 0 ) || ( int + S.tutorialSlideIndex > 4 ) ) {
							return;
						}
						
						F.changeTutorialSlide( int );
					});
					
					$El.main.off( C.click, '.closeTutorial' ).on( C.click, '.closeTutorial', function() {
						/**
						* description
						*
						* @calls : closeTutorial
						*
						* @group : tutorial
						* @page : all but splash
						*/
						
						F.closeTutorial();
					} );
					
					// F.transitionToSection( section )
					$( '#homeNav' ).on( C.click, '.buttonWrap', function() {
						/**
						* description
						*
						* @calls : transitionToSection,
						*					 toggleMobileNav
						*
						* @group : main nav
						* @page : all but splash
						*/
						
						var articleType,
								$this = $( this ),
								newSectionId = $this.data( 'section_id' ),
								templatePart; // section is the template part
						
						if ( S.currentSection === newSectionId ) {
							return;
						}
						
						S.currentSection = newSectionId;
						
						$this
							.siblings( $( '.clicked' ) )
							.removeClass( 'clicked' )
							.end()
							.addClass( 'clicked' );
						
						if ( newSectionId === 'newArticleSection' ) {
							templatePart = 'articles';
							
						} else if ( newSectionId === 'savedArticleSection' ) {
							templatePart = 'articles';
							articleType = 'frozen';
							
						} else if ( newSectionId === 'infoSection' ) {
							templatePart = 'info';
							
						} else {
							templatePart = 'settings';
							
						}
						
						F.transitionToSection( templatePart, articleType );
						
						if ( S.vpWidth < 500 ) {
							F.toggleMobileNav();
						}
					});	
				
					// F.errorCheckUrlAndName
					$El.contentWrap.on( C.click, '#createFeed', function() {
						/**
						* description
						*
						* @calls : errorCheckName,
						*					 showMalformedInputWarning,
						*					 normalizeUrl,
						*					 addFeedIfExists
						*
						* @group : add feed
						* @page : settings
						*/
						
						var feedOb = {
									$addFeedsWrap: {},
									additionalAction: '',
									$name: $( '#newFeedTitle' ),
									// !* doesMakeFrozenCat: false,
									nameVal: '',
									$url: $( '#newFeedUrl' ),
									urlVal: ''
								},
								nameTestResults,
								urlTestResults;
								
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
					
							return;
						}
								
						if ( feedOb.$name.hasClass( 'malformed' ) || feedOb.$url.hasClass( 'malformed' ) || S.stopAction.addFeed ) {
							return;
						}
						
						S.stopAction.addFeed = true;
						
						feedOb.$name.blur();
						feedOb.$url.blur();
						
						feedOb.$addFeedsWrap = $( '#addFeedsWrap' );
						
						feedOb.nameVal = $.trim( titleCaps( feedOb.$name.val() ) );
						
						nameTestResults = F.errorCheckName( feedOb.nameVal );
						
						if ( nameTestResults !== true ) {
							// returned an error message

							F.showMalformedInputWarning( feedOb.$name.next( '.error' ), feedOb.$name, nameTestResults );
							
							delete S.stopAction.addFeed;
							
							return;
						}
						
						feedOb.urlVal = F.normalizeUrl( feedOb.$url.val() );
						
						if ( !feedOb.urlVal ) {
							F.showMalformedInputWarning( feedOb.$url.next( '.error' ), feedOb.$url, 'malformed url!' );
							
							delete S.stopAction.addFeed;
							
							return;
						}
						
						urlTestResults = F.errorCheckUrl( feedOb.urlVal );
						
						if ( $.isPlainObject( urlTestResults ) ) {
							F.addFeedIfExists( feedOb );
						} else {
							// returned an error message
							F.showMalformedInputWarning( feedOb.$url.next( '.error' ), feedOb.$url, urlTestResults );
							
							delete S.stopAction.addFeed;
						}
					});
					
					$El.contentWrap.on( C.keypress, '', function( e ) {
						/**
						* description
						*
						* @calls : triggers click ev on #createFeed
						*
						* @group : 
						* @page : 
						*/
						
						// why is this a live ev? this looks bad
						
						if ( e.which === 13 && !S.stopAction.addFeed ) {
							$( '#createFeed' ).trigger( C.click );
						}
					});

					// F.radioToggle
					
					$El.daysFreshWrap.on( C.click, 'input', function() {
						/**
						* description
						*
						* @calls : radioToggle,
						*					 updateOneSetting
						*
						* @group : 
						* @page : settings
						*/
						
						
						var $target = $( this ),
								$inputs = $El.daysFreshWrap.find( $( 'input' ) ),
								$others = $inputs.not( $target );
						
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
					
							return;
						}
						
						F.radioToggle( $target, $others );
						
						S.freshnessLimit = $inputs.index( $target ) + 1;
						
						F.updateOneSetting( ( S.freshnessLimit * 60 * 60 * 24 ), 'freshness_limit' );
					});
					
					// F.searchWebForFeeds
					$El.searchWebForFeeds.on( C.click, function() {
						/**
						* description
						*
						* @calls : searchWebForFeeds
						*
						* @group : 
						* @page : settings
						*/
						
						var query = $( this ).closest( $( '#searchWebForFeedsWrap' ) ).find( 'input' ).val();
						
						F.searchWebForFeeds( query );
					});
					
					// F.setVpDimensions
					$El.window.on( 'resize', function() {
						/**
						* description
						*
						* @calls : setVpDimensions
						*
						* @group : init
						* @page : all
						*/
						var resizeTimer;
						
						F.setVpDimensions();
						
						clearTimeout( resizeTimer );
						
					});
					
					// F.toggleCheckBox
					$El.main.on( C.click, '#isBackgroundAnimating', function() {
						/**
						* description
						*
						* @calls : toggleCheckBox
						*
						* @group : interactive style / cloud animation
						* @page : settings
						*/
						
						var $checkbox = $( this );
						
						if ( C.isTour ) {
							return;
						}
						
						F.toggleCheckBox( $checkbox );
					});
					
					// F.toggleSettingsForm
					$El.toggleSettings.on( C.click, function() {
						/**
						* description
						*
						* @calls : toggleSettingsForm
						*
						* @group : 
						* @page : 
						*/
						
						// ? i don't think this exists
						
						F.toggleSettingsForm();
					});
					
					// F.updateBooleanSetting
					// NOTE: must come after F.toggleCheckBox
					$El.main.on( C.click, '#isBackgroundAnimating', function() {
						
						var bool = ( $( this ).attr( 'checked' ) ? false : true );
						
						if ( C.isTour ) {
							F.showPopUp( 'tourMode' );
							
							return;
						}
						
						S.isBackgroundAnimating = bool;
						
						F.toggleCloudAnimation( bool );
						// F.updateOneSetting(bool, 'is_background_animating');
					});
					
					// toggles the main nav menu
					// when screen is thin
					$El.main.on( C.click, '.menuButton', function() {
						/**
						* description
						*
						* @calls : toggleMobileNav
						*
						* @group : main nav
						* @page : all but splash
						*/
						
						F.toggleMobileNav();
					});
				
					$El.closeMobileNav.on( C.click, function() {
						/**
						* description
						*
						* @calls : toggleMobileNav
						*
						* @group : main nav
						* @page : all but splash
						*/
						
						F.toggleMobileNav();
					});
					
					

				} else {
					
					
					
					$( '#signUpPopUp, #loginPopUp' ).on( C.focus, '.malformed', function() {
						/**
						* description
						*
						* @calls : hideMalformedInputWarning
						*
						* @group : sign up || login
						* @page : splash
						*/
						
						var $input = $( this ),
								$error = $input.next();
						
						F.hideMalformedInputWarning( $input, $error );
					});
					
					$( '#signUpPopUp .deny, #loginPopUp .deny' ).on( C.click, function() {
						/**
						* description
						*
						* @calls : hidePopUp
						*
						* @group : pop ups
						* @page : splash
						*/
						
						F.hidePopUp();
					});
					
					$El.splashAboutBtn.on( C.click, function() {
						/**
						* description
						*
						* @calls : toggleSplashAbout
						*
						* @group : splash about
						* @page : splash
						*/
						
						F.toggleSplashAbout();
					});
					// F.hideMalformedInputWarning
					// nate: use this function on all form warnings
					
					$El.loginMenuButton.on( C.click, function() {
						/**
						* description
						*
						* @calls : showPopUp
						*
						* @group : pop ups
						* @page : splash
						*/
						
						F.showPopUp( 'login' );
					} );
					
					$El.signUpMenuButton.on( C.click, function() {
						/**
						* description
						*
						* @calls : showPopUp
						*
						* @group : pop ups
						* @page : splash
						*/
						
						F.showPopUp( 'signUp' );
					} );
					
					// transition to log-in || launch tutorial
					$( '#rectFront, #rectTop' ).on( C.click, '#signUpTutorial, #continue', function() {
						/**
						* description
						*
						* @calls : cubeTransToNothing,
						*					 launchTutorial,
						*					 transitionToLoggedIn
						*
						* @group : tutorial / sign up || login
						* @page : splash
						*/
						
						var delay = ( C.doCubeFlipAnimation ? 1000 : 200 ), // to make sure animation is complete
								thisId = $( this ).attr( 'id' );
						
						F.cubeTransToNothing();
						
						// shouldn't it be window.setTimeout ?
						setTimeout( function() {
							$El.splashAboutWrap
								.add( $('#splashNav') )
								.remove();
								
							if ( thisId === 'signUpTutorial' ) {
								F.launchTutorial();
							} else {
								F.transitionToLoggedIn( 'sign up' );
							}
						}, delay );
					});
					
					$El.main.on( C.click, '#nextSlide, #previousSlide', function() {
						/**
						* description
						*
						* @calls : changeTutorialSlide
						*
						* @group : tutorial
						* @page : splash
						*/
						
						var int = $( this ).data( 'adjust' );
						
						if ( ( int + S.tutorialSlideIndex < 0 ) || ( int + S.tutorialSlideIndex > 4 ) ) {
							return;
						}
						
						F.changeTutorialSlide( int );
					});
					
					$El.main.on( C.click, '.closeTutorial', function() {
						/**
						* description
						*
						* @calls : closeTutorial
						*
						* @group : tutorial
						* @page : splash
						*/
						
						F.closeTutorial();
					});

					$( '#rectFront, #rectTop' ).on( C.click, '#skip', function() {
						/**
						* description
						*
						* @calls : toggleSplashAbout
						*
						* @group : splash about
						* @page : splash
						*/
						
						F.toggleSplashAbout();
					});
					
					$( '#loginPopUp input[type="password"]' ).on( C.keypress, function( e ) {
						/**
						* description
						*
						* @calls : triggers $El.loginPopUpButton click ev
						*
						* @group : sign up / sign up || login
						* @page : splash
						*/
						
						if ( $( '#loginPopUp' ).hasClass( 'onScreen' ) &&
								 e.which === 13 &&
								 !S.stopAction.popUp )
						{
							S.stopAction.popUp = true;
							
							$( this ).blur();
							
							$El.loginPopUpButton.trigger( C.click );
						}
					});
					
					$El.loginPopUpButton.on( C.click, function() {
						/**
						* description
						*
						* @calls : trySignInOrRegisterUser
						*
						* @group : sign up || login
						* @page : splash
						*/
						
						var userName = $El.loginPopUp.find( $( 'input' ) ).eq( 0 ).val(),
								password = $El.loginPopUp.find( $( 'input' ) ).eq( 1 ).val(),
								args = {
									userName: $.trim( userName ),
									password: $.trim( password ),
									action: ( 'login_user' ),
									wrapper: $El.loginPopUp
								};
						
						F.trySignInOrRegisterUser( args );
					});
					
					$( '#signUpPopUp input[type="password"]' ).on( C.keypress, function( e ) {
						/**
						* description
						*
						* @calls : triggers $El.signUpPopUpButton click ev
						*
						* @group : sign up || login
						* @page : splash
						*
						* @see : $El.signUpPopUpButton click ev
						*/
						
						if ( $( '#signUpPopUp' ).hasClass( 'onScreen' ) &&
								 e.which === 13 &&
								 !S.stopAction.popUp )
						{
							S.stopAction.popUp = true;
							
							$( this ).blur();
							
							$El.signUpPopUpButton.trigger( C.click );
						}
					});
					
					$El.signUpPopUpButton.on( C.click, function() {
						/**
						* description
						*
						* @calls : trySignInOrRegisterUser
						*
						* @group : sign up || login
						* @page : splash
						*/
						
						var userName = $El.signUpPopUp.find( $( 'input' ) ).eq( 0 ).val(),
								password = $El.signUpPopUp.find( $( 'input' ) ).eq( 1 ).val(),
								args = {
									userName: $.trim( userName ),
									password: $.trim( password ),
									action: ( 'register_user' ),
									wrapper: $El.signUpPopUp
								};
								
						F.trySignInOrRegisterUser( args );
					});
				}
			},
			
			cacheEls: function() {
				/**
				* this caches frequently used elements as jquery objects.
				* different sets are cached if the user is logged in or not logged in.
				*
				* @called : init,
				*						loadTemplatePartIntoFrame
				*
				* @group : init
				* @page : all
				*/
				
				if ( S.isUserLoggedIn ) {
					$El.addNewFeedWrap = $( '#addNewFeedWrap' );
					$El.closeMobileNav = $( '#homeNavWrap > .close > .closeButton' );
					$El.contentWrap = $( '#contentWrap' );
					$El.currentMainSectionWrap = $( '#currentMainSectionWrap' );
					$El.daysFreshWrap = $( '#daysFreshWrap' );
					$El.dropUser = $( '#dropUser' );
					$El.feed = $( '#feed' );
					$El.homeNavWrap = $( '#homeNavWrap' );
					$El.searchWebForFeeds = $( '#searchWebForFeeds' );
					$El.settingsForm = $( '#settingsForm' );
					$El.toggleSettings = $( '#toggleSettings' );
					$El.titleTag = $( 'title' );
				} else {
					$El.login = $( '#login' );
					$El.register = $( '#register' );
					$El.rememberMe = $( '#rememberMe' );
					$El.signUp = $( '#signUp' );
					$El.splashAboutBtn = $( '#splashNav .about' );
					$El.rectTop = $( '#rectTop' );
					$El.rectFront = $( '#rectFront' );
					$El.splashAboutWrap = $( '#splashAbout' );
					$El.password = $( '#password' );
					$El.passwordError = $( '#passwordError' );
					$El.userName = $( '#userName' );
					$El.userNameError = $( '#userNameError' );
				}
			},
			
			changeGripPosition: function( left ) {
				/**
				* this changes the grip of the freshness slider
				* it also updates the database and label var#rangeResult.
				* if the pageX (left) is the same, end the function. endif;
				* create a non-string percent, this will be used to send to the database and update the text through updateGripTextAndDatabase.
				* change the style of the #rangeHandle. set its left to that of pageX.
				*
				* @called : mouse down ev on #rangePit,
				*						mouse move ev during mouse down ev on #rangePit
				* @calls : updateGripTextAndDatabase
				*
				* @group : freshness / interactive style
				* @page : settings
				*
				* @params {int} - left : e.pageX
				*/
				
				var leftPercent;
				
				if( left === S.range.pageX ){
					return;
				}
				
				S.range.pageX = left;
				
				leftPercent = left / S.range.maxLeft * 100;
				
				$( '#rangeHandle' ).css({
					left: Math.round( left )
				});
				
				F.updateGripTextAndDatabase( leftPercent );
			},
			
			changeTutorialSlide: function( int ) {
				/**
				* changes the tutorial slide
				*
				* @called : click ev on #nextSlide, #previousSlide
				*
				* @group : tutorial
				* @page : all but splash
				*
				* @params {int} - int : from the data attr 'adjust' on the left & right btns, 1 || -1
				*/
				
				var continuation,
						factor = Math.abs( .05 * int ),
						$count = $( '#findAFeed .progress var' ),
						$currentSlide = $( '.slide' + S.tutorialSlideIndex ),
						currentDist = Math.round( $currentSlide.width() * factor ),
						$nextSlide = $( '.slide' + ( S.tutorialSlideIndex + int ) ),
						nextDist = Math.round( $nextSlide.width() * factor );
						
				currentDist = ( int > 0 ? currentDist * -1 : currentDist );
				
				nextDist = ( int > 0 ? nextDist : nextDist * -1 );
				
				continuation = function() {
					if ( !S.tutorialSlideIndex ) {
						$( '#previousSlide' )
							.css( 'display', 'block' )
							.velocity(
								{ opacity: 1 },
								{ duration: 400 }
							);
					}
					
					if ( S.tutorialSlideIndex === 3 ) {
						$( '#exitToSiteWrap' )
							.velocity(
								{ opacity: 0 },
								{ duration: 400,
									complete: function() {
										$( '#exitToSiteWrap' )
											.css( 'display', 'none' );
									}
								}
						);
								
						$( '#nextSlide' )
							.css( 'display', 'block' )
							.velocity(
								{ opacity: 1 },
								{ duration: 400 }
						);
					}
					
					S.tutorialSlideIndex = S.tutorialSlideIndex + int;
					
					if ( !S.tutorialSlideIndex ) {
						$( '#previousSlide' )
							.velocity(
								{ opacity: 0 },
								{ duration: 400,
									complete: function() {
										$( '#previousSlide' )
											.css( 'display', 'none' );
									}
								}
							);
					}
					
					if ( S.tutorialSlideIndex === 3 ) {								
						$( '#nextSlide' )
							.velocity(
								{ opacity: 0 },
								{ duration: 400,
									complete: function() {
										$( '#nextSlide' )
											.css( 'display', 'none' );
									}
								}
							);
							
		 				$('#exitToSiteWrap')
							.css( 'display', 'block' )
		 					.velocity(
								{ opacity: 1 },
		 						{ duration: 400 }
							);
					}
					
					$nextSlide
						.velocity(
							{ translateX: nextDist },
							{ duration: 0 }
						);
					
					$nextSlide
						.css( 'z-index', 'auto' )
						.velocity(
							{ translateX: 0,
								opacity: 1 },
							{ duration: 400 }
						);
											
				};
				
				if ( S.tutorialSlideIndex === 3 && int === 1 ) {
					// fade out counter
					$( '#findAFeed .progress' )
						.velocity(
							{ opacity: 0 },
							{ duration: 400 }
						);
						
				} else if ( S.tutorialSlideIndex === 4 && int === -1 ) {
					// fade in counter
					$( '#findAFeed .progress' )
						.velocity(
							{ opacity: 1 },
							{ duration: 400 }
						);
						
				} else {
					// change the number
					$count
						.velocity(
							{ opacity: 0 },
							{ duration: 400,
								complete: function() {
									$count
										.text( S.tutorialSlideIndex + 1 + int )
										.velocity(
											{ opacity: 1 },
											{ duration: 400 }
										);
								}
							}
						);
						
				}
				
				$currentSlide
					.velocity(
						{ translateX: currentDist + 'px',
							opacity: 0 },
						{ duration: 400,
							complete: function() {
								$currentSlide
									.velocity(
										{ translateX: 0 },
										{ duration: 0 }
									)
									.css( 'z-index', '-1' );
													
								continuation();
							}
						}
					);
					
			},
			
			cleanPost: function( $post, $wrap, url ) {
				/**
				* description
				*
				* @called : getPostFromWeb
				* @calls : preInsertPostInPage
				*
				* @group : toggle post
				* @page : timeline
				*
				* @params {html string} - $post : the dirty html string from the web
				* @params {jquery object} - $wrap : the article.postWrap it will be insterted in
				* @params {url string} - url : the url of the original post
				*/
				
				var $childEmbed,
						containerWidth = 650,
						$embeds,
						$output = $( '#output' ),
						$this,
						$src,
						c,
						height,
						i,
						j,
						l,
						tagName,
						width,
						wrap;
				
				
				
				closeUnclosedIframes = function( intPos ) {
					var backString,
							frontString,
							i,
							l = $post.length,
							pos = $post.toLowerCase().indexOf( '<iframe', intPos ),
							testString;

					if ( pos === -1 ) {
						$( 'pre' )
							.text( $post );
						return;
					}
					
					// close of the opening tag
					pos = $post.indexOf( '>', pos + 7 );

					if ( ( pos + 1 ) === l ) {
						// unclosed iframe is the last substring
						
						$post = $post + '</iframe>';
						
						$( 'pre' )
							.text( $post );
						
						return;
					}
		
					for ( i = pos + 1; i < l; i = i + 1 ) {
						if ( $post[ i ] !== ' ' ) {
							pos = i;
							break;
						}
					}
		
					if ( pos + 5 >= l ) {
						// unclosed iframe is almost the last substring
						// w.out enough room for there to be a closing tag
						
						// substract 1 so it cuts in the white space
						frontString = $post.substring( 0, pos );
						backString = $post.substring( pos, l );
						$post = frontString + '</iframe>' + backString;
						$( 'pre' )
							.text( $post );
						
						return;
					}
		
					testString = $post.substring( pos, pos + 5 ).toLowerCase();

					if ( ( testString !== '<?xml' ) && ( testString !== '<!doc' ) && ( testString !== '</ifr' ) ) {
						
						// substract 1 so it cuts in the white space
						frontString = $post.substring( 0, pos );
						backString = $post.substring( pos, l );
						$post = frontString + '</iframe>' + backString;
					}
					
					closeUnclosedIframes( pos );
				};
				
				if ( $post.toLowerCase().indexOf( "<iframe" ) !== -1 ) { 
					closeUnclosedIframes( 0 );
				}

				$post = $( $post );
				
				
				var setCustomErrorMessage = function() {
					var message = $post.text(),
							errorMEssage;
					
					if ( message === "sorry...I couldn't get anything. This link points to the original page." ) {
						errorMEssage = '' +
							'<div>' +
								'<h2>Whoops...</h2>' +
								'<p>I couldn\'t find anything. Sorry.</p>' +
								'<p>This could\'ve happened for a few reason:</p>' +
								'<ul>' +
									'<li>You are disconnected from the internet</li>' +
									'<li>I couldn\'t find the main content</li>' +
									'<li>The page you wanted poorly constructed</li>' +
									'<li>They have a firewall preventing services like this</li>' +
									'<li>The page you wanted was all ads</li>' +
								'</ul>' +
								'<p>Try opening and closing this post. If that doesn\'t work click \'source\' below to take you to the site you were looking for.</p>'
							'</div>';
						
						$post = $( errorMEssage );
					}
				}
				setCustomErrorMessage();
				
				var removeNonSourcedElems = function() {
					var $sourcedElems = $post.find( 'img, iframe, audio, source' ),
							$nonSourcedElems;
					
					$nonSourcedElems = $sourcedElems.filter( function( index ) {
						return $( this ).attr( 'src' ) === undefined;
					});
					
					if ( $nonSourcedElems.length ) {
						$nonSourcedElems
							.remove();
					}
				};
				removeNonSourcedElems();
				
				var removeUnpermittedElems = function() {
					var $unpermittedElems = $post.find('script, style, .hidden,' +
						'[id~="gallery"], [id~="slideShow"], [id~="slideshow"], [id~="slide-show"], [id~="slide_show"], [class~="gallery"], [class~="slideShow"], [class~="slideshow"], [class~="slide_show"], ' +
						'[id$="_gallery"], [id$="_slideShow"], [id$="slideshow"], [id$="slide-show"], [class$="_slide_show"], [class$="_gallery"], [class$="_slideShow"], [class$="_slideshow"], ' + 
						'[id^="gallery-"], [id^="slideShow-"], [id^="slideshow-"], [id^="slide-show-"], [class^="slide_show-"], [class^="gallery-"], [class^="slideShow-"], [class^="slideshow-"], ' + 
						'[id^="gallery_"], [id^="slideShow_"], [id^="slideshow"], [id^="slide-show"], [class^="slide_show_"], [class^="gallery_"], [class^="slideShow_"], [class^="slideshow_"]' + 
						'[id~="ad"], [id~="ads"], [id~="advertisement"], [id~="advertisements"], [class~="ad"], [class~="ads"], [class~="advertisement"], [class~="advertisements"], ' + 
						'[id$="-ad"], [id$="-ads"], [id$="-advertisement"], [id$="-advertisements"], [class$="-ad"], [class$="-ads"], [class$="-advertisement"], [class$="-advertisements"], ' + 
						'[id$="_ad"], [id$="_ads"], [id$="_advertisement"], [id$="_advertisements"], [class$="_ad"], [class$="_ads"], [class$="_advertisement"], [class$="_advertisements"], ' + 
						'[id^="ad-"], [id^="ads-"], [id^="advertisement-"], [id^="advertisements-"], [class^="ad-"], [class^="ads-"], [class^="advertisement-"], [class^="advertisements-"], ' + 
						'[id^="ad_"], [id^="ads_"], [id^="advertisement_"], [id^="advertisements_"], [class^="ad_"], [class^="ads_"], [class^="advertisement_"], [class^="advertisements_"]' );
					
					if ( $unpermittedElems ) {
						$unpermittedElems
							.remove();
					}
				};
				removeUnpermittedElems();
				
				var removeBadAnchors = function() {
					var $anchors = $post.find( 'a' ),
							$badAnchors;
					
					$badAnchors = $anchors.filter( function( index ) {
						return $( this ).attr( 'href' ) === undefined || $( this ).attr( 'href' ) === '#' || $( this ).attr( 'href' ) === '';
					});
					
					$badAnchors.each( function() {
						var $this = $( this ),
								content = $this.html();
						//var $children = $this.children();
						if ( !$.trim( content ) ) {
							$this.remove();
						} else {
							$this.replaceWith( content );
						}
					});
				};
				removeBadAnchors();
				
				var unwrapAnchoredImgs = function() {
					var $anchors = $post.find( 'a' ),
							$badAnchors;
							
					$badAnchors = $anchors.filter( function( index ) {
						var $this = $( this ),
								$children = $this.children(),
								tagname;
								
						if ( $children.length === 1 ) {
							tagname = $children[ 0 ].tagName.toLowerCase();
							
							if ( tagname === 'img' ) {
								return this;
							}
						}
					});
					
					$badAnchors.each( function() {
						var $this = $( this );
						
						$this.replaceWith( $this.html() );
					});
				};
				unwrapAnchoredImgs();

				var wrapUnwrappedText = function() {
					$post
				  	.contents()
				  	.filter( function() {
				    	return this.nodeType !== 1;
				  	})
				  	.wrap( "<p />" );
				};
				wrapUnwrappedText();

				var removeEmptyElems = function() {
					var $emptyElems;
					
					$emptyElems = $post.find( '*' )
						.not( 'area, br, command, embed, hr, img, input, th, td, iframe, object, param, audio, video, source' )
						.filter( function() {
							var $this = $( this );
							
							if (	!$this.children().length && !$.trim( $this.text() ) ) {
								return $this;
							}
						}
					);
	
					if ( !$emptyElems.length ) {
						return;
					}
					
					$emptyElems
						.remove();
					
					removeEmptyElems();
					
				};
				removeEmptyElems();

				var removeUnwantedAttrs = function() {
					var unwantedAttrs,
							$elemsWithAttr,
							i = 0,
							l;
							
					unwantedAttrs = [ "class", "id", "style", "action", "align", "bgcolor", "border", "cellpadding", "cellspacing", "frame", "rules", "summary", "onclick", "ondblclick",
														"onerror", "onblur", "onchange", "onfocus", "oninput", "onkeydown", "onkeypress", "onkeyup", "onload", "onmousedown", "onmouseenter", "onmouseleave",
														"onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onresize", "onscroll", "onselect", "onsubmit"];

					l = unwantedAttrs.length;
					
					for ( i; i < l; i = i + 1 ) {
						$elemsWithAttr = $post.find( '[' + unwantedAttrs[ i ] + ']' );
						
						if ( $elemsWithAttr.length ) {
							$elemsWithAttr.removeAttr( unwantedAttrs[ i ] );
						}
					}
				};
				removeUnwantedAttrs();

				var wrapTables = function(){
					var $tables = $post.find( 'table' );
					
					if ( $tables ) {
						$tables
							.removeAttr( 'height ')
							.removeAttr( 'width' )
							.wrap( '<div class="tableWrap" />' );
					}
				};
				wrapTables();

				var removeBlockquoteWraps = function() {
					/*
		
						this function has two parts
	
						part one: removing excess wrappings around <blockquote>s
		
						it takes all non-first child blockquotes.
						it gets all of it's parents until the outer-most wrapper.
						it checks two things, either of which will disqualify it:
							• does it have any siblings (all empty siblings by now have been destroyed)
							• does the current <blockquote> have the same text value as the highest parent?
								this prevents any unwrapped text from being destroyed.
						if it passes those each parent layer is unwrapped.
	
	
						part two: adding classes based on length
		
						this prevents any bizarre / unreadable styling.
						it catches any <pre>s or <code>s and wraps it.
						it adds a class if the <blockquote> is long and wraps it if it's too
						long to have the cloud background.
		
					*/
	
	
	
					var $blockquote,
							$blockquotes,
							$blockquoteParent,
							$blockquoteParents,
							blockquoteText,
							doUnwrap;
							
					$blockquotes = $post
													.find( 'blockquote' )
													.not( $post.children( 'blockquote' ) );
							
					l = $blockquotes.length;
	
					// first part: removing excess <blockquote> wrappers
					if ( l ) {
						for ( i = 0; i < l; i = i + 1 ) {
							$blockquote = $blockquotes.eq( i );
							blockquoteText = $.trim( $blockquote.text() );
							$blockquoteParents = $blockquote.parentsUntil( $( '#input' ) );
							
							c = $blockquoteParents.length;
							doUnwrap = true;
			
							if ( $.trim( $blockquoteParents.eq( c - 1 ).text() ) !== blockquoteText ) {
								doUnwrap = false;
							} else {
								for ( j = 0; j < c - 1; j = j + 1 ) {
									$blockquoteParent = $blockquoteParents.eq( j );
										// if it's not the highest parent
									if ( $blockquoteParent.siblings().length ) {
										doUnwrap = false;
										break;
									}
								}
							}
			
							if ( doUnwrap ) {
								for ( j = 0; j < c; j = j + 1 ) {
									$blockquote.unwrap();
								}
							}
						}
					}
				};
				removeBlockquoteWraps();

				var formatBlockquotes = function() {
					var $blockquote,
							blockquoteWordCount,
							doWrapBlockquote,
							$firstChildBlockquotes = $post.children( 'blockquote' );
					
					l = $firstChildBlockquotes.length;
					
					if ( l ) {
						for ( i = 0; i < l; i = i + 1 ) {
							$blockquote = $firstChildBlockquotes.eq( i );
			
							doWrapBlockquote = ( $blockquote.find( $( 'pre, code, samp, table, img, video, audio, iframe, object, embed, svg, blockquote' ) ).length ? true : false );
							
							blockquoteWordCount = ( !doWrapBlockquote ? $blockquote.text().length : 0 );
			
							if ( doWrapBlockquote ) {
								$blockquote.addClass( 'baseStyle' );
							}
			
							if ( blockquoteWordCount >= 500 ) {
								$blockquote.addClass( 'veryLongBlockquote' );
							}
			
							if ( doWrapBlockquote || blockquoteWordCount >= 500 ) {
								$blockquote.wrap( '<div />' );
							} else if ( blockquoteWordCount > 250 ) {
								$blockquote.addClass( 'longBlockquote' );
							}
						}
					}
				};
				formatBlockquotes();
				
				var removeInPageAnchors = function() {
					var i = 0,
							l,
							$anchors;
							
					$anchors = $post
						.find( 'a[href]' )
						.filter( function() {
							var $this = $( this ),
									href = $this.attr( 'href' );
								
							if ( href[ 0 ] === '#' ) {
								return $this;
							}		
						}
					);
										
					l = $anchors.length;
					
					if ( l ) {
						for ( i; i < l; i = i + 1 ) {
							$anchors
								.eq( i )
									.contents()
									.unwrap();
						}
					}
				};
				removeInPageAnchors();
				
				$post
					.find( 'a[href]' )
					.attr( 'target', '_blank' );

				var relativeToAbsoluteSrcs = function() {
	
					/*
					you need to test if the given url (via arg) has a file or hash, etc at the end.
					*/
					var $relativeSrcs;
					
					$relativeSrcs = $post
						.find( '[src], [href], object[data], param[value$=".swf"]' )
						.filter( function() {
						// this is to get all site and directory relative srcs
						// it ignores all absolute url and protocol relative srcs
							var first4,
									first2,
									$this = $( this ),
									src = $this.attr( 'src' );
				
							if ( src === undefined ) {
								src = $this.attr( 'href' );
								
								if ( src === undefined ) {
									src = $this.attr( 'data' );
									
									if ( src === undefined ) {
										src = $this.attr( 'value' );
									}
								}
							}
		
						first4 = src
							.substr( 0, 4 )
							.toLowerCase();
							
						first2 = first4.substr( 0, 2 );
		
						if ( first4 !== 'http' && first2 !== '//' ) {
							return $this;
						}
					});
	
					if ( $relativeSrcs.length ) {
		
						$relativeSrcs.each( function() {
							var directory,
									domain,
									newSrc,
									protocol,
									subdomain,
									$this = $( this ),
									oldSrc = $this.attr( 'src' ),
									path = url,
									srcAttr = 'src';
					
							if ( oldSrc === undefined ) {
								oldSrc = $this.attr( 'href' );
								srcAttr = 'href';
								
								if ( oldSrc === undefined ) {
									oldSrc = $this.attr( 'data' );
									srcAttr = 'data';
									
									if ( oldSrc === undefined ) {
										oldSrc = $this.attr('value');
										srcAttr = 'value';
									}
								}
							}
			
							// removes leading slash
							oldSrc = ( oldSrc[ 0 ] !== '/' ? oldSrc : oldSrc.substring( 1 ) );
			
							try {
								newSrc = new URI( url );
								
								if ( newSrc.filename() || newSrc.hash() || newSrc.search() ) {
									protocol = newSrc.protocol();
									protocol = ( protocol ? protocol + '://' : '//' );
									subdomain = newSrc.subdomain();
									subdomain = ( subdomain ? subdomain + '.' : '' );
									domain = newSrc.domain();
									directory = newSrc.directory() + '/';
					
									path = protocol + subdomain + domain + directory;	
								}
								
								newSrc = new URI( path + oldSrc ).normalize();
							}
							catch ( e ) {
							   newSrc = path + oldSrc;
							}
			
							$this.attr( srcAttr, newSrc );
						});
					}
				};
				relativeToAbsoluteSrcs();

				var wrapMultimedia = function() {
					var $multimedia = $post.find( 'img, audio, video, svg, object[data$=".svg"]' );
					
					if ( $multimedia.length ) {
						$multimedia.wrap( '<span class="mediaWrap" />' );
					}
				};
				wrapMultimedia();

				var $result = $( '<div></div>' );

				var wrapPost = function( $result ) {
					var $firstChildren = $post.children(),
							$thePostWrap;
			
					l = $firstChildren.length
							
					for ( i = 0; i < l; i = i + 1 ) {
						$this = $firstChildren.eq( i );
						tagName = $this
							.prop( 'tagName' )
							.toLowerCase();
							
						if ( tagName === 'blockquote' ) {
							if ( $thePostWrap !== undefined ) {
								$result.append( $thePostWrap );
							}
							
							$result.append( $this );
							$thePostWrap = undefined;
							if ( i === l - 1 ) {
								return $result;
							}
						} else {
							$thePostWrap = ( !$thePostWrap ? $( '<div class="thePost waveTop waveBottom"></div>' ) : $thePostWrap );
							$thePostWrap.append( $this );
							
							if ( i === l - 1 ) {
								$result.append( $thePostWrap );
								return $result;
							}
						}
					}
				}
				$result = wrapPost( $result );
				
				
				F.preInsertPostInPage( $result.prop( 'outerHTML' ), $wrap, true );
				
			},
			
			closeTutorial: function() {
				/**
				* description
				*
				* @called : click ev on .closeTutorial
				* @calls : togglePageLoadingIcon,
				*					 loadTemplatePartIntoFrame
				*
				* @group : tutorial
				* @page : all but splash
				*/
				
				var $findAFeed = $( '#findAFeed' ),
						$navAndContentWrap = $( '#navAndContentWrap' );
				
				$( '#ground' )
					.velocity(
						{ opacity: 1 },
						{ duration: 400 }
				);
				
				$findAFeed
					.velocity(
						{ opacity: 0 },
						{ duration: 200,
							complete: function() {
								S.tutorialSlideIndex = 0;
								$findAFeed.remove();
								
								if ( $navAndContentWrap.length ) {
									$navAndContentWrap
										.velocity(
											{ opacity: 1 },
											{ duration: 200,
												complete: function() {
													$navAndContentWrap.css( 'z-index', 'auto' );
												}
										}
									);
								}
									
								if ( !$navAndContentWrap.length ) {
									F.togglePageLoadingIcon();
									F.loadTemplatePartIntoFrame( 'logged-in', $El.main );
								}					
							}
					}
				);
				
			},
			
			cubeTransToNothing: function() {
				/**
				* description
				*
				* @called : click ev on #signUpTutorial, #continue
				* @calls : toggleSplashAbout
				*
				* @group : transition / splash about
				* @page : splash
				*/
				
				/* makes the cube rotate to nothing.
					 the last step to see if wants / doesn't want to do
					 the tutorial on sign up. */
				
				var $wrapperToEmpty = ( $El.splashAboutWrap.hasClass( 'showAbout' ) ? $El.rectFront : $El.rectTop );
				
				$( $wrapperToEmpty ).empty();
				F.toggleSplashAbout();
			},
			
			deleteAccount: function() {
				/**
				* description
				*
				* @called : click ev on #deleteAccountPopUp .confirm
				*						
				* @calls : hidePopUp
				*
				* @group : delete user / pop ups
				* @page : settings
				*/
				
				var $popUpBox;
				
				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'delete_account',
						id: C.userId
					},
					success: function( data ){
						data = $.parseJSON( data );
						
						if( !data.isAccountDeleted ){
							F.hidePopUp();
						}
					}
				});
				
				$popUpBox = $( '#deleteAccountPopUp' ).children();
					
				$popUpBox
					.velocity(
						{ opacity: 0,
					 		top: '42%' },
						{ complete: function() {
								document.location.reload();
							}
						}
				);
				
			},
			
			deleteCategory: function( displayName ) {
				/**
				* description
				*
				* @called : click ev on #cancelFeedPopUp .confirm,
				*						click ev on .feedInfo .trash
				*
				* @group : delete feed
				* @page : settings
				*
				* @params {string} - displayName : this is the display name of a feed ex: 'New Yorker'
				*/
				
				// note: id is a string number

				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'delete_category',
						displayName: displayName
					},
					success: function( data ) {
						// if its frozen brother had no children, it was also deleted
						// on the server and must also be deleted here
						
						data = $.parseJSON( data );
						
						if ( data.didDeleteFresh ) {
							delete S[ 'fresh' ][ 'cats' ][ 'cat' + data.freshCatId ];
						}
					}
				});
			},
			
			deleteOrSavePost: function( $post, action ) {
				/**
				* description
				*
				* @called : click ev on .saveAndDeleteWrap .save, .saveAndDeleteWrap .trash
				* @calls : updateBatchFeeds,
				*					 getOneMorePost
				*
				* @group : save posts / delete posts
				* @page : timeline
				*
				* @params {jquery object} - $post : the article.postWrap
				* @params {string} - $action : 'save' || 'trash'
				*/
				var $depthStyle,
						shrinkAndDestroy,
						$waveBridgeTop = $( '<div class="style waveBridge"></div>' ),
						$waveBridgeBottom = $( '<div class="style waveBridge"></div>' );
						
				$depthStyle = $( '<div class="block"></div>' + 
													 '<div class="depth style animation">' +
														 '<div class="style bottomLeftCorner animation"></div>' +
													 '</div>' );
				
				$depthStyle
					.children()
					.attr(
						{ 'style': $post.find( '.bottomLeftCorner' ).attr( 'style' ) }
				);
				
				$post
					.children( '.expandablePostHeader' )
						.append( $depthStyle )
					.end()
					.find( '.postHeader' )
						.append( $waveBridgeTop )
					.end()
					.find( '.expandableContent' )
						.append( $waveBridgeBottom )
					.end()
					.addClass( action === 'save' ? 'saving' : 'trashing' )
					.velocity(
						{ opacity: 0 },
						{ duration: 300,
							delay: 350,
							complete: function() {
								shrinkAndDestroy();
							}
						}
				);
				
				shrinkAndDestroy = function() {
					$post
						.css( 'overflow', 'hidden' )
						.velocity(
							{ height: 0,
								margin: 0 },
							{ duration: 400,
								complete: function() {
									var id = $post.data( 'id' );
									
									action = ( action === 'save' ? 'save_this_post' : 'delete_this_post' );
									
									$.ajax({
										type: 'POST',
										url: C.ajaxUrl,
										data: {
											action: action,
											postId: id
										},
										success: function( data ){
											$post.remove();
											F.updateBatchFeeds();
											F.getOneMorePost();
										}
									});
									// add to list of do not download
									// get one more post [from that category]
									// send the id to be deleted
								}
							}
					);
				}
				
			},
			
			detectIE: function() {
				var ua = window.navigator.userAgent,
						msie = ua.indexOf('MSIE '),
						trident = ua.indexOf('Trident/'),
						rv,
						edge = ua.indexOf('Edge/');
						
		    if ( msie > 0 ) {
					// IE 10 or older => return version number
					return parseInt( ua.substring( msie + 5, ua.indexOf( '.', msie) ), 10 );
		    }

		    if ( trident > 0 ) {
					// IE 11 => return version number
					rv = ua.indexOf('rv:');
					return parseInt( ua.substring( rv + 3, ua.indexOf( '.', rv ) ), 10 );
		    }

		    if ( edge > 0 ) {
		       // Edge (IE 12+) => return version number
		       return parseInt( ua.substring( edge + 5, ua.indexOf( '.', edge ) ), 10 );
		    }

		    // other browser
		    return false;
			},
			
			errorCheckName: function( name ) {
				/**
				* description
				*
				* @called : click ev on #createFeed,
				*						tryToEditExisitingCatName
				*
				* @group : add feed
				* @page : settings
				*
				* @params {string} - name : val of #newFeedTitle after titleCaps() has been applied
				*
				* @returns {error string || bool} : returns the input error display text ||
				*																		confirmation that the name param passed the test
				*/
				
				// returns a warning string on fail, true on success
				var freshCats,
						i,
						inUseName,
						isNameInFreshUse,
						l;
				
				
				if ( !name.length ) {
					// the title field is empty
					return 'the title field is empty';
				}
				
				name = name.toLowerCase();
				
				if( ( name === S.fresh.name ) ||
						( name === S.frozen.name ) ||
						( name === C.master.name ) ) {
							// the title field is being used as the master, fresh, or frozen parent cat
							return 'using master cat!';
				}
				
				freshCats = Object.keys( S.fresh.cats );
				
				if ( freshCats.length ) {
					// name loops
					for ( i = 0, l = freshCats.length; i < l; i++ ) {
						inUseName = S[ 'fresh' ][ 'cats' ][ freshCats[ i ] ][ 'display_name' ]
							.toLowerCase();
							
						if ( name === inUseName ) {
							return 'you are currently subscribed to this fresh url';
							break;
						}
					}
				}
				
				// if it gets here, it's good
				return true;
			},
			
			errorCheckUrl: function( url ) {
				/**
				* description
				*
				* @called : click ev on #createFeed
				* @calls : stripWww
				*
				* @group : add feed
				* @page : settings
				*
				* @params {url string} - url : the input val of #newFeedUrl after being modified by normalizeUrl
				*
				* @returns {error string || modified (param) url} :
				*/
				
				var freshCats,
						i,
						result = {},
						l,
						result,
						inUseUrl,
						strippedUrl,
						urlComparison = url.replace(/\s+/g, '');
				
				
				if ( !url.length ) {
					return 'url field is empty';
				} else if ( url !== urlComparison ) {
					// there's white space in the url
					return 'the url has a space in it';
				} 
				
				strippedUrl = F.stripWww( url );
				
				if ( !strippedUrl ) {
					return 'malformed url';
				} 
				
				// these loops detect if urls are in use, frozen or fresh
				freshCats = Object.keys( S.fresh.cats );
				
				if ( freshCats.length ) {
					for ( i = 0, l = freshCats.length; i < l; i++ ) {
						inUseUrl = S[ 'fresh' ][ 'cats' ][ freshCats[ i ] ][ 'rss_url' ];
						
						if( ( URI( inUseUrl ).equals( url ) ) ||
								( URI( F.stripWww( inUseUrl ) ).equals( strippedUrl ) ) ) {
							return 'you are currently subscribed to this url';
						}
					}
				}

				return result;
				
			},
			
			getAnimationDuration: function( length, pxPerSec ) {
				/**
				* description
				*
				* @called : mouseenter / leave and click ev on .expandableButton, .postHeaderText,
				*						click ev on .closePost
				*
				* @group : utility
				* @page : timeline
				*
				* @params {int} - length : the length in pxs of the animation
				* @params {int} - pxPerSec : pxs / sec
				*
				* @returns {int} : ms of an animation
				*/
				
				/* returns speed in ms.
					 the higher the px per sec the faster the animation. */
				return Math.round( length / pxPerSec * 1000 );
			},
			
			getNewArticles: function(){
				/**
				* description
				*
				* @called : click ev on #refresh
				* @calls : getNewPostInfoFromRawEntries,
				*					 loadTemplatePartIntoFrame
				*
				* @group : get posts from db
				* @page : timeline
				*/
				
				var cat,
						cats = S.fresh.cats,
						cycle,
						didFindPosts,
						ids = [],
						newPosts = {};
				
				// get ids
				for ( cat in cats ) {
				  if ( cats.hasOwnProperty( cat ) ) {
						ids.push( cats[ cat ][ 'id' ] );
				  }
				}
				
				// cycle thru ids w. a recursive function
				cycle = function( ids ) {
					var i,
							id = ids.shift(),
							filteredEntries = [],
							entries,
							addUrl,
							feedUrl = S[ 'fresh' ][ 'cats' ][ ( 'cat' + id ) ][ 'rss_url' ],
							feed = new google.feeds.Feed( feedUrl ),
							l,
							newIgnore = [],
							oldIgnore = S[ 'fresh' ][ 'cats' ][ ( 'cat' + id ) ][ 'ignore' ],
							pos,
							publishedDate,
							trashedDate;
					
					feed.setNumEntries( 25 );
					
					feed.load( function( feeds ) {
						entries = feeds.feed.entries;
						l = entries.length;
						
						for ( i = 0; i < l; i = i + 1 ) {
							newIgnore[ i ] = entries[ i ][ 'link' ];
						}
						
						S[ 'fresh' ][ 'cats' ][ ( 'cat' + id ) ][ 'ignore' ] = newIgnore;
						
						for ( i = 0; i < l; i = i + 1 ) {
							addUrl = true;
							
							if ( S.freshnessLimit ) {
								trashedDate = Date.parse( entries[ i ].publishedDate ) / 1000 + S.freshnessLimit;
								
								addUrl = ( trashedDate > ( $.now() / 1000 ) ? true : false );
							}
							console.log( addUrl );
							if ( addUrl ) {
								pos = $.inArray( entries[ i ].link, oldIgnore );
								
								addUrl = ( pos === -1 ? true : false );
							}

							if ( addUrl ) {
								filteredEntries.push( entries[ i ] );
							}
						}

						if ( filteredEntries.length ) {
							newPosts[ ( 'cat' + id ) ] = {
								id: id,
								ignore: newIgnore,
								new_posts: F.getNewPostInfoFromRawEntries( filteredEntries, id )
							};
							
							didFindPosts = true;
						}
						
						if ( ids.length > 0 ) {
							// call again
							cycle( ids );
						} else if ( didFindPosts ) {
							$.ajax({
								type: 'POST',
								url: C.ajaxUrl,
								data: {
									action: 'refresh_posts',
									newPosts: newPosts
								},
					
								success: function( data ) {
									F.loadTemplatePartIntoFrame( 'articles', $El.currentMainSectionWrap );
								}
							});

							return;
						} else {
							F.loadTemplatePartIntoFrame( 'articles', $El.currentMainSectionWrap );
							
							return;
						}
					});
				};
				
				cycle(ids);

			},

			getNewPostInfoFromRawEntries: function( entryArr, catId ) {
				/**
				* description
				*
				* @called : getNewArticles
				*
				* @group : get posts from db
				* @page : timeline
				*
				* @params {array} - entryArr : the 25 grabbed rss entries from the google feed object after being slightly modified
				* @params {int} - catId : the first member of the ids array in getNewArticles !!!! make more clear
				*
				* @returns {array} - editedEntries : the modified entryArr
				*/
				
				// cat_id is optional. used during refresh.
				var editedEntries = [],
						excerpt = '',
						i = 0,
						l = entryArr.length,
						pos,
						publishedDate;
						
				for ( i; i < l; i = i + 1 ) {
					editedEntries[ i ] = {};
					editedEntries[ i ].author = $.trim( entryArr[ i ].author );
					editedEntries[ i ].link = entryArr[ i ].link;
					
					publishedDate = entryArr[ i ].publishedDate;
					
					pos = publishedDate.indexOf( '-' );
					pos = ( pos === -1 ? publishedDate.indexOf( '+' ) : pos );
					
					if ( pos !== -1 ) {
						publishedDate = publishedDate.substring( 0, pos );
					}
					
					editedEntries[ i ].publishedDate = publishedDate;
					editedEntries[ i ].title = $.trim( entryArr[ i ].title );
					
					$excerpt = $.trim( entryArr[ i ].content );
					$excerpt = ( !$excerpt ? $.trim( entryArr[ i ].contentSnippet ) : $excerpt );
					$excerpt = ( $excerpt === editedEntries[ i ].title ? '' : $excerpt );
					
					if ( $excerpt ) {
						$excerpt = $excerpt.substring( 0, 1000 );
						$excerpt = $excerpt.replace(/\s{2,}/g, ' ');
					}
					
					editedEntries[ i ].excerpt = $excerpt;
					
					if ( catId ) {
						editedEntries[ i ].catId = catId;
					}
				}
				
				return editedEntries;
				
			},
			
			getOneMorePost: function() {
				/**
				* description
				*
				* @called : deleteOrSavePost
				*
				* @group : delete posts / get posts from db
				* @page : timeline
				*/
				
				var order;
				
				if ( S.batchFeeds.batchCount <= S.batchFeeds.initValue ) {
					return;
				}
				
				order = $( '.postWrap' )
					.last()
					.data( 'order' );
				
				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'return_next_post',
						articleType: S.batchFeeds.articleType,
						order: order
					},
					success: function( data ){
						$( data )
							.css( 'opacity', 0 )
							.appendTo( '#timeline' )
							.velocity(
								{ opacity: 1 },
								{ duration: 300 }
						);
					}
				});
				
			},
			
			getLeftDrag: function( pageX ) {
				/**
				* description
				*
				* @called : mousedown ev on #rangePit,
				*						mousedown ev and mousemove ev on #rangePit,
				*						mousedown ev and mouseleave ev on #rangePit,
				*						mousedown ev and mouseup ev on #rangePit
				*
				* @group : freshness / interactive style
				* @page : settings
				*
				* @params {int} - pageX : the e.pageX
				*
				* @returns {int} - left : the modified e.pageX
				*/
				
				var left;
				left = pageX - S.range.minOffset - 10;
				left = ( left >= 0 ? left : 0 );
				left = ( left <= S.range.maxLeft ? left : S.range.maxLeft );
				
				return left;
				
			},
			
			getPostFromWeb: function( $wrap ) {
				/**
				* description
				*
				* @called : mouseenter / leave and click ev on .expandableButton, .postHeaderText
				* @calls : cleanPost
				*
				* @group : get posts from web / toggle post
				* @page : timeline
				*
				* @params {jquery object} - $wrap : the article.postWrap
				*/
				
				var url = $wrap.data( 'url' );
				
				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'get_post_from_web',
						url: url
					},
					success: function( html ){
						F.cleanPost( $.trim( html ), $wrap, url );
					}
				});
			},
			
			gutPost: function( $expandableContentWrap ) {
				/**
				* description
				*
				* @called : togglePostContent
				*
				* @group : toggle post
				* @page : timeline
				*
				* @params {jquery object} - name : div.expandableContentWrap (hold's post header, footer and content)
				*/
				
				var $expandableContent = $expandableContentWrap.find( '.expandableContent' ),
						$loader;

				$loader = '<div class="thePost waveTop waveBottom">' +
										'<div class="postLoaderWrap">' +
											'<div class="postLoader">' +
												'<div class="postLoadingWavesWrap">' +
													'<div class="postLoadingWaves"></div>' +
												'</div>' +
											'</div>' +
											'<strong class="loadFigCaption">loading...</strong>' +
										'</div>' +
									'</div>';
											
				$expandableContent
					.children()
					.not( '.sourceWrap' )
					.remove();
					
				$( $loader ).prependTo( $expandableContent );
				
			},
			
			hideMalformedInputWarning: function( $input, $error ) {
				/**
				* description
				*
				* @called : transitionOutInputFeedInfo,
				*						focus ev on .malformed 
				*
				* @group : interactive style
				* @page : all
				*
				* @params {jquery object} - $input : the input elem that is malformed
				* @params {jquery object} - $error : the elem with the text message
				*/
				
				$input.removeClass( 'malformed' );
				
				$error
					.removeClass( 'visibleError' )
					.velocity(
						{ opacity: 0,
							textIndent: 0 },
						{ complete: function() {
								$error.text( '' );
						}
					}
				);
				
			},
			
			hidePopUp: function() {
				/**
				* description
				*
				* @called : deleteAccount,
				*						trySignInOrRegisterUser,
				*						click ev on #deletePostsPopUp .deny, #rssSearchPopUp .deny, #cancelFeedPopUp .deny, #deleteAccountPopUp .deny, #deletePostPopUp .deny,
				*						click ev on #cancelFeedPopUp .confirm,
				*						click ev on #signUpPopUp .deny, #loginPopUp .deny
				* @calls : removeErrorsAndInputText,
				*					 toggleMainContent
				*
				* @group : pop ups
				* @page : splash / settings / timeline
				*/
				
				var $popUp = $( '.popUpWrap.onScreen' ),
						$popUpBox = $popUp.children(),
						count = 0;
						
				$popUpBox
					.velocity(
						{ opacity: 0,
					 		top: '42%' },
						{ complete: function() {
								var $input = $popUpBox
									.find( 'input' )
									.eq( 0 );
								
								if( $input ) {
									$input.blur();
								}
													
								F.removeErrorsAndInputText( $popUp );
								
								$popUp.removeClass( 'onScreen' );
																			
								F.toggleMainContent();
								
								/* below fixes a weird bug:
									 after the animation it's values from
									 the stylesheet are added directly to the 
									 html in a style attr for some reason.
									 this prevents media queries.
									 happens at least in firefox. */
								
								$popUpBox
									.removeAttr( 'style' )
									.css(
										{ opacity: 0,
											top: '42%' }
								);
							}
					}
				);
				
			},
			
			initiateCloudAnimation: function() {
				/**
				* this positions the cloud groups and calls repeatingCloudAnimation which is a self-repeating function.
				* sets cloudAnimationCounter to -1
				* cloudAnimationCounter is used in repeatingCloudAnimation.
				* 
				* the cloud groups are not the width of the vp but that of the monitor's width (aka C.cloudsWidth).
				*
				* fade the clouds out.
				* position the cloud groups either flush left with the vp || w. a left of that of the monitor's (not vp's) width.
				* fade clouds in.
				* call repeatingCloudAnimation
				*
				* @called : toggleCloudAnimation,
				*						init
				* @calls : repeatingCloudAnimation
				*
				* @group : cloud animation
				* @page : timeline / splash / settings
				*/
				
				// just call it on the toggle
				// has been tested
				S.cloudAnimationCounter = -1;
				
				$El.clouds
				.velocity(
					{ opacity: 0 },
					{ duration: 300,
						complete: function() {
							$El.cloudsA.css({ left: 0 });
							$El.cloudsB.css({ left: C.cloudsWidth + 'px' });
							
							$El.clouds
								.css({ width: C.cloudsWidth + 'px' })
								.velocity(
									{ opacity: 1 },
									{ duration: 300,
										complete: function() {
											// was being called twice here. why?
											F.repeatingCloudAnimation();
											F.repeatingCloudAnimation();
										}
									}
								); 
						}
					} 
				);
				
			},

			insertFeedInfo: function( displayName, displayUrl, rssUrl ) {
				/**
				* description
				*
				* @called : addFeedIfExists
				* @calls : toggleEditFeedInstructions
				*
				* @group : interactive style / add feed
				* @page : settings
				*
				* @params {string} - displayName : the name of the feed that's diplayed to the user ex: 'New Yorker'
				* @params {string} - displayUrl : the url of the feed that's diplayed to the user ex: 'vice.com/rss'
				* @params {url string} - rssUrl : the actual url of the feed ex: 'http://www.vice.com/rss'
				*/
				
				var firstFeedAnimation,
						$firstFeedInfo = $('.feedInfo.first'),
						insertedAnimation,
						$insertedFeedInfo,
						isInsertedInfoAlone = ( $firstFeedInfo.length === 0 ? true : false );
				
				$insertedFeedInfo = $('' + 
					'<div class="canEdit feedInfo first" data-feed_name="' + displayName + '">' +
						'<div class="hr"></div>' +
							'<input type="text" class="existingFeedTitle" data-original_value="' + displayName + '" value="' + displayName + '" readonly />' +
							'<p class="error"></p>' + 
							'<input type="url" class="existingFeedUrl" data-rss_url="' + rssUrl + '" value="' + displayUrl + '" readonly />' +
							'<div class="buttonWrap saveOrEditFeedWrap">' +
								'<button class="saveOrEditFeed edit" type="button"><span class="hidden">Save</span><span class="visible">Edit</span></button>' +
							'</div>' +
							'<div class="buttonWrap trashWrap">' +
								'<button class="trash ir" type="button">Trash</button>' +
							'</div>' +
					'</div>');
				
				var firstFeedAnimation = function() {
					var firstFeedHrHeight = (S.isScreenLarge ? 12 : 8 ),
							firstFeedHrMarginBtm = (S.isScreenLarge ? 15 : 12 ),
							firstFeedHrMarginTop = (S.isScreenLarge ? 8 : 6 ),
							$firstFeedInfoHr = $firstFeedInfo.find($('.hr')),
							firstFeedInfoHeight,
							isFirstFeedInfoSaveable = $firstFeedInfo.hasClass( 'canSave' );
					
					if ( isFirstFeedInfoSaveable ) {
						firstFeedInfoHeight = ( S.isScreenLarge ? 142 : 108 );
					} else {
						firstFeedInfoHeight = ( S.isScreenLarge ? 124 : 93 );
					}
					
					
					$firstFeedInfo
						.velocity(
							{ height: firstFeedInfoHeight },
							{ duration: 300 }
					);
																	
					$firstFeedInfoHr
						.velocity(
							{ height: firstFeedHrHeight,
								marginBottom: firstFeedHrMarginBtm,
								marginTop: firstFeedHrMarginTop },
							{ duration: 300,
								complete: function() {
									$firstFeedInfoHr
										.velocity(
											{ opacity: 1 },
											{ duration: 300 }
									);
								}
							}
					);
					
				};
				
				var insertedAnimation = function() {
					var $insertAfter = $( '#editFeedsWrap > .info' ),
							insertedFeedInfoHeight = (S.isScreenLarge ? 99 : 75 );
					
					$insertedFeedInfo
						.css(
							{ height: 0,
								opacity: 0 } )
						.insertAfter( $insertAfter )
						.velocity(
							{ height: insertedFeedInfoHeight },
							{ duration: 300 }
					);
					
					$insertedFeedInfo
						.velocity(
							{ opacity: 1 },
							{ delay: 300,
								duration: 300,
								complete: function() {
									if ( !isInsertedInfoAlone ) {
										$firstFeedInfo
											.removeClass( 'first' )
											.removeAttr( 'style' )
											.find( '.hr' )
												.removeAttr( 'style' );
									} 
									
									if ( isInsertedInfoAlone )  {
										F.toggleEditFeedInstructions();
									}
									
									$insertedFeedInfo.removeAttr( 'style' );
								}
						}
					);
				};
				
				if ( isInsertedInfoAlone ) {
					insertedAnimation();
				}
				
				if ( !isInsertedInfoAlone ) {
					firstFeedAnimation();
					insertedAnimation();
				}

			},
			
			preInsertPostInPage: function($post, $wrap, isInitInsertion) {
				/**
				* description
				*
				* @called : getPostFromDb,
				*						cleanPost
				* @calls : wrapImgs,
				*					 wrapCanvases,
				*					 showInsertedPost
				*
				* @group : getPostFromDb
				* @page : timeline
				*
				* @params {html string} - $post : the html of the post that will be inserted into the $wrap
				* @params {jquery object} - $wrap : the article.postWrap
				* @params {boolean} - isInitInsertion : // look !!!!!! when defining this function
				*/
				
				
				var $expandableContent = $wrap.find( '.expandableContent' ),
						$post = ( isInitInsertion ? $( $post ).children() : $( $post ) );
				
				$expandableContent
					.velocity(
						{ 'opacity': 0 },
						{ duration: 200,
					 		complete: function(){
								var addContent,
										id,
										$imgs,
										$canvases;

								$expandableContent
									.css({ height: $expandableContent.height() });
								
					 			$post
									.insertBefore( $expandableContent.find( $( '.sourceWrap' ) ) );
								
								
								
								if ( isInitInsertion ) {
									$imgs = $expandableContent.find( $( 'img' ) );
									$canvases = $expandableContent.find( $( 'iframe, embed, object' ) );
									id = $wrap.data( 'id' );
									
									S[ 'globalHolder' ][ 'imgs' + id ] = {};
									S[ 'globalHolder' ][ 'imgs' + id ][ 'areWrapped' ] = ( $imgs.length ? false : true );
									S[ 'globalHolder' ][ 'canvases' + id ] = {};
									S[ 'globalHolder' ][ 'canvases' + id ][ 'areWrapped' ] = ( $canvases.length ? false : true );
									
									if ( $imgs.length ) {
										$imgs.addClass( 'unwrapped' );
										F.wrapImgs( $imgs, id, $post, $wrap, $expandableContent );
									}

									if ( $canvases.length ) {
										$canvases.addClass( 'unwrapped' );
										F.wrapCanvases( $canvases, id, $post, $wrap, $expandableContent );
									}
									
									if ( !$imgs.length && !$canvases.length ) {
										F.showInsertedPost( $post, $wrap, $expandableContent );
									}
								}
								
								if ( !isInitInsertion ) {
									
									F.showInsertedPost( $post, $wrap, $expandableContent );
								}
					 		}
					}
				);
				
			},
			
			showInsertedPost: function( $post, $wrap, $expandableContent ) {
				/**
				* description
				*
				* @called : wrapCanvases,
				*						wrapImgs,
				*						preInsertPostInPage
				* @calls : setPostContent
				*
				* @group : toggle post
				* @page : timeline
				*
				* @params {jquery object} - $post : // !!!! i'm not sure
				* @params {jquery object} - $wrap : the article.postWrap
				* @params {jquery object} - $expandableContent : the article.postWrap's div.expandableContent
				*/
				
				var duration = 500,
						i,
						$thePosts,
						$theLoader,
						l,
						loaderHeight,
						postHeight = 0;

				$thePosts = $expandableContent.children();
				l = $thePosts.length;
		
				// gets the length
				for ( i = 1; i < l; i = i + 1 ) {
					postHeight = postHeight + $thePosts.eq( i ).outerHeight();
				}
		
				// shrink and remove the loader
				$theLoader = $thePosts.eq( 0 );
				
				$theLoader.remove();
				
				// expand and fade in content
			
				$expandableContent
					.velocity(
						{ height: postHeight - 10 },
						{ duration: duration,
							complete: function() {
								$expandableContent
									.css('height', 'auto')
									.velocity(
										{ opacity: 1 },
										{ duration: 200,
											complete: function() {
												var $thePost,
														$iframes;
														
												if ( $wrap.hasClass( 'hasContent' ) === false ) {
													$wrap.addClass( 'hasContent' );
													l = $thePosts.length;
													
													for ( i = 1; i < l; i = i + 1 ) {
														$thePost = ( i === 1 ? $thePosts.eq( i ) : $thePost.add( $thePosts.eq( i ) ) );
													}
											
													F.setPostContent( $thePost.prop( 'outerHTML' ), $wrap.data( 'id' ) );
												}
											}
										}
								);
							}
						}
				);
				
			},
			
			isUnsavedFeedInfoEdited: function( $canSave ) {
				/**
				* description
				*
				* @called : click ev on .saveOrEditFeed.edit
				*
				* @group : add feed / delete feed / interactive style
				* @page : settings
				*
				* @params {jquery object} - $canSave : // ? is this used, is it always false ?
				*
				* @returns {object || bool} - result : if it's an object it's passed onto revertUnsavedFeedInfo where
				*																			 it's used in an interactive style animation
				*
				* @see revertUnsavedFeedInfo bc it uses the result object
				*/
				
				var result = {
							hasNameChanged: false,
							hasUrlChanged: false,
							$name: $canSave.find( '.existingFeedTitle' )
						},
						currentNameVal = $.trim( result.$name.val() ),
						originalNameVal = $.trim( result.$name.data( 'original_value' ) );
				
				if ( currentNameVal !== originalNameVal ) {
					result.hasNameChanged = true;
				} else {
					result = false;
				}
				
				return result;
			},
			
			loadTemplatePartIntoFrame: function( templatePart, $frame, articleType, batchNumber ) {
				/**
				* gets the template part (from a php file of the same name) from the db
				* removes the loading screen when we get the html content
				* turn the yet to be added html content into a jquery object ($section) and give it a 0 opacity
				* insert into the begining of the $frame's tag
				* if you loaded logged-in call the init functions cacheEls, addCustomScrollBar, bindUiActions endif
				* fade in the section
				* update the the <title> for the given page
				* if it's settings page call setDraggableSettings endif;
				* if it's aticles || logged-in call setBatchFeeds
				*
				* @called : launchTutorial,
				*						transitionToSection
				*						transitionToLoggedIn
				*						updateBatchFeeds
				*						keydown ev on #jumpToBatch
				*						click ev on #previousBatch, #nextBatch
				*						closeTutorial
				*						getNewArticles
				* @calls : togglePageLoadingIcon,
				*					 cacheEls
				*					 addCustomScrollBar
				*					 bindUiActions
				*					 setDraggableSettings
				*					 setBatchFeeds
				*
				* @group : main nav / transition / login || sign up / get posts from db
				* @page : all
				*
				* @params {string} - templatePart : the php template file to get
				* @params {jquery object} - $frame : the tag that the returned html will load into
				* @params {string} - articleType : optional - 'fresh' || 'frozen', only applicable if templatePart is 'articles'
				* @params {int} - batchNumber : optional - the batch of feeds to grab
				*																posts come in batches of 10
				*																ex: batch 3 would get posts 30 - 39
				*																only applicable if templatePart is 'articles'
				*/
				
				var batchNumber = ( batchNumber === undefined ? 1 : batchNumber ),
						$section,
						sectionName = templatePart,
						articleType = ( articleType === undefined ? 'fresh' : articleType );
				
				$.ajax({
					dataType: 'html',
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'return_template_part',
						articleType: articleType,
						batchNumber: batchNumber,
						templatePart: templatePart
					},
					success: function( templatePart ) {
						var $batchOfFeeds,
								$filterFeedMenu;
						
						F.togglePageLoadingIcon();
						
						$section = $( $.parseHTML( $.trim( templatePart ) ) );
						
						$section
							.css( 'opacity', 0 )
							.prependTo( $frame );
						
						if ( sectionName === 'logged-in' ) {
							F.cacheEls();
							F.addCustomScrollBar();
							F.bindUiActions();
							
							window
								.setTimeout( function() {
									$El.titleTag
										.text( 'hello, ' + C.userName );
									},
							500 );
						}

						$section
							.velocity(
								{ opacity: 1 },
								{ duration: 1000,
									complete: function() {
										
										if ( sectionName === 'settings' ) {
											F.setDraggableSettings();
											
											$El.title
												.text( 'settings | ' + C.userName );
												
											S.title = 'settings | ' + C.userName;
											
										} else if ( sectionName === 'info' ) {
											$El.title
												.text( 'faq | ' + C.userName );
												
											S.title = 'faq | ' + C.userName;
											
										} else if ( (sectionName === 'articles') || (sectionName === 'logged-in') ) {
											F.setBatchFeeds();
											
											if ( articleType === 'frozen' && S.title !== ('saved posts | ' + C.userName) ) {
												$El.title
													.text( 'saved posts | ' + C.userName );
													
												S.title = 'saved posts | ' + C.userName;
												
											} else if( S.title !== ('new posts | ' + C.userName) ) {
												$El.title
													.text( 'new posts | ' + C.userName );
													
												S.title = 'new posts | ' + C.userName;
												
											}
											
										}
									}
							}
						);
					},
					error: function( xhr, status, error ) {
						// ?
					}
				});
			},
			
			launchTutorial: function() {
				/**
				* description
				*
				* @called : click ev on .launchTutorial,
				*						click ev on #signUpTutorial
				* @calls : togglePageLoadingIcon,
				*					 loadTemplatePartIntoFrame
				*
				* @group : tutorial
				* @page : all but splash
				*/
				
				var continuation,
						duration,
						$navAndContentWrap = $( '#navAndContentWrap' );
				
				$( '#ground' )
					.velocity(
						{ opacity: 0 },
						{ duration: 400 }
				);
				
				if ( $navAndContentWrap.length ) {
					// not coming from sign-up
					duration = 200;
					
					$navAndContentWrap
						.velocity(
							{ opacity: 0 },
							{ duration: duration,
								complete: function() {
									$navAndContentWrap.css( 'z-index', '-1' );
								}
							}
					);
				} else {
					// coming from sign-up
					duration = 0;
					
					$El.main
						.children()
						.remove();
				}
				
				continuation = function() {
					F.togglePageLoadingIcon();
					F.loadTemplatePartIntoFrame( 'howToFindAFeed', $El.main );
				};
				
				setTimeout( continuation, duration);
				
			},
			
			makeDisplayUrl: function( url ) {
				/**
				* makes the url the user will see. makes it shorter / prettier
				* remove the protcol
				* remove 'www.'
				* remove any trailing '/'
				* return it.
				*
				* @called : addFeedIfExists
				*
				* @group : add feed
				* @page : settings
				*
				* @params {url string} - url : the input val from #newFeedUrl ex : 'feed://www.vice.com/rss/'
				*
				* @returns {string} - displayUrl : the modified feed that's displayed in settings ex : 'vice.com/rss'
				*/
				
				var displayUrl = $.url( url ).attr( 'host' ) + $.url( url ).attr( 'relative' );
				
				if ( displayUrl.slice( 0, 4 ) === 'www.' ) {
					displayUrl = displayUrl.slice( 4 );
				}
				
				if ( displayUrl.slice( -1 ) === '/' ) {
					displayUrl = displayUrl.slice( 0, -1 );
				}
				
				return displayUrl;
			},
			
			makeFeedInfoEditable: function( $canEdit ) {
				/**
				* description
				*
				* @called : click ev on .saveOrEditFeed.edit
				*
				* @group : add feed / delete feed / interactive style
				* @page : settings
				*
				* @params {jquery object} - $canEdit : div.feedInfo.canEdit
				*/

				var duration = 300,
						editToSaveButtonAnimation,
						$existingFeedTitle = $canEdit.find( '.existingFeedTitle' ),
						$existingFeedUrl = $canEdit.find( '.existingFeedUrl' ),
						fadeInAnimation,
						flatToIndentedAnimation,
						heightAnimation,
						$saveOrEditFeed = $canEdit.find( '.saveOrEditFeed' ),
						$trashWrap = $canEdit.find( '.trashWrap' );
						
				fadeInAnimation = function() {
					$existingFeedTitle
						.add( $existingFeedUrl )
						.add( $trashWrap )
						.velocity(
							{ opacity: 1 },
							{ duration: duration,
								complete: function() {
									$canEdit
										.add( $existingFeedTitle )
										.add( $existingFeedUrl )
										.add( $trashWrap )
										.add( $saveOrEditFeed )
										.removeAttr( 'style' );
								}
						}
					);
				};
				
				heightAnimation = function() {
					var inputTextMarginTop = ( S.isScreenLarge ? 9 : 6 ),
							height,
							isWrapperTheFirstChild = ( $( '.feedInfo' ).index( $canEdit ) === 0 ? true : false );
					
					if ( isWrapperTheFirstChild ) {
						height = ( S.isScreenLarge ? 117 : 89 );
					}
					
					if ( !isWrapperTheFirstChild ) {
						height = ( S.isScreenLarge ? 142 : 108 );
					}
					
					$saveOrEditFeed
						.text( 'Save' )
						.removeClass( 'edit' )
						.addClass( 'save' );
												 
					$trashWrap.css( 'opacity', '0' );
														
					$existingFeedUrl
						.velocity(
							{ marginTop: 7 },
							{ duration: duration }
					);
					
					$existingFeedTitle
						.velocity(
							{ marginTop: inputTextMarginTop },
							{ duration: duration,
								complete: function() {
									$existingFeedTitle.removeAttr( 'readonly' );
								}
							}
					);
					
					$canEdit
						.velocity(
							{ height: height },
							{ duration: duration,
								complete: function() {
									$canEdit
										.removeClass( 'canEdit' )
										.addClass( 'canSave' );
																
									fadeInAnimation();
								}
						}
					);
				};
				
				editToSaveButtonAnimation = function() {
					var width = ( S.isScreenLarge ? 69 : 51 );
					
					$existingFeedTitle
						.add( $existingFeedUrl )
						.velocity(
							{ opacity: 0 },
							{ duration: duration }
					);
					
					$saveOrEditFeed
						.velocity(
							{ color: '#fafafa',
								width: width },
							{ duration: duration,
								complete: function() {
									heightAnimation();
								}
						}
					);
																	 
				 	$saveOrEditFeed
						.velocity(
							{ color: '#00ddff' },
				 			{ delay: duration,
								duration: duration }
					);
				};
				editToSaveButtonAnimation();

			},
			
			makeFeedInfoNonEditable: function( $canSave ) {
				/**
				* description
				*
				* @called : tryToEditExisitingCatName,
				*						click ev on .saveOrEditFeed.edit
				*
				* @group : add feed / delete feed / interactive style
				* @page : settings
				*
				* @params {jquery object} - $canSave : div.feedInfo.canSave, the current .feedInfo being edited
				*/
				
				var duration = 300,
						editToEditButtonAnimation,
						$existingFeedTitle = $canSave.find( '.existingFeedTitle' ),
						$existingFeedUrl = $canSave.find( '.existingFeedUrl' ),
						fadeInAnimation,
						flatToIndentedAnimation,
						heightAnimation,
						$saveOrEditFeed = $canSave.find( '.saveOrEditFeed' ),
						$trashWrap = $canSave.find( '.trashWrap' );

				fadeInAnimation = function() {
					$existingFeedTitle
						.text( titleCaps( $existingFeedTitle.text() ) )
						.add( $existingFeedUrl )
						.css( 'color', '#333333' )
						.velocity(
							{ opacity: 1 },
							{ duration: duration,
								complete: function() {
									$canSave
										.add( $existingFeedTitle )
										.add( $existingFeedUrl )
										.add( $trashWrap )
										.add( $saveOrEditFeed )
										.removeAttr( 'style' );
								}
						}
					);
				};		
				
				heightAnimation = function() {
					var inputUrlMarginTop = ( S.isScreenLarge ? 8 : 6 ),
							height,
							isWrapperTheFirstChild = ( $( '.feedInfo' ).index( $canSave ) === 0 ? true : false );
							
					if ( isWrapperTheFirstChild ) {
						height = ( S.isScreenLarge ? 99 : 75 );
					}
					
					if ( !isWrapperTheFirstChild ) {
						height = ( S.isScreenLarge ? 124 : 93 );
					}
					
					$saveOrEditFeed
						.text( 'Edit' )
						.removeClass( 'save' )
			 			.addClass('edit');
							 
					$trashWrap.css( 'display', 'none' );
					
					$existingFeedUrl
						.velocity(
							{ marginTop: 0,
								borderTopWidth: 0 },
							{ duration: duration }
					);
							
					$existingFeedTitle
						.velocity(
							{ marginTop: '1px',
								borderTopWidth: 0 },
							{ duration: duration,
								complete: function() {
									$existingFeedTitle.attr( 'readonly', 'readonly' );
								}
							}
					);
																
					$canSave
						.velocity(
							{ height: height },
							{ duration: duration,
								complete: function() {
									$canSave
										.removeClass( 'canSave' )
										.addClass('canEdit');									
											
									fadeInAnimation();
								}
						}
					);								
				};
				
				editToEditButtonAnimation = function() {
					var width = ( S.isScreenLarge ? 62 : 46 );
					
					$existingFeedTitle
						.add( $existingFeedUrl )
						.add( $trashWrap )
						.velocity(
							{ opacity: 0 },
							{ duration: duration }
					);
					
					$saveOrEditFeed
						.velocity(
							{ color: '#fafafa',
								width: width },
							{ duration: duration,
								complete: function() {
									heightAnimation();
								}
							}
					);
																	 
				 	$saveOrEditFeed
						.velocity(
							{ color: '#00ddff' },
				 			{ delay: duration,
								duration: duration }
					);
				};
				editToEditButtonAnimation();
				
			},
			
			normalizeUrl: function( url ) {
				/**
				* description
				*
				* @called : click ev on #createFeed
				*
				* @group : add feed
				* @page : settings
				*
				* @params {url string} - url : the raw url string copied into #newFeedUrl
				*
				* @returns {url string} - url : the url w. normal protocol and no hashes, fragments, etc
				*/
				
				// if returned false, there was an error and the url was malformed.
				// you have to use both plugins bc uri.js throws errors all over
				// if uri.js isn't given a protocol it won't work
				var host,
						protocol = 'http://', // !!important
						path,
						result,
						uri,
						url = $.trim(url.toLowerCase());
				
				try {
					url = $.url( url );
				}
				catch ( e ) {
					// object was not made;
					return false;
				}

				host = url.attr( 'host' );
				path = url.attr( 'relative' );
				
				if( !url.attr( 'file' ) &&
						!url.attr( 'query' ) &&
						!url.attr( 'fragment' ) &&
						( path.substr( -1, 1 ) === '/' ) )
				{
					// if has no sort of fragment and ends with '/'
					path = path.slice( 0, -1 );
				}
				
				url = protocol + host + path;
				
				try {
					uri = URI( url );
				}
				catch ( e ) {
					// object was not made;
					return false;
				}

				if ( uri.tld() === uri.domain() ) {
					// the input is a single word ex 'vice'
					return false;
				}
				
				if ( uri.tld() !== uri.domain() ) {
					return( url );
				}
				
			},
			
			radioToggle: function( $target, $other ) {
				/**
				* description
				*
				* @called : 
				*
				* @group : 
				* @page : 
				*
				* @params {jquery object} - $target :
				* @params {jquery object} - $other :
				*/
				
				/* animates and changes the checked attr inside a radio group.
					 $other is any other radio btn in the group. */
					 
				$other
					.removeClass( 'checked' )
					.removeAttr( 'checked' );
					
				$target
					.addClass( 'checked' )
					.attr( 'checked', '' );
					
			},
			
			removePreloadClass: function() {
				/**
				* removes the preload class from <body> to allows css animations to not flash on load
				*
				* @called : init
				*
				* @group : init
				* @page : splash / timeline
				*/
				
				$El.body.removeClass( 'preload' );
			},
			
			removeErrorsAndInputText: function( $wrapper ) {
				/**
				* this resets the input fields and removes errors in a pop up
				* so if viewed again they'll be blank.
				* using the provided pop up ($wrapper) search for any errors, if found remove them.
				* clear the text in the fields.
				*
				* @called : hidePopUp
				*
				* @group : pop ups
				* @page : splash / faq
				*
				* @params {jquery object} - $wrapper : .popUpWrap.onScreen
				*/
				
				/* cleanses any input text errors.
					 used when hiding popups */
				var $errors = $wrapper.find( $( '.visibleError' ) ),
						$inputs = $wrapper.find( $( 'input[type="text"], input[type="password"], input[type="url"]' ) ),
						$malformedInputs = $wrapper.find( $( '.malformed' ) );
				
				if ( $errors && $malformedInputs ) {
					$errors
						.removeClass( 'visibleError' )
						.text( '' )
						.css(
							{ opacity: 0,
								textIndent: 0 }
					);
					
					$malformedInputs.removeClass( 'malformed' );
				}
				
				if ( $inputs ) {
					$inputs.val( '' );
				}
				
			},
			
			removeFeed: function( $feedInfo ) {
				/**
				* description
				*
				* @called : click ev on .feedInfo .trash,
				*						click ev on #cancelFeedPopUp .confirm
				* @calls : toggleFeedInfoSeperator,
				*					 toggleEditFeedInstructions
				*
				* @group : add feed / delete feed / interactive style
				* @page : settings
				*
				* @params {jquery object} - $feedInfo : the div.feedInfo
				*/
				
				var continuation,
						feedName = $feedInfo.data( 'feed_name' ),
						$feedInfos = $( '.feedInfo' ),
						count = $feedInfos.length - 1,
						index = $feedInfos.index( $feedInfo );
				
				// send feedName to destroy that category here
				
				if ( !index && count ) {
					F.toggleFeedInfoSeperator( 'removed', $feedInfos.eq( 1 ) );
				}
				
				continuation = function(){
					$feedInfo
						.velocity(
							{ height: 0 },
							{ duration: 300,
								complete: function() {
									if ( !index && count ) {
										$feedInfo
											.next()
											.addClass( 'first' );
									}
									
									$feedInfo.remove();
									
									if ( !count ) {
										F.toggleEditFeedInstructions();
									}
								}
						}
					);
				};
				
				$feedInfo
					.velocity(
						{ opacity: 0 },
						{ duration: 300,
							complete: function() {
								continuation();
							}
						}
				);
						 
			},
			
			repeatingCloudAnimation: function() {
				/**
				* does the background animation.
				* there are two animations going on -
				* $El.cloudsA animates from left at 0 to left at -(computer monitor width)
				* $El.cloudsB animates from left at (computer monitor width) to left at 0
				* this animation only sets one of the animations at a time.
				* to determine which one, use S.cloudAnimationCounter which if even does $El.cloudsA, odd $El.cloudsB
				* S.cloudAnimationCounter's even / odd val sets distance, duration, css left reset value used in the animation.
				* once done, repeat
				*
				* @called : repeatingCloudAnimation (self),
				*						initiateCloudAnimation
				* @calls : repeatingCloudAnimation (self)
				*
				* @group : cloud animation
				* @page : all
				*/
				
				var $cloudGroup = ( S.cloudAnimationCounter % 2 === 0 ? $El.cloudsA : $El.cloudsB ),
						distance = C.cloudDistance,
						duration = C.cloudDuration,
						reset = C.cloudsWidth;
						
				S.cloudAnimationCounter = S.cloudAnimationCounter + 1;
				
				// if the $cloudGroup is $El.cloudsA
				if ( !S.cloudAnimationCounter ) {
					distance = C.cloudDistance / 2;
					duration = C.cloudDuration / 2;
					reset = 0;
				}

				$cloudGroup
					.css( { left: reset } )
					.velocity(
						{ left: '-=' + distance + 'px' },
						{ duration: duration,
					 		easing: 'linear',
					 		complete: function() {
						 		F.repeatingCloudAnimation();
					 		}
				 	}
				);
			},
			
			revertUnsavedFeedInfo: function( ob ) {
				/**
				* description
				*
				* @called : click ev on .saveOrEditFeed.edit
				*
				* @group : add feed / delete feed / interactive style
				* @page : settings
				*
				* @params {object} - ob : {
				*											hasNameChanged: {bool},
				*											hasUrlChanged: {bool},
				*											$name: {jquery object}
				*										}
				*
				* @see isUnsavedFeedInfoEdited, it is where ob is generated
				*/
				
				var clearColor = ( C.hasRgba ? '#00ddff' : '#fafafa' ),
						colorAlpha = ( C.hasRgba ? 0 : 1 ),
						continuationName,
						duration = 150,
						orginalNameVal;

				if ( ob.hasNameChanged ) {
					orginalNameVal = ob.$name.data( 'original_value' );
					
					continuationName = function() {
						ob.$name
							.val( orginalNameVal )
							.velocity(
								{ color: '#00ddff',
									colorAlpha: 1 },
								{ duration: duration }
						);
					};
					
					ob.$name
						.velocity(
							{ color: clearColor,
						 		colorAlpha: colorAlpha },
							{ duration: duration,
								complete: function() {
									continuationName();
								}
							}
					);
				}
			},
			
			scrollSectionTo: function( $elem, duration ) {
				/**
				* scrolls to a given section in settings page if supplied a section
				* otherwise scrolls to the top.
				*
				* @called : click ev on #settingsNav > a,
				*						click ev on .toTopButton
				*
				* @group : sub nav
				* @page : settings
				*
				* @params {jquery object} - $elem : the element to scroll to
				* @params {int} - duration : the duration of the animated scroll
				*/
				
				// scroll to top
				if ( !$elem ) {
					$El.contentWrap
						.mCustomScrollbar( 'scrollTo', 'top', { scrollInertia: 500 } );
				}
				
				// scroll to given $elem
				if ( !$elem ) {
					duration = ( duration === undefined ? 1000 : duration );
					
					$El.contentWrap
						.mCustomScrollbar( 'scrollTo', $elem, { scrollInertia: duration } );
				}
			},
			
			searchWebForFeeds: function( query ) {
				/**
				* take a string (hopefully a site's title)
				* if there's not string use search for 'the new yorker'
				* remove any substrings listed in rssPermutations
				* add ' rss feed' to the end of the string
				* open a new window and do a google search
				*
				* @called : click ev on #infoSearch,
				*						click ev on #searchWebForFeeds aka $El.searchWebForFeeds
				*
				* @group : search web for feeds
				* @page : faq
				*
				* @params {string} - query : the string to search for, should be the title of a website
				*/
				
				var i,	// count in for loop
						l,	// length in for loop
						rssPermutations = [ ' rss ', ' &rss ', ' rss', ' &rss', '"rss"' ],
						url = 'http://google.com/search?q='; // the url in new tab
						
				query = $.trim( query );
				query = ( !query.length ? 'the new yorker' : query );
				
				for ( i = 0, l = rssPermutations.length; i < l; i += 1 ) {
					if ( query.indexOf( rssPermutations[ i ] ) !== -1 ){ // has rss already in query
						break;
					} else if ( i === l - 1 ) {
						query += ' rss feed';
					}
				}
				
				query = encodeURI( query );
				
				url += query + '&safe=off';
				
				window.open( url );
				
			},
			
			setBatchFeeds: function() {
				/**
				* sets all the basic info to manipulate the batch feed naviagtion at the top of an article's page.
				*	puts the info in the global settings object.
				*
				* @called : init,
				*						loadTemplatePartIntoFrame
				*
				* @group : sub nav / get posts from db / interactive style
				* @page : timeline
				*/
				
				var $jumpToBatch = $( '#jumpToBatch' ), // the <input> to put the page to jump to
						keyCodesLength = S.batchFeeds.keyCodes.length, // ? isn't used in this function
						numDigits, // ? not used anywhere
						$pageCount = $( '#pageCount' ); // the <var> that displays the total number of pages
				
			
				if ( $jumpToBatch.hasClass( 'oneDigit' ) ) {
					numDigits = 1;
				} else if ( $jumpToBatch.hasClass( 'twoDigits' ) ) {
					numDigits = 2;
				} else if ( $jumpToBatch.hasClass( 'threeDigits' ) ) {
					numDigits = 3;
				} else {
					numDigits = undefined;
				}
				
				// sets the page to grab the batch from
				S.batchFeeds.articleType = ( $( '#batchWrap' ).hasClass( 'fresh' ) ? 'fresh' : 'frozen' );
				
				// sets the batch number / page to jump to
				S.batchFeeds.batchCount = parseInt( $pageCount.text(), 10 );
				
				// the batches rarely will be whole. the remainer is the number of posts on the last page.
				// keep track of this bc if you save || delete a post this can change.
				// if changed enough the var#pageCount changes
				S.batchFeeds.postRemainder = parseInt( $pageCount.data( 'post_remainder' ), 10 );
				
				// the current input#jumpToBatch's value
				S.batchFeeds.initValue = parseInt( $jumpToBatch.val(), 10 );
				
				// is the input#jumpToBatch focused
				S.batchFeeds.isFocused = false;
				
				S.batchFeeds.$jumpToBatch = $jumpToBatch;
				
				// right button button#nextBatch
				S.batchFeeds.$next = $( '#nextBatch' );
				
				// ? this isn't used anywhere ?
				S.batchFeeds.numDigits = numDigits;
				
				S.batchFeeds.$pageCount = $pageCount;
				
				// the init input#jumpToBatch's value
				S.batchFeeds.pageNum = parseInt( $jumpToBatch.data( 'page_num' ), 10 );
				
				// left button button#previousBatch
				S.batchFeeds.$prev = $( '#previousBatch' );
				
			},
			
			setConfig: function() {
				/**
				* sets the static global Config object
				*
				* @called : init
				*
				* @group : init
				* @page : splash / timeline
				*/
				
				var ieVersion = F.detectIE();

				// used in cloud animation
			  C.cloudsWidth = window.screen.width;
				C.cloudDistance = C.cloudsWidth * 2;
				C.cloudDuration = C.cloudDistance * 78.06401249024;
				C.cloudAnimationTimer = C.cloudDuration / 2;
				
				if ( $( 'html' ).hasClass( 'csstransforms3d' ) &&
			 			 $( 'html' ).hasClass( 'csstransforms' )
				) {
					C.doCubeFlipAnimation = true;
				}
				
				if ( $( 'html' ).hasClass( 'ie' ) && ( ieVersion < 12 ) ) {
					C.doCubeFlipAnimation = false;
				}
				
				// if in splash, end
				if ( !S.isUserLoggedIn ) {
					return;
				}
				
				C.master = Wp.master;
				
				// the WP id for the user object
				C.userId = parseInt( Wp.config.userId, 10 );
				
				// the login name of the user
				C.userName = Wp.config.userName;
				
				C.isMacAndNonMobile = false;
				
				if ( navigator.userAgent.indexOf( 'Mac OS X' ) !== -1 ) {
					C.isMacAndNonMobile = ( navigator.userAgent.match(/iPad|iPhone|iPod/g) ? false : true );
				}
			},
			
			setDraggableSettings: function() {
				/**
				* description
				*
				* @called : loadTemplatePartIntoFrame
				*
				* @group : freshness / interactive style / update user
				* @page : settings
				*/
				
				var $rangePit;

				$El.rangePit = $( '#rangePit' );
				S.range.text = $( '#rangeResult' ).text();
				S.range.minOffset = $El.rangePit.offset().left;
				S.range.width = $El.rangePit.outerWidth();
				
			},
			
			setPostContent: function( postContent, id ) {
				/**
				* take a newy jquery edited post (was cleaned and imgs wrapped etc) and
				* upload back to the server and rewrite the messy original post's content
				*
				* @called : showInsertedPost
				*
				* @group : toggle post
				* @page : timeline
				*
				* @params {html string} - postContent : the content
				* @params {int} - id : the WP post object's id
				*/
				
				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'set_post_content',
						postContent: postContent,
						id: id
					}
				});
			},
			
			setSettings: function() {
				/**
				* sets variable values in the global object Settings
				*
				* @called : init
				*
				* @group : init
				* @page : splash / timeline
				*/

				var cat,
						ignore;
						
				S.vpWidth = $El.window.width();
				S.vpHeight = $El.window.height();
				
				// if user is logged in, get the values from the the php generated <script> w. the Wp object wrapped in it
				
				if ( S.isUserLoggedIn ) {
					// !! converts to boolean
					
					// if true, a pop up will show if you try to delete a fresh category
					S.doesWarnFreshCategoryDrop = !!Wp.settings.doesWarnFreshCategoryDrop;
					
					// if true, a pop up will show if you try to delete a frozen category
					// !* S.doesWarnFrozenCategoryDrop = !!Wp.settings.doesWarnFrozenCategoryDrop;
					
					// if true, a pop up will show if you try to delete a single post
					S.doesWarnPostDrop = !!Wp.settings.doesWarnPostDrop;
					
					// the freshness limit of a post
					S.freshnessLimit = parseInt( Wp.settings.freshnessLimit, 10 );
					
					// if true, the background clouds animate
					S.isBackgroundAnimating = !!Wp.settings.isBackgroundAnimating;
					
					/*
					the fresh object: {
						id: the fresh parent cat's id
						name: the fresh parent cat's name - it's the username + '_' + 'fresh', ex : 'nate_fresh'
						cats : an object of all the fresh categories
					}
					
					there are as many cats sub-objects as there are fresh cats
					
					a cats sub-object: {
						display_name: the name the user sees ex: 'New Yorker' (not 'new_yorker')
						display_url: the url the user sees on the settings page ex: 'vice.com/rss' not 'http://www.vice.com/rss/'
						ignore: a long string of space-seperated urls of old stories not to get again (becomes an array below)
						rss_url: the actual rss url ex: 'http://www.vice.com/rss/' not 'vice.com/rss'
					}
					*/
					
					S.fresh = Wp.fresh;
					
					// if this object doesn't exist, create it
					if( !S.fresh.cats ) {
						S.fresh.cats = {};
					}
					
					// ? this will always be true bc it sets it above
					// make the 'ignore' url string into an array
					if( S.fresh.cats ) {
						for ( cat in S.fresh.cats ) {
						  if ( S.fresh.cats.hasOwnProperty( cat ) ) {
								ignore = S.fresh.cats[ cat ][ 'ignore' ];
								
								S.fresh.cats[ cat ][ 'ignore' ] = ignore.split( ' ' );
						  }
						}
					}
					
					// the pattern is the same for the fresh object defined above, with 'frozen' replacing 'fresh' where ever it appears
					S.frozen = Wp.frozen;
					// !* S.frozen.cats = ( !S.frozen.cats ? {} : S.frozen.cats );
					
					// the html <title>
					S.title = $El.title.text();
					
				}
				
				// if the user is not logged in (on splash page)
				
				if ( !S.isUserLoggedIn ) {
					// sets the php action when set to the server
					S.loginOrRegister = ( $El.login.attr( 'checked' ) ? 'login' : 'register' );
					S.userNameVal = $El.userName.val();
					S.isBackgroundAnimating = true;
					S.title = $El.title.text();
				}
			},
			
			setVpDimensions: function() {
				/**
				* sets values related to the the width and height of the viewport to the global Settings object
				*
				* @called : init,
				*						resize ev on window
				*
				* @group : utility
				* @page : splash / timeline
				*/
				
				// determine if screen is desktop mode via a html object
				// it becomes no visible when small by media queries
				var isScreenLarge = $El.screenWidthStandardizer.is( ':visible' );
				
				S.vpWidth = $El.window.width();
				S.vpHeight = $El.window.height();
				
				if ( isScreenLarge !== S.isScreenLarge ) {
					S.isScreenLarge = isScreenLarge;
				}
				
				// related to the freshness
				if ( S.currentSection === 'userSettings' ) {
					S.range.minOffset = $El.rangePit.offset().left;
				}
				
			},
			
			showMalformedInputWarning: function( $error, $input, warning ) {
				/**
				* adds the malformed class to the $input (used to prevent certain actions)
				* add warning text to the gven $error and add the visibleError class
				* update the css which will trigger a css animation
				*
				* @called : transitionOutInputFeedInfo,
				*						trySignInOrRegisterUser,
				*						tryToEditExisitingCatName,
				*						addFeedIfExists,
				*						click ev on #createFeed
				*
				* @group : utility
				* @page : settings / splash
				*
				* @params {jquery object} - $error : the p.error elem that follows the malformed text input
				* @params {jquery object} - $input : the text input that is malformed
				* @params {string} - warning : the alert to tell the user, populated in $error
				*/
				
				$input.addClass( 'malformed' );
				
				$error
					.text( warning )
					.addClass( 'visibleError' )
					.velocity(
						{ opacity: 1,
							textIndent: 8 }
				);
				
			},
			
			showPopUp: function( srcId ) {
				/**
				* add the $popUp (the parent of $popUpBox) to the screen by add class 'onScreen'
				* fade out main content by calling toggleMainContent
				* the $popUpBox is invisible so fade it in and move it animate top 3%
				* add focus to the first <input>
				*
				* @called : click ev on #deleteAccount,
				*						click ev on .feedInfo .trash,
				*						click ev on #login aka $El.loginMenuButton
				* @calls : toggleMainContent
				*
				* @group : pop ups
				* @page : settings / splash
				*
				* @params {string} - srcId : a sub-string of the pop up to show. ex: the get #cancelFeedPopUp submit 'cancelFeed'
				*														 the '#' and 'PopUp' elems of the string are added below.
				*/
				
				/* reveal a pop up to confirm an action */
				var $popUp = $( '#' + srcId + 'PopUp' ),
						$popUpBox = $popUp.children();
				
				F.toggleMainContent();
				
				// the delay is equal to the duration in F.toggleMainContent
				$popUp.addClass( 'onScreen' );
				
				$popUpBox
					.velocity(
						{ opacity: 1,
							top: '47%' },
						{ delay: 250,
							complete: function() {
								var $input = $popUpBox.find( 'input' ).eq( 0 );
								
								if ( $input ) {
									$input.focus();
								}
								/* below fixes a weird bug:
									 after the animation it's values from
									 the stylesheet are added directly to the 
									 html in a style attr for some reason.
									 this prevents media queries.
									 happens at least in firefox. */
								$popUpBox
									.removeAttr( 'style' )
									.css(
										{ opacity: 1,
											top: '47%' }
								);
							}
					}
				);
				
			},
			
			stopDrag: function( left ) {
				/**
				* description
				*
				* @called : on mouseleave ev on html when #rangePit has a mousedown ev,
				*						on mouseup ev on html when #rangePit has a mousedown ev
				*
				* @group : freshness / interactive style
				* @page : settings
				*
				* @params {int} - left : ? not used
				*/
				
				$El.html.off( C.mousemove );
				$El.html.off( C.mouseleave );
				$El.html.off( C.mouseup );
				
			},
			
			stripWww: function( url ) {
				/**
				* description
				*
				* @called : errorCheckUrl
				*
				* @group : add feed
				* @page : settings
				*
				* @params {url string} - url : the rss url inputed in #newFeedUrl
				*
				* @returns {url string} - url : the rss url w.out 'www.'
				*/
				
				var url = $.url( url ),
						host = url.attr( 'host' ),
						path = url.attr( 'relative' ),
						protocol = url.attr( 'protocol' ) + '://';
						
				if ( host.slice( 0, 4 ) === 'www.' ) {
					host = host.slice( 4 );
				}
				
				url = protocol + host + path;
				
				return url;
			},
			
			submitUpdatedSettings: function() {
				/**
				* description
				*
				* @called : 
				* @calls : 
				*
				* @group : 
				* @page : 
				*
				* @params {type} - name :
				*
				* @returns {type} - name :
				*/
				
				// ?
			},
			
			toggleCheckBox: function( $checkbox ) {
				/**
				* description
				*
				* @called : click ev on #isBackgroundAnimating
				*
				* @group : interactive style / cloud animation
				* @page : settings
				*
				* @params {jquery object} - $checkbox : #isBackgroundAnimating checkbox
				*/
				
				$checkbox.toggleClass( 'checked' );
				
				if ( $checkbox.attr( 'checked' ) ) {
					$checkbox.removeAttr( 'checked' );
				} else {
					$checkbox.attr( 'checked', '' );
				}
				
			},
			
			toggleCloudAnimation: function( bool, doesPreventSend ) {
				/**
				* turns off and on the cloud animation (bool) and by default changes the user setting
				* but this can be overwritten (w. doesPreventSend)
				* if bool is true you turn on animation animation by calling initiateCloudAnimation end if;
				* if bool is false you stop the cloud animation, fade out the clouds, set their css, fade them back in endif;
				* if doesPreventSend is true end the function endif;
				* otherwise send the data to the db to update the user setting
				*
				* @called : trySignInOrRegisterUser,
				*						click ev on #isBackgroundAnimating,
				*						init
				* @calls : initiateCloudAnimation
				*
				* @group : cloud animation / update user
				* @page : settings / splash / timeline
				*
				* @params {bool} - bool : true starts animation / false stops it
				* @params {bool} - doesPreventSend : stops the user setting being updated 
				*/
				
				// doesPreventSend is optional; if true it doesn't update
				// the database. used for logging in.
				if ( bool ) {
					bool = 1;
					S.isBackgroundAnimating = true;
					// start cloud animation
					F.initiateCloudAnimation();
				} 
				
				if ( !bool ) {
					bool = 0;
					S.isBackgroundAnimating = false;
					// stop cloud animation
					$El.clouds.velocity( 'stop' );
					
					$El.clouds
						.velocity(
							{ opacity: 0 },
							{ duration: 300,
								complete: function() {
									$El.cloudsA.css( 'left', 0 );
									$El.cloudsB.css( 'left', '100%' );
									$El.clouds
										.css( 'width', '100%')
										.velocity(
											{ opacity: 1 },
											{ duration: 300 }
									);
								}
						}
					);
				}
				
				if ( doesPreventSend ) {
					return;
				}
				
				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'toggle_cloud_animation',
						bool: bool,
						id: C.userId
					}
				});
				
			},
			
			toggleEditFeedInstructions: function() {
				/**
				* description
				*
				* @called : insertFeedInfo,
				*						removeFeed
				*
				* @group : add feed / delete feed / interactive style
				* @page : settings
				*/
				
				var $feedInstructions = $( '#editFeedsWrap > .info' ),
						newText = $feedInstructions.data( 'other_instructions' ),
						oldText = $feedInstructions.text();
				
				$feedInstructions
					.velocity(
						{ opacity: 0 },
						{ duration: 200,
							complete: function() {
								$feedInstructions
									.text( newText )
									.data( { 'other_instructions': oldText } )
									.velocity(
										{ opacity: 1 },
										{ duration: 200 }
								);
							}
					}
				);
				
			},
			
			toggleFeedInfoSeperator: function( str, $feedInfo ) {
				/**
				* description
				*
				* @called : removeFeed
				*
				* @group : add feed / delete feed / interactive style
				* @page : settings
				*
				* @params {string} - str : the action 'added' || 'removed' ? is this used ?
				* @params {jquery object} - $feedInfo : the div.feedInfo
				*/
				
				var continuation,
						$hr = $feedInfo.find( '.hr' ),
						hrHeight = ( S.vpWidth > 500 ? 12 : 8 ),
						hrMarginBtm = ( S.vpWidth > 500 ? 15 : 12 ),
						hrMarginTop = ( S.vpWidth > 500 ? 8 : 6 ),
						feedInfoDeltaHeight = hrHeight + hrMarginBtm + hrMarginTop;
						
				if ( str === 'removed' ) {
					$hr
						.velocity(
							{ opacity: 0 },
							{ duration: 300,
								complete: function() {
									continuation();				 
								}
							}
					);
											 
					continuation = function() {
						$feedInfo
							.velocity(
								{ height: '-=' + feedInfoDeltaHeight + 'px' },
								{ duration: 300 }
						);
						
						$hr
							.velocity(
								{ height: 0,
									marginTop: 0,
									marginBottom: 0 },
								{ duration: 300 }
						);
					};
				}
				
			},
			
			toggleMainContent: function() {
				/**
				* fades out or in main content
				*
				* @called : hidePopUp,
				*						showPopUp
				*
				* @group : pop ups
				* @page : all
				*/
				
				var isHidden = $( '#main' ).hasClass( 'hide' ),
						opacity = ( isHidden ? 1 : 0 );
				
				if ( isHidden && ( C.isChrome || C.isSafari || C.isIphone ) ) {
					$El.main.css( 'height', '100%' );
				}
				
				$El.main
					.velocity(
						{ opacity: opacity },
						{ duration: 250,
							complete: function() {
								if( !isHidden && ( C.isChrome || C.isSafari || C.isIphone ) ) {
									$El.main.css( 'height', 0 );
								}

								if ( isHidden ) {
									$El.main.removeClass( 'hide' );
								} else {
									$El.main.addClass( 'hide' );
								}
							}
					}
				);
				
			},
			
			toggleMobileNav: function() {
				/**
				* description
				*
				* @called : click ev on #homeNav .buttonWrap,
				*						click ev on .menuButton,
				*						click ev on #homeNavWrap > .close > .closeButton aka $El.closeMobileNav
				*
				* @group : main nav
				* @page : all but splash
				*/
				
				var	isMenuOnScreen = $El.homeNavWrap.hasClass( 'onScreen' ),
						addClass = ( isMenuOnScreen ? 'offScreen' : 'onScreen' ),
						removeClass = ( isMenuOnScreen ? 'onScreen' : 'offScreen' );
				
				$El.homeNavWrap
					.addClass( addClass )
					.removeClass( removeClass );
				
			},
			
			togglePageLoadingIcon: function() {
				/**
				* adds or removes the page loading screen
				* toggle by testing for the page already having the page loading screen
				*
				* @called : transitionToSection,
				*						transitionToLoggedIn,
				*						updateBatchFeeds,
				*						articleRefreshTransition,
				*						closeTutorial,
				*						loadTemplatePartIntoFrame,
				*						launchTutorial
				*
				* @group : transition
				* @page : all
				*/
				
				// get the element
				var $pageLoadingWrap = $( '#pageLoaderWrap' );
				
				// if it doesn't exist, create it, you toggle it on
				if( !$pageLoadingWrap.length ){
					$pageLoadingWrap = $( '<div id="pageLoaderWrap">' +
																	'<div id="pageLoader">' +
															 			'<div id="loadingWaves">' +
																			'<div id="darkWave"></div>' +
																			'<div id="lightWave"></div>' +
																		'</div>' +
																	'</div>' +
																'</div>' );
				// add it and fade it in
					$pageLoadingWrap
						.prependTo( $El.main )
						.velocity(
							{ opacity: 1 },
							{ duration: 200 }
					);
				} else {
					// hide and destroy page loading element
					$pageLoadingWrap
						.velocity(
							{ opacity: 0 },
							{ duration: 200,
								complete: function() {
									$pageLoadingWrap.remove();
								}
							}
					);
				}
				
			},
			
			togglePostButtonCorners: function( $header ) {
				var addClass = ( $header.hasClass( 'roundCorners' ) ? 'squareCorners' : 'roundCorners' ),
						removeClass = ( addClass === 'squareCorners' ? 'roundCorners' : 'squareCorners' );
						
				$header
					.addClass( addClass )
					.removeClass( removeClass );
			},
			
			togglePostContent: function( $expandableContentWrap, height, isInfo ) {
				/**
				* description
				*
				* @called : mouseenter / leave || click ev .expandableButton, .postHeaderText,
				*						click ev on .closePost
				* @calls : gutPost
				*
				* @group : toggle post / interactive style
				* @page : timeline / faq
				*
				* @params {jquery object} - $expandableContentWrap : the div.expandableContentWrap; has the .postHeader, .expandableContent, .closePost
				* @params {int} - height : if closing it's 0,
				*													 if it's opening on the timeline it's the outer height of the post,
				*													 if it's opening in faq it's the outer height + 65
				* @params {int} - animationDuration : the animation of the opening || closing
				*/
				
				var headerTop, // the bottom offset
						height = ( height > document.documentElement.clientWidth ? document.documentElement.clientWidth : height ),
						animationDuration = F.getAnimationDuration( height, 900 ),
						isOpening = $expandableContentWrap.hasClass( 'closed' ),
						$postThumbWrap = $expandableContentWrap.prev().find( '.postThumbWrap' ),
						scrolledAmount,
						timeLineHeight,
						top,
						vpHeight;
				
				
				$postThumbWrap
					.removeClass( 'unviewedTextThumb' )
					.addClass( 'viewedTextThumb' );
				
				
				
				if ( isOpening ) {
					$expandableContentWrap
						.velocity(
							{ height: height },
							{ duration: animationDuration,
								delay: 50,
								complete: function() {
									$expandableContentWrap
										.css(
											{ height: 'auto',
												overflow: 'visible' } )
										.addClass( 'open' )
										.removeClass( 'closed' );
									
								}
							}
					);
					
				} else {
					$expandableContentWrap
						.css( 'overflow', 'hidden' )
						.velocity(
							{ opacity: 0 },
							{ duration: 300,
								complete: function() {
									$expandableContentWrap
										.velocity(
											{ height: 0 },
											{ duration: animationDuration,
												complete: function() {
													F.togglePostButtonCorners( $expandableContentWrap.prev() );
													
													$expandableContentWrap
														.addClass( 'closed' )
														.removeClass( 'open' )
														.css( 'opacity', 1 );
														
														if ( !isInfo ) {
															F.gutPost( $expandableContentWrap );
														}
												}
											}
									);
								}
							}
					);
				}
			},
			
			toggleSettingsForm: function() {
				/**
				* description
				*
				* @called : toggleSettingsForm (self),
				*						click ev on #toggleSettings aka $El.toggleSettings
				* @calls : toggleSettingsForm (self)
				*
				* @group : 
				* @page : 
				*/
				
				
				var duration = 0,
						left = ( $El.settingsForm.data( 'show' ) ? -1 * $El.settingsForm.width() : 0 );
				
				$El.toggleSettings.off( C.click );
				
				$El.settingsForm
					.velocity(
						{ left: left },
						{ duration: duration,
							complete: function() {
								if ( left ) { // if animating in
									$El.settingsForm.css( 'left', '-100%' );
									//F.updateFormSettings();
								}
								
								// changes show to opposite bool
								$El.settingsForm.data( { show: !$El.settingsForm.data( 'show' ) } );
								
								$El.toggleSettings.on( C.click, function() {
									F.toggleSettingsForm();
								});
							}
					}
				);
				
			},
			
			toggleSplashAbout: function() {
				/**
				* show / hide the splash about.
				* has fallback if no css animations.
				*
				* @called : askWantsTutorial,
				*						click ev #splashNav .about aka $El.splashAboutBtn,
				*						click ev on #skip,
				*						cubeTransToNothing
				*
				* @group : splash about
				* @page : splash
				*/
				
				var addClass,
						$hideElem, // used for fall back if no css animation
						removeClass,
						$showElem; // used for fall back if no css animation
				
				if ( $El.splashAboutWrap.hasClass( 'showAbout' ) ) {
					addClass = 'hideAbout';
					removeClass = 'showAbout';
					$hideElem = $El.rectTop;
					$showElem = $El.rectFront;
					
				} else if ( $El.splashAboutWrap.hasClass( 'hideAbout' ) ) {
					addClass = 'showAbout';
					removeClass = 'hideAbout';
					$hideElem = $El.rectFront;
					$showElem = $El.rectTop;
					
				} else {
					// init state
					
					addClass = 'showAbout';
					removeClass = '';
					$hideElem = $El.rectFront;
					$showElem = $El.rectTop;				
				}
				
				$El.splashAboutWrap
					.addClass( addClass )
					.removeClass( removeClass );
				
				if ( C.doCubeFlipAnimation ) {
					// reveal / hide using css animations
					
					
				} else {
					// fallback if no css animations
					$showElem.css( 'opacity', 0 )
					
					$hideElem
						.velocity(
							{ opacity: 0,
						 		zIndex: -1	},
							{ duration: 200,
								complete: function() {
									$showElem
										.velocity(
											{ opacity: 1,
												zIndex: 1000 },
											{ duration: 200 }
									);
								}
						}
					);
				}
				
			},
			
			transitionOutInputFeedInfo: function() {
				/**
				* description
				*
				* @called : addFeedIfExists
				* @calls : showMalformedInputWarning,
				*					 hideMalformedInputWarning
				*
				* @group : add feed / interactive style
				* @page : settings
				*/
				
				var $newFeedTitle = $( '#newFeedTitle' ),
						$newFeedUrl = $( '#newFeedUrl' ),
						$success = $newFeedTitle.next(),
						resetErrorDefaults;
				
				$newFeedTitle
					.velocity(
						{ color: '#fafafa' },
						{ duration: 300 }
				);
				
				$newFeedUrl
					.velocity(
						{ color: '#fafafa' },
						{ duration: 300,
							complete: function() {
								$newFeedTitle
									.val( $newFeedTitle.attr( 'placeholder' ) );
							
								$newFeedUrl
									.val( $newFeedUrl.attr( 'placeholder' ) )
									.add( $newFeedTitle )
									.velocity(
										{ color: '#00ddff' },
										{ velocity: 300,
											complete: function() {
												$newFeedTitle.val( '' );
												$newFeedUrl.val( '' );
											}
									}
								);
						}
					}
				);

				
				$success.addClass( 'success' );
				
				F.showMalformedInputWarning( $success, $newFeedTitle, 'successfully added feed!' );
				
				resetErrorDefaults = function( doTriggerHideWarning ) {
					if ( doTriggerHideWarning ) {
						F.hideMalformedInputWarning( $newFeedTitle, $success );
					}
					
					window
						.setTimeout( function() {
							$success.removeClass('success');
						},
					350 );
					
					delete S.timer.addFeed;
				};
				
				S.timer.addFeed = window.setTimeout( function() {
					resetErrorDefaults( true );
			 	}, 4000);
				
				$newFeedTitle.one( 'focus.one', function() {
					resetErrorDefaults();
				} );
				
				delete S.stopAction.addFeed;
				
			},
			
			transitionToSection: function( templatePart, articleType, batchNumber ) {
				/**
				* get all the children of div#currentMainSectionWrap, fade them out and erase them
				* add the loading icon to the page
				* load the new page into div#currentMainSectionWrap by calling loadTemplatePartIntoFrame
				*
				* @called : click ev on #homeNave .buttonWrap
				* @calls : togglePageLoadingIcon,
				*					 loadTemplatePartIntoFrame
				*
				* @group : main nav / transition
				* @page : all but splash
				*
				* @params {string} - templatePart : the name of the php template file to load
				* @params {string} - articleType : 'fresh' || 'frozen'; only applicable if templatePart is 'articles'
				* @params {int} - batchNumber : // ? isn't used in this function
				*/
				
				var batchNumber = batchNumber,
						$destroyedElems = $El.currentMainSectionWrap.children();
				
				F.turnOffScrollEverywhere();
				
				$destroyedElems
					.velocity(
						{ opacity: 0 },
						{ duration: 1000,
							complete: function() {
								$destroyedElems.remove();
								
								F.togglePageLoadingIcon();
								
								F.loadTemplatePartIntoFrame( templatePart, $El.currentMainSectionWrap, articleType, batchNumber );
								
							}
					}
				);
				
			},
			
			transitionToLoggedIn: function( actionTaken ) {
				/**
				* this is after the user submit info in the splash input fields
				* it hides the loading screen and loads the timeline
				*
				* @called : trySignInOrRegisterUser,
				*						click ev on #signUpTutorial, #continue
				* @calls : togglePageLoadingIcon,
				*					 loadTemplatePartIntoFrame
				*
				* @group : sign up || login / pop ups / transition
				* @page : splash
				*
				* @params {string} - actionTaken : 'log in' || 'sign up'
				*/
				
				var $destroyedElems = $El.main.children(),
						continuation;
				
				continuation = function() {
					$destroyedElems.remove();
					
					F.togglePageLoadingIcon();
					F.loadTemplatePartIntoFrame( 'logged-in', $El.main );
				};
				
				if ( actionTaken === 'log in' ) {
					continuation();
				} else if ( actionTaken === 'sign up' ) {
					$destroyedElems
						.velocity(
							{ opacity: 0 },
							{ duration: 1000,
								complete: function() {
									continuation();
								}
						}
					);
				}
				
			},
			
			trySignInOrRegisterUser: function( args ) {
				/**
				* tries to either sign up or login the user
				* error checks the input fields b4 sending
				* shows errors from database if applicable
				* sets global settings from db info
				* prompts tutorial, transitions to page
				*
				* @called : click ev on #loginPopUp .enter aka $El.loginPopUpButton,
				*						click ev on #signUpPopUp .register aka $El.signUpPopUpButton
				* @calls : showMalformedInputWarning,
				*					 hidePopUp,
				*					 askWantsTutorial
				*					 transitionToLoggedIn
				*					 toggleCloudAnimation
				*
				* @group : sign up || login / pop ups / transition
				* @page : splash
				*
				* @params {object} - args : {
				*						userName: {string},
				*						password: {string},
				*						action: {string},
				*						wrapper: {jquery object}
				*					}
				*/
				
				var noSpacesUsername = args.userName.replace(/\s+/g, ''),
						$password = args.wrapper.find( $( 'input' ) ).eq( 1 ),
						$passwordError = $password.next(),
						$username = args.wrapper.find( $( 'input' ) ).eq( 0 )
						$usernameError = $username.next();
				
				// this was rewritten during code clean up, see org below
				// error detect pre-flight
				// blank username
				if ( args.userName.length === 0 ) {
					F.showMalformedInputWarning( $usernameError, $username, 'field is empty' );
				}
				
				// spaces in username
				if ( args.userName.length === 0 && ( args.userName.length > noSpacesUsername.length ) ) {
					F.showMalformedInputWarning( $usernameError, $username, 'username can\'t have spaces' );
				}
				
				// blank password
				if ( args.password.length === 0 ) {
					F.showMalformedInputWarning( $passwordError, $password, 'field is empty' );
				}
				
				// password too short (sign up)
				if ( args.password.length <= 4 && args.action === 'register_user' ) {
					$input = args.wrapper.find( $( 'input' ) ).eq( 1 );
					$error = $input.next();
			
					F.showMalformedInputWarning( $passwordError, $password, 'pass must be more than 4 chars' );
				}
				
				// password too short (login)
				if ( args.password.length <= 4 && args.action === 'login_user' ) {
					$input = args.wrapper.find( $( 'input' ) ).eq( 1 );
					$error = $input.next();
			
					F.showMalformedInputWarning( $passwordError, $password, 'username, password don\'t match' );
				}
				
				// stop function if any errors from above
				
				if ( args.userName.length === 0 ||
						 args.password.length <= 4 ||
						 args.userName.length > noSpacesUsername.length )
				{
					delete S.stopAction.popUp;
					return;
				}
				
				// send info to server
				
				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: args.action,
						password: args.password,
						userName: args.userName
					},
					success: function( data ) {
						// note that the object that is returned is large. 
						//   consult the register or login functions in functions.php
						var data = JSON && JSON.parse( data ) || $.parseJSON( data );
						// console.log(data);
						delete S.stopAction.popUp;
						
						
						// errors from server if found
						
						// if the server handled register and the user name is already in use.
						if ( data.callbackFrom === 'register_user' && data.userId === false  ) {
							F.showMalformedInputWarning( $usernameError, $username, 'username is taken' );
							
							return;
						}
						
						// if the server handled login and the user name and password don't match.
						if ( data.callbackFrom === 'login_user' && data.userId === false ) {
							F.showMalformedInputWarning( $passwordError, $password, 'username, password don\'t match' );
							
							return;
						}

						// sets config object
						C.master = data.master;
						C.userId = data.config.userId;
						C.userName = data.config.userName;
						
						// sets settings object
						S.fresh = data.fresh;
						S.frozen = data.frozen;
						S.doesWarnFreshCategoryDrop = data.settings.doesWarnFreshCategoryDrop;
						S.doesWarnPostDrop = data.settings.doesWarnPostDrop;
						S.freshnessLimit = data.settings.freshnessLimit;
						S.isBackgroundAnimating = data.settings.isBackgroundAnimating;
						S.isUserLoggedIn = true;
						S.vpHeight = $El.window.height();
						S.vpWidth = $El.window.width();
						
						$El.html
							.removeClass( 'loggedOut' )
							.addClass( 'loggedIn' );
				
						F.hidePopUp();
						
						if ( args.action === 'register_user' ) {
							S.fresh.cats = {};
							
							// removes splash elements from page
							
							$( '#splashNav' )
								.velocity(
									{ opacity: 0 },
									{ complete: function() {
											$( '#splashNav' ).remove();
											
											//*
										}
								}
							);
																	
							F.askWantsTutorial();
						}
						
						if ( args.action === 'login_user' ) {
							F.transitionToLoggedIn( 'log in' );
							
							// start bg animation w out change user settings
							if ( !S.isBackgroundAnimating ) {
								F.toggleCloudAnimation( false, true );
							}
						}
					}
				});
			},
			
			tryToEditExisitingCatName: function( $feedInfo ) {
				/**
				* description
				*
				* @called : click ev on .saveOrEditFeed.save
				* @calls : errorCheckName,
				*					 updateExistingCatName,
				*					 showMalformedInputWarning,
				*					 makeFeedInfoNonEditable
				*
				* @group : update feed
				* @page : settings
				*
				* @params {jquery object} - $feedInfo : the div.feedInfo wrapper
				*/
				
				var doErrorCheckName = true,
						$error,
						$existingFeedTitle = $feedInfo.find( '.existingFeedTitle' ),
						newName = $.trim( $existingFeedTitle.val() ),
						oldName = $existingFeedTitle.data( 'original_value' );
				
				if ( !newName.length || ( newName.toLowerCase() === oldName.toLowerCase() ) ) {
					$existingFeedTitle
						.css( 'color', 'rgba(79,79,79,0)' )
						.val( oldName );
						
					doErrorCheckName = false;
				} else if ( F.errorCheckName( newName.toLowerCase() ) === true) {
					newName = titleCaps( newName );
					
					$existingFeedTitle
						.css( 'color', 'rgba(79,79,79,0)' )
						.val( newName )
						.data( 'original_value', newName );
														
					F.updateExistingCatName( 'both', newName, oldName );
				} else {
					$error = $feedInfo.find( '.error' );
					
					F.showMalformedInputWarning( $error, $existingFeedTitle, 'Feed name is already in use.' );
					
					return;
				}
				
				F.makeFeedInfoNonEditable( $feedInfo );
				
			},
			
			turnOffScrollEverywhere: function() {
				$( '#main' ).off( 'mousewheel DOMMouseScroll' );
				
				$( '.mCSB_dragger' ).velocity(
					{ opacity: 0 },
					{ duration: 200 }
				);
			},

			updateBatchFeeds: function() {
				/**
				* description
				*
				* @called : deleteOrSavePost
				* @calls : togglePageLoadingIcon,
				*					 loadTemplatePartIntoFrame
				*
				* @group : sub nav / get posts from db
				* @page : timeline
				*/
				
				var addClass,
						removeClass;
						
				if ( S.batchFeeds.postRemainder - 1 !== 0 ) {
					S.batchFeeds.postRemainder = S.batchFeeds.postRemainder - 1;
					
					return;
				}
				
				S.batchFeeds.postRemainder = S.batchFeeds.postsPerBatch;
				S.batchFeeds.batchCount = S.batchFeeds.batchCount - 1;
				
				if ( S.batchFeeds.batchCount === 9 ) {
					addClass = 'oneDigit';
					removeClass = 'twoDigits';
				} else if ( S.batchFeeds.batchCount === 99 ) {
					addClass = 'twoDigits';
					removeClass = 'threeDigits';
				} else if ( S.batchFeeds.batchCount === 999 ) {
					addClass = 'threeDigits';
					removeClass = 'fourDigits';
				} else if ( S.batchFeeds.batchCount === 9999 ) {
					addClass = 'fourDigits';
				}
				
				if ( addClass ) {
					S.batchFeeds.$pageCount
					 	.addClass( addClass )
						.removeClass( removeClass );
				}
				
				console.log( S.batchFeeds );
				
				if ( S.batchFeeds.batchCount > 1 ) {
					// fade replace value
					S.batchFeeds.$pageCount.addClass( 'transitioning' );
					
					// css animation takes 400ms
					
					window.setTimeout( function() {
						S.batchFeeds.$pageCount
							.text( S.batchFeeds.batchCount )
							.removeClass( 'transitioning' );
					}, 400);
					
					if ( S.batchFeeds.batchCount === S.batchFeeds.initValue ) {
						// fade out next arrow too
						$( '#nextBatchWrap' )
							.velocity(
								{ opacity: 0 },
								{ duration: 400,
									complete: function() {
										$( this ).addClass( 'hidden' );
									}
								}
						);
					} else if ( S.batchFeeds.batchCount < S.batchFeeds.initValue ) {
						// fade get batch value too
						S.batchFeeds.$jumpToBatch.addClass( 'transitioning' );
							
						window.setTimeout( function() {
							S.batchFeeds.$jumpToBatch
								.val( S.batchFeeds.batchCount )
								.removeClass( 'transitioning' );
						}, 400);
					}
				} else if ( S.batchFeeds.batchCount === 1 ) {
					$( '#batchWrap' )
						.velocity(
							{ opacity: 0 },
							{ duration: 400,
								complete: function() {
									$( this ).addClass( 'hidden' );
								}
						}
					);
				} else if ( S.batchFeeds.batchCount === 0 ) {
					// reload the page
					$El.currentMainSectionWrap
						.children()
						.velocity(
							{ opacity: 0 },
							{ duration: 300,
								complete: function() {
									$( this ).remove();
									
									F.togglePageLoadingIcon();
									
									window.setTimeout( function() {
										F.loadTemplatePartIntoFrame( 'articles', $El.currentMainSectionWrap, S.batchFeeds.articleType	);
									}, 200);
							}
						}
					);
				}
				
			},
			
			updateExistingCatName: function( type, newBaseName, oldBaseName ) {
				/**
				* description
				*
				* @called : tryToEditExisitingCatName
				*
				* @group : update feed
				* @page : settings
				*
				* @params {string} - type : 'fresh' || 'frozen' || 'both'
				* @params {string} - newBaseName : a feed's new display name
				* @params {string} - oldBaseName : a feed's old display name
				*/
				
				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'update_cat_name',
						type: type,
						newBaseName: newBaseName,
						oldBaseName: oldBaseName
					},
					success: function( data ) {
						console.log( data );
						
						catIds = $.parseJSON( $.trim( data ) );
						
						if ( catIds.freshId ) {
							S[ 'fresh' ][ 'cats' ][ 'cat' + catIds.freshId ][ 'display_name' ] = newBaseName;
						}
						
						console.log( S[ 'fresh' ][ 'cats' ] );
					
					}
				});
				
			},
			
			updateGripTextAndDatabase: function( percent ){
				/**
				* using the percent of #rangePit the dragged to the left of its container,
				* calculate the new display text of var#rangeResult and the new freshness limit.
				* the freshness limit is broken into sets of 12 hour blocks going from 1 to 2.5 days, then forever.
				* forever basically turns of the freshness.
				* once it's determined, send the info to the server.
				*
				* @called : changeGripPosition
				*
				* @group : freshness / interactive style
				* @page : settings
				*
				* @params {int} - percent : left / 180 (aka S.range.maxLeft) * 100
				*/
				
				var freshnessFactor = 60 * 60 * 24, // one whole day in s
						freshnessLimit,
						text;
						
				if ( percent <= 20 ) {
					freshnessLimit = freshnessFactor;
					text = '1 Day';
					
				} else if ( percent > 20 && percent <= 40 ) {
					freshnessLimit = freshnessFactor * 1.5;
					text = '36 Hours';
					
				} else if ( percent > 40 && percent <= 60 ) {
					freshnessLimit = freshnessFactor * 2;
					text = '2 Days';
					
				} else if ( percent > 60 && percent <= 80 ) {
					freshnessLimit = freshnessFactor * 2.5;
					text = '2.5 Days';
					
				} else {
					freshnessLimit = 0;
					text = 'Forever';
					
				}
				
				if ( text !== S.range.text ) {
					$( '#rangeResult' ).text( text );
					
					S.range.text = text;
					
					S.freshnessLimit = freshnessLimit;
					
					$.ajax({
						type: 'POST',
						url: C.ajaxUrl,
						data: {
							action: 'update_freshness_limit',
							freshnessLimit: freshnessLimit,
							id: C.userId
						}
					});
				}
				
			},

			updateOneSetting: function( val, metaKey ) {
				/**
				* this is only used w. toggling the cloud animation.
				* the new value (val) is sent to change a user setting (the metakey).
				*
				* @called : click ev on #cancelFeedPopUp [type="checkbox"] + .style,
				*
				* @group : update user / pop ups
				* @page : settings
				*
				* @params {bool} - val : the new value
				* @params {string} - metaKey : the metakey for a member of a WP object to be updated
				*/
				
				// this looks like it only updates one thing / used one place even tho it looks more universal
				
				// NOTE this is only used for ints and bools bec that's all that is required.
				// don't put in any thing else
				$.ajax({
					type: 'POST',
					url: C.ajaxUrl,
					data: {
						action: 'update_one_setting',
						val: val,
						metaKey: metaKey
					}
				});
			},
			
			wrapCanvases: function( $canvases, id, $post, $wrap, $expandableContent ) {
				/**
				* description
				*
				* @called : preInsertPostInPage
				* @calls : showInsertedPost
				*
				* @group : toggle post / get posts from web
				* @page : timeline
				*
				* @params {jquery object} - $canvases : // ? this isn't used in this function
				* @params {int} - id : the WP post's id; found in the data-id attr on the article.postWrap
				* @params {jquery object} - $post : !!!! could be one of two things, not sure
				* @params {jquery object} - $wrap : the article.postWrap
				* @params {jquery object} - $expandableContent : the article.postWrap's div.expandableContent
				*/
				
				var aspectRatio,
						$embeds = $post.find( 'embed' ),
						$childEmbed,
						$embeddedInteractive,
						i = 0,
						$iframes = $post.find( $( 'iframe' ) ),
						l,
						$objects = $post.find( $( 'object' ).not( $( 'object[data$=".svg"]' ) ) ),
						$sibling,
						tagname,
						$this;
						
				if( $embeds.length ) {
					$embeds = $embeds.filter( function() {
						var $embed = $( this ),
								parentTag = $embed.parent().prop( 'tagName' ).toLowerCase(),
								$sibling = $embed.prev()
								siblingTag = '';
								
						if ( $sibling.length ) {
							siblingTag = $sibling.prop( 'tagName' ).toLowerCase()
						}
						if ( parentTag !== 'object' && siblingTag !== 'iframe' ) {
							return $embed;
						}
					});
				}

				if ( $iframes.length ) {
					$embeddedInteractive = $iframes.add( $embeds ).add( $objects );
					
				} else if ( $embeds.length ) {
					$embeddedInteractive = $embeds.add($iframes).add($objects);
					
				} else if ( $objects.length ) {
					$embeddedInteractive = $objects.add($iframes).add($embeds);
					
				} else {
					return;
					
				}
				
				l = $embeddedInteractive.length;
				
				for ( i; i < l; i = i + 1 ) {
					$this = $embeddedInteractive.eq( i );
					tagName = $this.prop( 'tagName' ).toLowerCase();

					if ( tagName !== 'iframe' ) {

						// check to see if there are any <embed> children.
						// if there are, check to see if there are any set widths
						// or heights that are not 100%.
						// if there are, change their value to 100%.

						$childEmbed = $this.find( 'embed' ).filter( function() {
							$embed = $( this );
							
							if ( $embed.attr( 'src' ) !== undefined && 
								 ( $embed.attr( 'height' ) !== undefined ||
									 $embed.attr( 'width' ) !== undefined ) )
							{
								return $embed;
							}
						});

						if ( $childEmbed.length ) {
							$childEmbed.attr(
								{ height: '100%',
									width: '100%'}
							);
						}
					}

					height = $.trim( $this.attr( 'height' ) );
					// trim makes undefined into an empty string
					
					if ( height === '' || height === undefined || ( height[ height.length - 1 ] === '%' ) ) {
						height = 488;
					} else {
						height = parseInt( height, 10 );
					}

					width = $.trim( $this.attr( 'width' ) );
					
					if ( width === '' || width === undefined || ( width[ width.length - 1 ] === '%' ) ) {
						width = 650;
					} else {
						width = parseInt( width, 10 );
					}

					aspectRatio = height / width;

					if ( width > 650 ) {
						width = containerWidth;
						height = containerWidth * aspectRatio;
					}

					aspectRatio = aspectRatio * 100 + '%';

					$this
						.wrap( '<span class="outerVideoWrap" style="max-width: ' + width + 'px;" />' )
						.wrap( '<span class="innerVideoWrap" style="padding-bottom: ' + aspectRatio + ';" />' );
	
					// blipp tv exception
					// blipp tv has an iframe and embed sibling pairing
 
					if ( tagName === 'iframe' ) {
						$sibling = $this.parent().parent().next();
						
						if ( $sibling.length ) {
							if ( $sibling.prop( 'tagName' ).toLowerCase() === 'embed' ) {
								$this.after( $sibling );
							}
						}
					}
					
					S[ 'globalHolder' ][ 'canvases' + id ][ 'areWrapped' ] = true;
					console.log( 'called!' );
				}
				
				if ( S[ 'globalHolder' ][ 'imgs' + id ][ 'areWrapped' ] && S[ 'globalHolder' ][ 'canvases' + id ][ 'areWrapped' ] ) {
					//console.log( 'called!' );
					F.showInsertedPost( $post, $wrap, $expandableContent );
				}
				
			},
			
			wrapImgs: function( $imgs, id, $post, $wrap, $expandableContent ) {
				/**
				* description
				*
				* @called : preInsertPostInPage
				* @calls : wrapImgs (self),
				*					 showInsertedPost
				*
				* @group : toggle post / get posts from web
				* @page : timeline
				*
				* @params {jquery object} - $imgs : the <img>s in $expandableContent
				* @params {int} - id : the WP post's id; found in the data-id attr on the article.postWrap
				* @params {jquery object} - $post : !!!! could be one of two things, not sure
				* @params {jquery object} - $wrap : the article.postWrap
				* @params {jquery object} - $expandableContent : the article.postWrap's div.expandableContent
				*/
				
				var i = 0,
						height,
						$img,
						img,
						l = $imgs.length,
						src,
						width = 0;
						
				for ( i; i < l; i = i + 1 ) {
					$img = $imgs.eq( i );
					src = $img.attr( 'src' );
					
					if ( src === undefined ) {
						$img.remove();
					} else {
						img = new Image();
						img.src = src;
						width = img.width;
					}
					
					if ( width !== 0 && src !== undefined ) {
						height = img.height;
						
						$img
							.removeClass( 'unwrapped' )
							.removeAttr( 'width' )
							.removeAttr( 'height' )
							.css( { 'max-width': width + 'px',
						 					'max-height': height + 'px' } );
					}
				}
				
				$imgs = $imgs.filter( function( index ) {
					if ( $( this ).hasClass( 'unwrapped' ) ) {
						return this;
					}
				});
				
				if ( $imgs.length ) {
					setTimeout( function() {
						F.wrapImgs( $imgs, id, $post, $wrap, $expandableContent );
					}, 50);
				} else {
					S[ 'globalHolder' ][ 'imgs' + id ][ 'areWrapped' ] = true;
					
					if( S[ 'globalHolder' ][ 'imgs' + id ][ 'areWrapped' ] && S[ 'globalHolder' ][ 'canvases' + id ][ 'areWrapped' ] ) {
						$imgs
							.removeAttr( 'width' )
							.removeAttr( 'height' );
					
						
						
						F.showInsertedPost( $post, $wrap, $expandableContent );
					}
				}
			}
			
		},
		
		init: function() {
			/**
			* the initiating function
			*
			* @called : init
			* @calls : cacheEls,
			*					 setSettings,
			*					 setConfig,
			*				 	 bindUiActions,
			*				   removePreloadClass,
			*					 setVpDimensions,
			*					 setBatchFeeds
			*
			* @group : init
			* @page : both
			*/
			
			// set the global objects
			// order matters
			
			var ieVersion;
			
			if ( Tour.action === 'refresh' ) {
				// alert( Tour.action );
				window.location.replace( Tour.arg );
			}
			
			// all of the non-changing global values
			C = this.config;
			
			// all of the changing global values
			S = this.settings;
			
			// the functions
			F = this.funcs;
			
			// frequently used cached jquery objects
			$El = this.cachedElements;
			
			ieVersion = F.detectIE();
			
			if ( ieVersion ) {
				$( 'html' ).addClass( 'ie' + ieVersion );
				
				if ( ieVersion < 10 ) {
					$( 'html' ).addClass( 'oldIE' );
				}
				
				if ( ieVersion < 12 ) {
					$( 'html' ).addClass( 'noSplashTransforms' );
				}
			}
			
			$( 'html' ).addClass( 'ie ie10 noSplashTransforms' );
			
			// set the above global objects
			F.cacheEls();
			F.setSettings();
			F.setConfig();
			
			// removes shadow on active webkit elements
			document.addEventListener( 'touchstart', function(){}, true );
			
			F.bindUiActions();
			
			// allows for css animation
			F.removePreloadClass();
			
			// gets viewport dimensions
			F.setVpDimensions();
			
			// start the bg cloud animation if the user has selected in settings
			// else sets the clouds responsivily
			if ( C.hasTransitionsAndTransforms && S.isBackgroundAnimating ) {
				F.initiateCloudAnimation();
			} else if ( C.hasTransitionsAndTransforms && !S.isBackgroundAnimating ) {
				F.toggleCloudAnimation( false, true );
			}
			
			// adds the custom scroll bar around the timeline &
			// sets the timeline batch input elems
			if ( S.isUserLoggedIn ) {
				F.addCustomScrollBar();
				F.setBatchFeeds();
			}
		}
		
	}

	FRESH_LINKS.init();
});