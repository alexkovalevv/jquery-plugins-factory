/*!
 * Social buttons theme "cozy"
 * Copyright 2016, Alex Kovalev, <alex.kovalevv@gmail.com>
 */
(function($) {
	'use strict';

	$.aikaComponent.sbtns.themes["cozy"] = {
		config: {
			isCounter: true,
			counterType: ['vertical'],
			size: ['small', 'medium', 'big']
		},
		contanier: function() {
			return '<ul class="{classes} aika-cozy-direction-horizontal"></ul>';
		},
		button: function() {
			return '<li>' +
				'<a class="{classes}" data-button-name="{buttonName}" href="#" rel="nofollow">' +
				'<span class="aika-cozy-sbtn-bage">' +
				'<span class="aika-cozy-sbtn-icon">{icon}</span>' +
				'<span class="aika-cozy-sbtn-counter">{counter}</span>' +
				'</span>' +
				'<span class="aika-cozy-sbtn-title">{title}</span>' +
				'</a>' +
				'</li>';
		}
	};
})(jQuery);

