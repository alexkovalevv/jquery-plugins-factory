/**
 *
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 07.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';
	$.aikaCore.registerPlugin('aikaLocker', {

		_defaults: {
			// Загружаемый контент при открытии замка
			content: null,

			// Sets whether a user may remove the locker by a cross placed at the top-right corner.
			close: false,

			// Sets a timer interval to unlock content when the zero is reached.
			// If the value is 0, the timer will not be created.
			timer: 0,

			// Optional. If false, the content will be unlocked forever, else will be
			// unlocked for the given number of seconds.
			expires: false,

			// Optional. Forces to use cookies instead of a local storage
			useCookies: false
		},

		_create: function() {
			this._lockContent();
		},

		_lockContent: function() {
			this.runHook('plugin-locker-lock');
		},

		_unlockContent: function() {
			var self = this;

			this._runHook('plugin-locker-before-unlock');

			if( !this.options.content ) {
				this._runHook('plugin-locker-unlock');

			} else if( typeof this.options.content === "string" ) {
				this.element.html(this.options.content);
				this._runHook('plugin-locker-unlock');

			} else if( typeof this.options.content === "object" && !this.options.content.url ) {
				this.element.append(this.options.content.clone().show());
				this._runHook('plugin-locker-unlock');

			} else if( typeof this.options.content === "object" && this.options.content.url ) {

				var ajaxOptions = $.extend(true, {}, this.options.content),
					customSuccess = ajaxOptions.success,
					customComplete = ajaxOptions.complete,
					customError = ajaxOptions.error;

				ajaxOptions.success = function(data, textStatus, jqXHR) {

					!customSuccess ? self.element.html(data) : customSuccess(self, data, textStatus, jqXHR);
					self._runHook('plugin-locker-unlock');
				};

				ajaxOptions.error = function(jqXHR, textStatus, errorThrown) {

					//self._showError('ajax', "An error is triggered during the ajax request! Text: " + textStatus + "
					// " + errorThrown);
					customError && customError(jqXHR, textStatus, errorThrown);
				};

				ajaxOptions.complete = function(jqXHR, textStatus) {

					customComplete && customComplete(jqXHR, textStatus);
				};

				$.ajax(ajaxOptions);

			} else {
				this._runHook('plugin-locker-unlock', null);
			}
		}
	});

	/*$(document).ready(function() {
	 $('.content').aikaLocker();
	 });*/
})(jQuery);
