/*!
 * Social buttons theme "boogle"
 * Copyright 2016, Alex Kovalev, <alex.kovalevv@gmail.com>
 */
(function($) {
	'use strict';

	$.aikaComponent.sbtns.themes["boogle"] = {
		config: {
			size: ['big', 'medium', 'small'],
			counterType: ['horizontal'],
			isCounter: true
		},
		contanier: function() {
			return '<ul class="{classes}"></ul>';
		},
		button: function() {
			return '<li>' +
				'<a href="#" class=\"{classes}\" data-button-name="{buttonName}">' +
				'<span class="{prefix}-{themeName}-btn-bage">' +
				'<span class="{prefix}-{themeName}-btn-icon">{icon}</span>' +
				'<span class="{prefix}-{themeName}-btn-title">{title}</span>' +
				'</span>' +
				'<span class="{prefix}-{themeName}-btn-counter">{counter}</span>' +
				'</a>' +
				'</li>';
		}
	};
})(jQuery);