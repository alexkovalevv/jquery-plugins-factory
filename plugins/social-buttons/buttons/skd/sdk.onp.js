(function($) {
	'use strict';

	$.aikaPluginSocialButtons.sdk.onp = $.aikaPluginSocialButtons.sdk.onp || {
		name: 'onp',
		url: 'http://cdn.sociallocker.ru/service/ifbcreator.js',
		scriptId: 'onp-jssdk',
		hasParams: true,
		isRender: true,

		// a timeout to load
		timeout: 10000,

		isLoaded: function() {
			return ( window.ONPWGT && typeof (window.ONPWGT) === "object" );
		},

		prepare: function() {
		},

		createEvents: function() {
			var self = this;
			var isLoaded = this.isLoaded();

			var load = function() {
				$(document).trigger(self.name + '-init');
			};

			if( isLoaded ) {
				load();
				return;
			}

			if( window.onpwgt___asyncInit ) {
				var predefined = window.onpwgt___asyncInit;
			}

			window.onpwgt___asyncInit = function() {
				load();
				predefined && predefined();
				window.onpwgt___asyncInit = function() {
				};
			};
		}
	};
})($);