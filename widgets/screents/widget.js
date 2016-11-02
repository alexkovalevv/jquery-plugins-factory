/**
 * Виджет экранов для магической коробки или всплывающих окон
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';

	if( !$.aikaWidgetScreen ) {
		$.aikaWidgetScreen = {};
	}

	$.aikaWidgetScreen = {

		// --------------------------------------------------------------
		// Screens
		// --------------------------------------------------------------

		/**
		 * Stores HTML markup of the screens.
		 */
		screens: {},

		/**
		 * Stores factories of the screens.
		 */
		_screenFactory: {},

		/**
		 * Shows the screen.
		 */
		showScreen: function(screenName, options) {
			// if the screen has not been registered, fires an exception
			if( !this._screenFactory[screenName] && !this.screens[screenName] ) {
				throw new Error('The screen "' + screenName + '" not found in the group "' + this.name + '"');
			}

			var self = this;
			this._currentScreenName = screenName;

			// shows a screen if it was already created
			this.innerWrap.find('.onp-sl-screen').hide();

			if( this.screens[screenName] ) {
				this.screens[screenName].show();
				self.runHook('size-changed');
				return;
			}

			// if not, then creates via the screen factory
			var screen = $("<div class='onp-sl-screen onp-sl-non-default-screen onp-sl-screen-" + screenName + "'></div>").appendTo(this.innerWrap).hide();
			this.screens[screenName] = this._screenFactory[screenName](screen, options);

			screen.fadeIn(300, function() {
				self.runHook('size-changed');
			});
		},

		/**
		 * Registers a new screen.
		 */
		registerScreen: function(screenName, factory) {
			this._screenFactory[screenName] = factory;
		},

		initScreens: function() {
			var self = this;
			this._currentScreenName = 'default';

			// SCREEN: Data Processing

			this.registerScreen('data-processing',
				function($holder, options) {

					$holder.append($("<div class='onp-sl-process-spin'></div>"));
					$holder.append($("<div class='onp-sl-processing-sreen-text'>" + ( options && options.screenText || $.pandalocker.lang.misc_data_processing ) + "</div>"));
				}
			);

			// SCREEN: Prompt

			this.registerScreen('prompt',
				function($holder, options) {

					var promtHtmlObj = $(
						'<div class="onp-sl-prompt">' +
						'<div class="onp-sl-prompt-text">' + options.textMessage + '</div>' +
						'<div class="onp-sl-prompt-buttons"><button class="onp-sl-prompt-button-yes">' + options.textButtonYes + '</button>' +
						'<button class="onp-sl-prompt-button-no">' + options.textButtonNo + '</button></div>' +
						'</div>'
					);

					!options.textButtonYes && promtHtmlObj.find('.onp-sl-prompt-button-yes').hide();
					!options.textButtonNo && promtHtmlObj.find('.onp-sl-prompt-button-no').hide();

					$holder.append(promtHtmlObj);

					$holder.closest('.onp-sl-social-locker').find('.onp-sl-cross').hide();

					promtHtmlObj.find('.onp-sl-prompt-button-yes').click(function() {
						options.callbackButtonYes && options.callbackButtonYes();
						return false;
					});

					promtHtmlObj.find('.onp-sl-prompt-button-no').click(function() {
						options.callbackButtonNo && options.callbackButtonNo();
						self.showScreen('default');
						$holder.closest('.onp-sl-social-locker').find('.onp-sl-cross').show();
						return false;
					});

					options.callbackScreenLoad && options.callbackScreenLoad(promtHtmlObj);
				}
			);
		},
	}

})(jQuery);

