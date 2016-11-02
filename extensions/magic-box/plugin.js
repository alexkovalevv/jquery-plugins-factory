/**
 * Social Buttons plugin
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	$.aikaCore.widget('aikaMagicBox', {

		_defaults: {
			// Text above the locker buttons.
			text: {
				header: null,
				message: null
			},

			cssClass: null,

			// Theme applied to the locker
			theme: {
				name: "starter"
			},

			// Sets overlap for the locked content.
			// false = mode:none
			overlap: {

				// Possible modes:
				// - full: hides the content, and show the locker instead (classic)
				// - transparence: transparent overlap
				// - blurring: to blur locked content
				mode: "blurring",

				// Using only if the mode is set to 'transparence' or 'blurring'
				// Defines the position of the locker. Possible values:
				// middle, top, scroll
				position: 'middle',

				// blur intensity (works only with the 'blue' mode)
				intensity: 5,

				// the alternative mode which will be applied if the browser doesn't support the blurring effect
				altMode: 'transparence'
			},

			// Turns on the highlight effect
			highlight: true,

			// --
			// magicBox functionality.
			magicBox: {

				// Sets whether a user may remove the locker by a cross placed at the top-right corner.
				close: false,

				// Sets a timer interval to unlock content when the zero is reached.
				// If the value is 0, the timer will not be created.
				timer: 0,

				// Sets whether the locker appears for mobiles devides.
				mobile: true,

				// Optional. If false, the content will be unlocked forever, else will be
				// unlocked for the given number of seconds.
				expires: false,

				// Optional. Forces to use cookies instead of a local storage
				useCookies: false

			}
		},

		_create: function() {
			// подключаем социальные кнопки
			var socialButtons = $.aikaComponent.socialbuttons.init({
				// Настройки кнопок
				buttons: {
					theme: 'boogle',
					effect: 'push',
					size: 'medium'
				}
			});

			//$('body').append(socialButtons);

			this._setupVariables();
			this._initHooks();
			this._createMarkup();
			//$.aikaWidgetScreen.initScreens();
		},

		_prepareOptions: function() {
			var self = this;

			var defaults = $.extend(true, {}, this._defaults);
			defaults = this.applyFilters('filter-default-options', defaults);

			if( this.options.theme && !$.isPlainObject(this.options.theme) ) {
				this.options.theme = {name: self.options.theme};
			}

			if( typeof this.options.theme !== "object" ) {
				this.options.theme = {name: self.options.theme};
			}

			var theme = this.options.theme.name || this._defaults.theme;

			// some themes also have defaults options,
			// merging the global default option with the theme default options
			if( $.aikaMagicBox.themes[theme] ) {
				defaults = $.extend(true, {}, defaults, $.aikaMagicBox.themes[theme]);
			}

			// now merges with the options specified by a user
			var options = $.extend(true, defaults, this.options);

			this.options = this.applyFilters('filter-options', options);

			// ie 10-11 fix (they doesn't support the blur filter)
			if( 'blurring' === this.options.overlap.mode && !$.aikaCore.tools.supportBlurring() ) {
				this.options.overlap.mode = this.options.overlap.altMode;
			}

		},

		/**
		 * Sets variables used in various parts of the plugin code.
		 */
		_setupVariables: function() {

			// the css class of the theme
			this.style = "onp-sl-" + this.options.theme.name;

			// should we use one of advanced overlay modes?
			this.overlap = ( this.options.overlap.mode === 'full' ) ? false : this.options.overlap.mode;

		},

		/**
		 * Inits extras.
		 */
		_initHooks: function() {
			var self = this;

			var intercationAccounted = false;
			var getImpress = false;

			this.addHook('raw-interaction', function() {
				if( !getImpress ) {
					return;
				}

				if( intercationAccounted ) {
					return;
				}
				intercationAccounted = true;
				self.runHook('interaction');
			});

			this.addHook('raw-impress', function() {
				if( self._currentScreenName !== 'default' ) {
					return;
				}
				getImpress = true;
				self.runHook('impress');
			});
		},

		// --------------------------------------------------------------------------------------
		// Markups and others.
		// --------------------------------------------------------------------------------------

		/**
		 * Creates the plugin markup.
		 */
		_createMarkup: function() {
			var self = this;

			//this._loadFonts();

			var element = (this.element.parent().is('a')) ? this.element.parent() : this.element;
			element.addClass(this._uq("content"));

			var browser = ($.aikaCore.browser.mozilla && 'mozilla') ||
				($.aikaCore.browser.opera && 'opera') ||
				($.aikaCore.browser.webkit && 'webkit') || 'msie';

			this.magicBox = $("<div></div>");
			this.magicBox.addClass(this._uq("magic-box"));
			this.magicBox.addClass(this._uq(browser));

			this.outerWrap = $("<div></div>").appendTo(this.magicBox);
			this.outerWrap.addClass(this._uq('outer-wrap'));
			this.innerWrap = $("<div></div>").appendTo(this.outerWrap);
			this.innerWrap.addClass(this._uq('inner-wrap'));

			$.aikaCore.isTouch()
				? this.magicBox.addClass(this._uq("touch"))
				: this.magicBox.addClass(this._uq("no-touch"));

			if( this.options.cssClass ) {
				this.magicBox.addClass(this.options.cssClass);
			}

			// - classic mode
			// when we use the classic mode, we just set the display property of the locked content
			// to "none", then add the locker after the locked content.
			if( !this.overlap ) {

				this.magicBox.hide();
				this.magicBox.insertAfter(element);

				// - overlap mode
				// when we use the overlap mode, we put the locker inside the locked content,
				// then set the locker position to "absolute" and postion to "0px 0px 0px 0px".
			} else {

				element.addClass(this._uq("overlap-mode"));

				var displayProp = this.element.css("display");

				// creating content wrap if it's needed
				var $containerToTrackSize = element;
				if(
					this.overlap === 'blurring' ||
					element.is("img") || element.is("iframe") || element.is("object") ||
					( displayProp !== "block" && displayProp !== "inline-block" ) ) {

					$containerToTrackSize = $('<div></div>');
					$containerToTrackSize.addClass(this._uq("content-wrap"));
					$containerToTrackSize.insertAfter(element);
					$containerToTrackSize.append(element);

					var originalMargin = element.css('margin');
					$containerToTrackSize.css({'margin': originalMargin});
					element.css({'margin': '0'});

					/*self.addHook('unlock', function() {
					 $containerToTrackSize.css({'margin': originalMargin});
					 });*/
				}

				element.show();
				this.element.show();

				// creating another content which will be blurred
				if( this.overlap === 'blurring' ) {
					this.blurArea = $("<div></div>");
					this.blurArea.addClass(this._uq("blur-area"));
					this.blurArea.insertAfter(element);
					this.blurArea.append(element);
					element = this.blurArea;
				}

				var positionProp = $containerToTrackSize.css("position");
				if( positionProp === 'static' ) {
					$containerToTrackSize.css("position", 'relative');
				}

				var innerFrame = ( element.is("iframe") && element ) || element.find("iframe");
				if( innerFrame.length === 1 && innerFrame.css('position') === 'absolute' ) {

					var skip = ( !element.is(innerFrame) && !innerFrame.parent().is(element) && innerFrame.parent().css('position') === 'relative' );
					if( !skip ) {

						$containerToTrackSize.css({
							'position': 'absolute',
							'width': '100%',
							'height': '100%',
							'top': innerFrame.css('top'),
							'left': innerFrame.css('left'),
							'right': innerFrame.css('right'),
							'bottom': innerFrame.css('bottom'),
							'margin': innerFrame.css('margin')
						});

						innerFrame.css({
							'top': 0,
							'left': 0,
							'right': 0,
							'bottom': 0,
							'margin': 'auto'
						});
					}
				}

				// creating other markup for the overlap
				this.overlapMagicBox = $("<div></div>").hide();
				this.overlapMagicBox.addClass(this._uq('overlap-locker-box'));
				this.overlapMagicBox.addClass(this._uq('position-' + this.options.overlap.position));
				this.overlapMagicBox.append(this.magicBox);

				this.overlapBox = $("<div></div>");
				this.overlapBox.addClass(this._uq('overlap-box'));
				this.overlapBox.append(this.overlapMagicBox);

				this.overlapBox.addClass(this._uq(this.overlap + "-mode"));
				this.overlapBox.addClass(this.style + "-theme");

				var $overlapBackground = $("<div></div>");
				$overlapBackground.addClass(this._uq('overlap-background'));
				this.overlapBox.append($overlapBackground);

				$containerToTrackSize.append(this.overlapBox);
				this.containerToTrackSize = $containerToTrackSize;

				if( this.overlap === 'blurring' ) {

					var intensity = ( this.options.overlap && this.options.overlap.intensity ) || 5;
					this.blurArea = this.blurArea.Vague({
						intensity: intensity,
						forceSVGUrl: false
					});
					this.blurArea.blur();
				}

				$(window).resize(function() {
					self._updateLockerPosition();
				});

				this.addHook('size-changed', function() {
					self._updateLockerPosition();
				});

				if( this.options.overlap.position === 'scroll' ) {
					$(window).scroll(function() {
						self._updateLockerPositionOnScrolling();
					});
				}
			}

			this._markupIsCreated = true;
			this.runHook('markup-created');

			// tracks interactions, we need these hooks to track how
			// many users interacted with the locker any way

			this.magicBox.click(function() {
				self.runHook('raw-interaction');
			});

			this._isLockerVisible = this.magicBox.is(":visible");
			if( !this._isLockerVisible ) {
				this.options.lazy = true;
			}

			// Terms & Conditions and Privacy Policy
			if( this.options.terms || this.options.privacyPolicy ) {
				this._createTerms();
			}

			// close button and timer if needed
			//this.options.locker.close && this._createClosingCross();
			//this.options.locker.timer && this._createTimer();
		},

		/**
		 * Adds a CSS class.
		 */
		_addClass: function(className) {
			this.magicBox.addClass(className);
		},

		/**
		 * Loads fonts if needed.
		 */
		_loadFonts: function() {
			if( !this.options.theme.fonts || !this.options.theme.fonts.length ) {
				return;
			}

			var protocol = (("https:" === document.location.protocol) ? "https" : "http");
			var base = protocol + '://fonts.googleapis.com/css';

			for( var i = 0; i < this.options.theme.fonts.length; i++ ) {
				var fontData = this.options.theme.fonts[i];

				var family = fontData.name;
				if( fontData.styles && fontData.styles.length ) {
					family = family + ":" + fontData.styles.join(",");
				}

				var url = $.aikaCore.tools.updateQueryStringParameter(base, 'family', family);

				if( fontData.subset && fontData.subset.length ) {
					url = $.aikaCore.tools.updateQueryStringParameter(url, 'subset', fontData.subset.join(","));
				}

				var hash = $.aikaCore.tools.hash(url);
				if( $("#onp-sl-font-" + hash).length > 0 ) {
					continue;
				}

				$('<link id="onp-sl-font-' + hash + '" rel="stylesheet" type="text/css" href="' + url + '" >').appendTo("head");
			}
		},

		/**
		 * Updates the locker position for various overlap modes.
		 */
		_updateLockerPosition: function() {
			if( !this.overlap ) {
				return;
			}

			var self = this;

			// updates the content size if the locker is bigger then the content
			var contentHeight = this.containerToTrackSize.outerHeight();

			if( typeof this.contentMinTopMargin == "undefined" ) {
				this.contentMinTopMargin = parseInt(this.containerToTrackSize.css('marginTop'));
			}

			if( typeof this.contentMinBottomMargin == "undefined" ) {
				this.contentMinBottomMargin = parseInt(this.containerToTrackSize.css('marginBottom'));
			}

			var lockerHeight = this.magicBox.outerHeight();

			if( contentHeight < lockerHeight ) {

				var value = parseInt(( lockerHeight - contentHeight ) / 2) + 20;
				var topMargin = this.contentMinTopMargin < value ? value : this.contentMinTopMargin;
				var bottomMargin = this.contentMinBottomMargin < value ? value : this.contentMinBottomMargin;

				this.containerToTrackSize.css({
					'marginTop': topMargin + "px",
					'marginBottom': bottomMargin + "px"
				});
			}

			// updates the locker position

			if( this.options.overlap.position === 'top' || this.options.overlap.position === 'scroll' ) {

				var boxWidth = this.overlapBox.outerWidth();
				var lockerWidth = this.magicBox.outerWidth();

				var boxHeight = this.overlapBox.outerHeight();

				var offset = this.options.overlap.offset;

				if( !offset ) {
					var offset = Math.floor(( boxWidth - lockerWidth ) / 2);
					if( offset <= 10 ) {
						offset = 10;
					}
				}

				if( offset * 2 + lockerHeight > boxHeight ) {
					var offset = Math.floor(( boxHeight - lockerHeight ) / 2);
				}

				this.overlapMagicBox.css('marginTop', offset + 'px');

				if( this.options.overlap.position === 'scroll' ) {
					this._baseOffset = offset;
					this._updateLockerPositionOnScrolling();
				}
			}

			if( this.options.overlap.position === 'middle' ) {
				this.overlapMagicBox.css('marginTop', '-' + Math.floor(this.overlapMagicBox.innerHeight() / 2) + 'px');
				return;
			}
		},

		/**
		 * Updates the locker position on scrolling.
		 */
		_updateLockerPositionOnScrolling: function() {

			var boxOffset = this.overlapBox.offset();
			var contentTopBorder = boxOffset.top;
			var contentLeftBorder = boxOffset.left;
			var contentBottomBorder = boxOffset.top + this.overlapBox.outerHeight();

			var boxWidth = this.overlapBox.outerWidth();

			var boxHeight = this.overlapBox.outerHeight();
			var lockerHeight = this.magicBox.outerHeight();

			if( this._baseBoxOffset * 2 + lockerHeight + 10 >= boxHeight ) {
				return;
			}

			var scrollTop = $(document).scrollTop();

			var shift = 20;

			if( scrollTop + lockerHeight + this._baseOffset * 2 + shift > contentBottomBorder ) {

				this.overlapMagicBox
					.css('position', 'absolute')
					.css('top', 'auto')
					.css('left', '0px')
					.css('width', 'auto')
					.css('bottom', this._baseOffset + 'px')
					.css('margin-top', '0px');

				return;
			}

			if( scrollTop + shift > contentTopBorder ) {

				this.overlapMagicBox
					.css('position', 'fixed')
					.css('top', this._baseOffset + shift + 'px')
					.css('left', contentLeftBorder + 'px')
					.css('width', boxWidth + 'px')
					.css('bottom', 'auto')
					.css('margin-top', '0px');

				return;
			}

			this.overlapMagicBox
				.css('position', 'absolute')
				.css('top', '0px')
				.css('left', '0px')
				.css('bottom', 'auto')
				.css('width', 'auto')
				.css('margin-top', this._baseOffset + 'px');
		},

		/**
		 * Fires the hook when the locker gets visible in the current viewport.
		 */
		_startTrackVisability: function() {
			var self = this;

			var el = this.magicBox[0];

			if( !el.getBoundingClientRect ) {
				this.runHook('raw-impress');
			}

			var windowHeight = $(window).height();
			var windowWidth = $(window).width();

			var checkVisability = function() {

				if( !el ) {
					self._stopTrackVisability();
					return;
				}

				var rect = el.getBoundingClientRect();

				var heightHalf = rect.height / 2;
				var windowHalf = rect.width / 2;

				// if we can see a half of the locker in the current view post, notify about that
				if( rect.top + heightHalf > 0 && rect.bottom - heightHalf <= windowHeight &&
					rect.left + windowHalf && rect.right - windowHalf <= windowWidth ) {

					self.runHook('raw-impress');
					self._stopTrackVisability();
				}
			};

			$(window).bind('resize.visability.opanda_' + self.id, function() {
				windowHeight = $(window).height();
				windowWidth = $(window).width();
			});

			$(window).bind('resize.visability.opanda_' + self.id + ' scroll.visability.opanda_' + self.id, function(e) {
				checkVisability();
			});

			// if the locker is not visible, binds to click events to catch
			// the moment when it gets visible

			if( !this._isLockerVisible ) {

				$("a, button").add($(document)).bind('click.visability.opanda', function() {
					setTimeout(function() {
						checkVisability();
					}, 200);
				});

				this.addHook('raw-impress', function() {
					self._isLockerVisible = true;
					$("a, button").add($(document)).unbind('click.visability.opanda');
				});
			}

			checkVisability();
		},

		_stopTrackVisability: function() {
			$(window).unbind('.visability.opanda_' + this.id);
		},

	});

	$(document).ready(function() {
		$('.content').aikaMagicBox();
	});

})(jQuery);
