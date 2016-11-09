/**
 * Базовый класс фреймворка
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';

	$.aikaPluginAbstract = {
		id: null,

		options: {},

		_prefix: 'onp-wgt',

		_defaults: {
			appPublic: false,
			demo: false
		},

		/**
		 * Stores HTML markup of the screens.
		 */
		_screens: {},

		/**
		 * Stores factories of the screens.
		 */
		_screenFactory: {},

		_init: function() {
			this._prepareOptions();
			this.runHook('init');
			this._registerHooks();
			this._initScreens();
		},

		_prepareOptions: function() {

			var defaults = $.extend({}, this._defaults);
			this._defaults = this.applyFilters('plugin-' + this._pluginName + '-filter-default-options', defaults);

			// now merges with the options specified by a user
			var options = $.extend(this._defaults, this.options);

			this.options = this.applyFilters('plugin-' + this._pluginName + '-filter-options', options);
		},

		_registerHooks: function() {

		},

		_initScreens: function() {
			this._registerDefaultScreens();
		},

		_registerDefaultScreens: function() {
			var self = this;

			this._currentScreenName = 'default';

			// SCREEN: Data Processing

			this._registerScreen('data-processing',
				function($holder, options) {
					var spin = $("<div></div>");
					spin.addClass(self._uq('process-spin'));
					$holder.append(spin);
					var text = $("<div>" + ( options && options.screenText || $.aikaApi.lang.misc_data_processing ) + "</div>");
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
			);
		},

		/**
		 * Shows the screen.
		 */
		_showScreen: function(holder, screenName, options) {
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
		},

		/**
		 * Registers a new screen.
		 */
		_registerScreen: function(screenName, factory) {
			this._screenFactory[screenName] = factory;
		},

		/**
		 * Унифицирует переденное имя или класс
		 * @param value string
		 * @param separator string
		 * @returns {*}
		 * @private
		 */
		_uq: function(value, separator) {
			if( !value ) {
				return null;
			}
			if( !separator ) {
				separator = '-';
			}
			return this._prefix + separator + value;
		},

		/**
		 * Generates an uniqure id for the locker.
		 */
		_generteId: function() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for( var i = 0; i < 5; i++ ) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			return text;
		}
	};

})
(jQuery);
