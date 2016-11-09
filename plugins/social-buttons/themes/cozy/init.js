/*!
 * Social buttons theme "cozy"
 * Copyright 2016, Alex Kovalev, <alex.kovalevv@gmail.com>
 */
(function($) {
	'use strict';

	$.aikaPluginSocialButtons.themes["cozy"] = {
		config: {
			isCounter: true,
			counterType: ['vertical'],
			size: ['small', 'medium', 'big']
		},
		contanier: function() {
			return '<ul class="{classes}"></ul>';
		},
		button: function() {
			return '<li>' +
				'<a class="{classes}" data-button-name="{buttonName}" href="#" rel="nofollow">' +
				'<span class="{prefix}-{themeName}-btn-bage">' +
				'<span class="{prefix}-{themeName}-btn-icon">{icon}</span>' +
				'<span class="{prefix}-{themeName}-btn-counter">{counter}</span>' +
				'</span>' +
				'<span class="{prefix}-{themeName}-btn-title">{title}</span>' +
				'</a>' +
				'</li>';
		}
	};
})(jQuery);

