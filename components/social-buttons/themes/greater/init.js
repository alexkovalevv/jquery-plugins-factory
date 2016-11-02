/*!
 * Social buttons theme "greater"
 * Copyright 2016, Alex Kovalev, <alex.kovalevv@gmail.com>
 */
(function($) {
	'use strict';

	$.aikaComponent.sbtns.themes["greater"] = {
		config: {
			isCounter: true,
			counterType: ['vertical'],
			size: ['small', 'medium', 'big']
		},
		contanier: function() {
			return '<ul class="{classes}"></ul>';
		},
		button: function() {
			return '<li><a href="#" class=\"{classes}\" data-button-name="{buttonName}">' +
				'<span class="aika-greater-title"><i class="aika-greater-icon">{icon}</i>{title}</span>' +
				'<span class="aika-greater-sbtn-counter">{counter}</span>' +
				'</a></li>';
		}
	};
})(jQuery);