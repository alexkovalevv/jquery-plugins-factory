/**
 * Ядро
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 02.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var core = $.aikaCore.tools.extend($.aikaCore.base);

	core._defaults = {
		// Optional. If set true, show credential link
		credential: false,

		// The language of the locker
		lang: 'ru_RU',

		// shows the terms
		terms: false,
		privacyPolicy: false,
		termsPopup: false,

		// Optional. If set true, the locker will generate events for the Google Analytics.
		googleAnalytics: false,

		// conditions that determine whether the locker has to be displayed
		visibility: []
	};

	/**
	 * Stores HTML markup of the screens.
	 */
	core._screens = {};

	/**
	 * Stores factories of the screens.
	 */
	core._screenFactory = {};

	core._init = function(options) {

		if( options ) {
			this.options = options;
		}

		this._prepareOptions();

		this.id = this.options.id || this._generteId();

		this.runHook('init');

		this._initScreens();
	};

	core._initScreens = function() {
		var self = this;

		this._currentScreenName = 'default';

		// SCREEN: Default

		this._registerScreen('default',
			function($holder, options) {
				$holder.removeClass(self._uq('non-default-screen'));
			}
		);

		// SCREEN: Data Processing

		this._registerScreen('data-processing',
			function($holder, options) {
				var spin = $("<div></div>");
				spin.addClass(self._uq('process-spin'));
				$holder.append(spin);
				var text = $("<div>" + ( options && options.screenText || $.aikaCore.lang.misc_data_processing ) + "</div>");
				text.addClass(self._uq('processing-sreen-text'));
				$holder.append(text);
			}
		);

		// SCREEN: Prompt

		this._registerScreen('prompt',
			function($holder, options) {
				var self = this;

				var promtHtmlObj = $(
					'<div class="' + self._uq('prompt') + '">' +
					'<div class="' + self._uq('prompt-text') + '">' + options.textMessage + '</div>' +
					'<div class="' + self._uq('prompt-buttons') + '"><button class="' + self._uq('prompt-button-yes') + '">' + options.textButtonYes + '</button>' +
					'<button class="' + self._uq('prompt-button-no') + '">' + options.textButtonNo + '</button></div>' +
					'</div>'
				);

				!options.textButtonYes && promtHtmlObj.find('.' + self._uq('prompt-button-yes')).hide();
				!options.textButtonNo && promtHtmlObj.find('.' + self._uq('prompt-button-no')).hide();

				$holder.append(promtHtmlObj);

				//$holder.closest('.onp-sl-social-locker').find('.onp-sl-cross').hide();

				promtHtmlObj.find('.' + self._uq('prompt-button-yes')).click(function() {
					options.callbackButtonYes && options.callbackButtonYes();
					return false;
				});

				promtHtmlObj.find('.' + this._uq('prompt-button-no')).click(function() {
					options.callbackButtonNo && options.callbackButtonNo();
					self._showScreen('default');
					//$holder.closest('.onp-sl-social-locker').find('.onp-sl-cross').show();
					return false;
				});

				options.callbackScreenLoad && options.callbackScreenLoad(promtHtmlObj);
			}
		)
		;
	};

	/**
	 * Shows the screen.
	 */
	core._showScreen = function(holder, screenName, options) {
		// if the screen has not been registered, fires an exception
		if( !this._screenFactory[screenName] && !this._screens[screenName] ) {
			throw new Error('The screen "' + screenName + '" not found in the group "' + this.name + '"');
		}

		var self = this;
		this._currentScreenName = screenName;

		// shows a screen if it was already created
		$('.' + this._uq('screen-' + this.id)).hide();

		if( this._screens[screenName] ) {
			this._screens[screenName].show();
			self.runHook('size-changed');
			return;
		}

		// if not, then creates via the screen factory
		var screen = $("<div></div>");
		screen.addClass(this._uq('screen-' + this.id));
		screen.addClass(this._uq('non-default-screen'));
		screen.addClass(this._uq('screen-' + screenName));
		screen.appendTo(holder).hide();

		this._screens[screenName] = this._screenFactory[screenName](screen, options);

		screen.fadeIn(300, function() {
			self.runHook('size-changed');
		});
	};

	/**
	 * Registers a new screen.
	 */
	core._registerScreen = function(screenName, factory) {
		this._screenFactory[screenName] = factory;
	};

	$.aikaCore.plugin = core;

})
(jQuery);