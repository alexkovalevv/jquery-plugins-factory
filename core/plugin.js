/**
 * Базовый класс фреймворка
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var plugin = {
		id: null,

		options: {},

		prefix: 'onp-wgt',

		defaults: {
			appPublic: false,
			demo: false
		},

		init: function() {
			this.prepareOptions();
			this.runHook('init');
			this.registerHooks();
		},

		prepareOptions: function() {
			var defaults = $.extend({}, this.defaults);
			this.defaults = this.applyFilters('plugin-' + this.pluginName + '-filter-default-options', defaults);

			// now merges with the options specified by a user
			var options = $.extend(this.defaults, this.options);

			this.options = this.applyFilters('plugin-' + this.pluginName + '-filter-options', options);
		},

		registerHooks: function() {

		},

		/**
		 * Generates an uniqure id for the locker.
		 */
		generteId: function() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for( var i = 0; i < 5; i++ ) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			return text;
		}
	};

	$.aikaCore.registerPluginClass('core', 'plugin', plugin);
})
(jQuery);
