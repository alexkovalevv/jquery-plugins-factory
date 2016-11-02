/**
 * Базовый класс фреймворка
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';

	$.aikaCore.base = {
		options: {},

		_prefix: 'onp-wgt',

		_defaults: {
			appPublic: false,

			// Sets whether the locker keep the state of always appears
			demo: false,

			// Optional. If set true, show credential link
			credential: false,

			// The language of the locker
			lang: 'ru_RU',

			// shows the terms
			terms: false,
			privacyPolicy: false,
			termsPopup: false,

			// Optional. If set true, the locker will generate events for the Google Analytics.
			googleAnalytics: false,

			// conditions that determine whether the locker has to be displayed
			visibility: []
		},

		_init: function(options) {

			if( options ) {
				this.options = options;
			}

			this._prepareOptions();

			this.id = this.options.id || this._generteId();

			this.runHook('init');
		},

		_prepareOptions: function() {
			var defaults = $.extend(true, {}, this._defaults);
			this._defaults = this.applyFilters('filter-default-options', defaults);

			var options = $.extend(true, defaults, this.options);
			this.options = this.applyFilters('filter-options', options);
		},

		_createSkin: function template(tmpl, context, filter) {
			return tmpl.replace(/\{([^\}]+)\}/g, function(m, key) {
				// If key doesn't exists in the context we should keep template tag as is
				return key in context ? (filter ? filter(context[key]) : context[key]) : m;
			});
		},

		// Унифицирует переденное имя или класс
		_uq: function(value, separator) {
			if( !value ) {
				return null;
			}
			if( !separator ) {
				separator = '-';
			}
			return this._prefix + separator + value;
		},

		// --------------------------------------------------------------------------------------
		// Hooks & Filters
		// --------------------------------------------------------------------------------------

		/**
		 * Subscribes to the specified hook.
		 */
		addHook: function(eventName, callback, priority, global) {
			$.aikaCore.hooks.add(this.id + '.' + eventName, callback, priority);
			if( global ) {
				$.aikaCore.hooks.add(eventName, callback, priority);
			}
		},

		/**
		 * Runs the specified hook.
		 */
		runHook: function(eventName, args, global) {
			if( !args ) {
				args = [];
			}
			args.unshift(this);

			// filters api
			$.aikaCore.hooks.run(this.id + '.' + eventName, args);
			if( global ) {
				$.aikaCore.hooks.run(eventName, args);
			}

			// jquery api
			//this.element.trigger('aika-' + eventName, args);

			// global api
			var globalArgs = args.slice();

			$.aikaCore.hooks.run('aika-' + eventName, globalArgs);
		},

		/**
		 * Subscribes to the specified hook.
		 */
		addFilter: function(eventName, callback, priority, global) {
			$.aikaCore.filters.add(this.id + '.' + eventName, callback, priority);
		},

		/**
		 * Runs the specified hook.
		 */
		applyFilters: function(eventName, input, args, global) {
			if( !args ) {
				args = [];
			}
			if( !$.isArray(args) ) {
				args = [args];
			}

			args.unshift(this);
			args.unshift(input);

			// filters api
			var result = $.aikaCore.filters.run(this.id + '.' + eventName, args);
			args[0] = result;

			if( global ) {
				result = $.aikaCore.filters.run(eventName, args);
			}
			return result;
		},

		/**
		 * Generates an uniqure id for the locker.
		 */
		_generteId: function() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for( var i = 0; i < 5; i++ ) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			return text;
		}
	};

})(jQuery);