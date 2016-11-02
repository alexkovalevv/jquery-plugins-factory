/**
 * Виджет таймер для магического ящика, всплывающих окон и так далее.
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';

	if( !$.aikaWidgetTimer ) {
		$.aikaWidgetTimer = {};
	}

	$.aikaWidgetTimer = {
		// --------------------------------------------------------------------------------------
		// Timer
		// --------------------------------------------------------------------------------------

		/**
		 * Creates the markup for the timer.
		 */
		createTimer: function(callback) {

			this.timer = $("<span class='onp-sl-timer'></span>");
			var timerLabelText = 'please waite';

			timerLabelText = timerLabelText.replace('{timer}', $("<span class='onp-sl-timer-counter'>" + this.options.locker.timer + "</span>")[0].outerHTML);

			this.timerLabel = $("<span class='onp-sl-timer-label'></span>").html(timerLabelText).appendTo(this.timer);
			this.timerCounter = this.timerLabel.find('.onp-sl-timer-counter');

			this.timer.appendTo(this.locker);

			this.counter = this.options.locker.timer;
			this._kickTimer(function() {
				callback && callback();
			});
		},

		/**
		 * Executes one timer step.
		 */
		_kickTimer: function(callback) {
			var self = this;

			setTimeout(function() {

				self.counter--;
				if( self.counter <= 0 ) {
					callback && callback();
				} else {
					self.timerCounter.text(self.counter);

					// Opera fix.
					if( $.aikaCore.browser.opera ) {
						var box = self.timerCounter.clone();
						box.insertAfter(self.timerCounter);
						self.timerCounter.remove();
						self.timerCounter = box;
					}

					self._kickTimer();
				}
			}, 1000);
		}
	};

})(jQuery);

