/*
 * Filers & Hooks API
 * Copyright 2014, OnePress, http://byonepress.com
 * 
 * @since 1.0.0
 * @pacakge core
 */

(function($) {
	'use strict';

	var _items = {},
		_priorities = {};

	$.wbcrApi.filters = $.wbcrApi.filters || function() {

		var filter = {

			/**
			 * Applies filters to a given input value.
			 */
			_run: function(filterName, args) {

				var input = args && args.length > 0 ? args[0] : null;
				if( !_items[filterName] ) {
					return input;
				}

				for( var i in _priorities[filterName] ) {
					if( !_priorities[filterName].hasOwnProperty(i) ) {
						continue;
					}

					var priority = _priorities[filterName][i];

					for( var k = 0; k < _items[filterName][priority].length; k++ ) {
						var f = _items[filterName][priority][k];
						input = f.apply(f, args);
					}
				}

				return input;
			},

			/**
			 * Registers a new filter.
			 */
			_add: function(filterName, callback, priority) {

				if( !priority ) {
					priority = 10;
				}

				if( !_items[filterName] ) {
					_items[filterName] = {};
				}
				if( !_items[filterName][priority] ) {
					_items[filterName][priority] = [];
				}
				_items[filterName][priority].push(callback);

				if( !_priorities[filterName] ) {
					_priorities[filterName] = [];
				}
				if( $.inArray(priority, _priorities[filterName]) === -1 ) {
					_priorities[filterName].push(priority);
				}

				_priorities[filterName].sort(function(a, b) {
					return a - b;
				});
			}
		};

		return {
			run: function(filterName, args) {
				return filter._run.apply(filter, [filterName, args])
			},
			add: function(filterName, callback, priority) {
				return filter._add.apply(filter, [filterName, callback, priority])
			}
		}
	};

})(jQuery);