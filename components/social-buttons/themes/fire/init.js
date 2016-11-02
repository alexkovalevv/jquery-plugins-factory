/*!
 * Social buttons theme "fire"
 * Copyright 2016, Alex Kovalev, <alex.kovalevv@gmail.com>
 */
(function($) {
	'use strict';

	$.aikaComponent.sbtns.themes["fire"] = {
		config: {
			size: ['big', 'medium', 'small'],
			isCounter: true
		},
		contanier: function() {
			return '<ul class="{classes}"></ul>';
		},
		button: function() {
			return '<li>' +
				'<a href="#" class=\"{classes}\" data-button-name="{buttonName}">' +
				'<span class="aika-fire-sbtn-bage">' +
				'<span class="aika-fire-sbtn-icon">{icon}</span>' +
				'<span class="aika-fire-sbtn-title">{title}</span>' +
				'</span>' +
				'<span class="aika-fire-sbtn-counter">{counter}</span>' +
				'</a>' +
				'</li>';
		}
	};
})(jQuery);