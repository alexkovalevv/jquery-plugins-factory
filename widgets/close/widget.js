/**
 *
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';

	if( !$.aikaWidgetClose ) {
		$.aikaWidgetClose = {};
	}

	$.aikaWidgetClose = {
		// --------------------------------------------------------------------------------------
		// Close Cross
		// --------------------------------------------------------------------------------------

		/**
		 * Creates the markup for the close icon.
		 */
		_createClosingCross: function(callback) {
			var self = this;

			$("<div class='onp-sl-cross' title='close' />")
				.prependTo(this.locker)
				.click(function() {
					if( !self.close || !self.close(self) ) {
						callback && callback();
					}
				});
		}
	}

})
(jQuery);


