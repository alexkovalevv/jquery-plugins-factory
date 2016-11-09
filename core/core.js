/**
 * Ядро
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 06.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';

	var _loadModules = {},
		_loadPlugins = {},
		_loadPluginInjections = {};

	$.aikaCore = $.aikaCore || (function() {
		var app = {

			_registerPlugin: function(pluginName, plugin) {
				var self = this;

				if( !pluginName || typeof pluginName !== 'string' ) {
					throw new Error('Не установлен обязательный атрибут pluginName или атрибут не является строкой.');
				}

				if( typeof plugin !== 'object' ) {
					throw new Error('Атрибут plugin должен быть объектом.');
				}

				if( !_loadPlugins[pluginName] ) {
					_loadPlugins[pluginName] = plugin;

					var factory = {
						createWidget: function(element, options) {

							var pluginAbstract = $.aikaApi.tools.extend($.aikaPluginAbstract);
							var widget = $.extend(true, {}, pluginAbstract, plugin);

							widget.superclass = pluginAbstract;
							widget.element = $(element);
							widget.options = $.extend(true, widget.options, options);
							widget.id = widget.options.id || widget._generteId();

							widget = $.extend(true, widget, self._getPublicHooks(widget.id));

							for( var inj in _loadPluginInjections ) {
								if( !_loadPluginInjections.hasOwnProperty(inj) ) {
									continue;
								}

								if( _loadPluginInjections[inj].pluginName === pluginName ) {

									var pluginPublicApi = {
										element: widget.element,
										prefix: widget._prefix,
										pluginId: widget.id,
										pluginOptions: widget.options,
										uq: widget._uq

									};

									var injection = $.extend(true, {},
										_loadPluginInjections[inj].injection,
										pluginPublicApi,
										self._getPublicHooks(widget.id)
									);

									injection.init();
								}
							}

							if( widget._init ) {
								widget._init();
							}
							if( widget._create ) {
								widget._create();
							}

							$.data(element, 'plugin_' + pluginName, widget);
						},
						callMethod: function(widget, methodName) {
							return widget[methodName] && widget[methodName]();
						}
					};

					$.fn[pluginName] = function() {
						var args = arguments;
						var argsCount = arguments.length;
						var toReturn = this;
						this.each(function() {
							var widget = $.data(this, 'plugin_' + pluginName);
							// a widget is not created yet
							if( !widget && argsCount <= 1 ) {
								factory.createWidget(this, argsCount ? args[0] : false);
								// a widget is created, the public method with no args is being called
							} else if( argsCount == 1 ) {
								toReturn = factory.callMethod(widget, args[0]);
							}
						});
						return toReturn;
					};
				}
			},

			_deregisterPlugin: function(pluginName) {
				//$.aikaApi.tools.arrayUnset(_loadPlugins, appId);
			},

			_registerPluginInjection: function(pluginName, injectionName, injection) {
				if( !_loadPluginInjections[injectionName] ) {
					_loadPluginInjections[injectionName] = {
						pluginName: pluginName,
						injection: injection
					};
				}
			},

			_deregisterPluginInjection: function(pluginName, injectionName) {
				//$.aikaApi.tools.arrayUnset(_loadPluginInjections, appId);
			},

			// --------------------------------------------------------------------------------------
			// Hooks & Filters
			// --------------------------------------------------------------------------------------

			_getPublicHooks: function(pluginId) {
				var self = this;
				return {
					addHook: function(eventName, callback, priority, global) {
						return self._addHook(pluginId, eventName, callback, priority, global);
					},
					runHook: function(eventName, args, global) {
						return self._runHook(pluginId, eventName, args, global);
					},
					addFilter: function(eventName, callback, priority, global) {
						return self._addFilter(pluginId, eventName, callback, priority, global);
					},
					applyFilters: function(eventName, input, args, global) {
						return self._applyFilters(pluginId, eventName, input, args, global);
					}
				}
			},

			/**
			 * Subscribes to the specified hook.
			 * @param pluginId int
			 * @param eventName
			 * @param callback
			 * @param priority
			 * @param global
			 * @private
			 */
			_addHook: function(pluginId, eventName, callback, priority, global) {
				$.aikaApi.filters().add(pluginId + '.' + eventName, callback, priority);
				if( global ) {
					$.aikaApi.filters().add(eventName, callback, priority);
				}
			},

			/**
			 * Runs the specified hook.
			 * @param pluginId int
			 * @param eventName string
			 * @param args array
			 * @param global bool
			 * @private
			 */
			_runHook: function(pluginId, eventName, args, global) {
				if( !args ) {
					args = [];
				}
				//args.unshift(this);

				$.aikaApi.filters().run(pluginId + '.' + eventName, args);
				if( global ) {
					$.aikaApi.filters().run(eventName, args);
				}

				// jquery api
				//this.element.trigger('aika-' + eventName, args);

				// global api
				var globalArgs = args.slice();

				$.aikaApi.filters().run('aika-' + eventName, globalArgs);
			},

			/**
			 * Subscribes to the specified hook.
			 * @param pluginId int
			 * @param eventName
			 * @param callback
			 * @param priority
			 * @private
			 */
			_addFilter: function(pluginId, eventName, callback, priority) {
				$.aikaApi.filters().add(pluginId + '.' + eventName, callback, priority);
			},

			/**
			 * Runs the specified hook.
			 * @param pluginId int
			 * @param eventName
			 * @param input
			 * @param args array
			 * @param global
			 * @returns {*}
			 * @private
			 */
			_applyFilters: function(pluginId, eventName, input, args, global) {

				if( !args ) {
					args = [];
				}
				if( !$.isArray(args) ) {
					args = [args];
				}

				//args.unshift(this);
				args.unshift(input);

				// filters api
				var result = $.aikaApi.filters().run(pluginId + '.' + eventName, args);

				args[0] = result;

				if( global ) {
					result = $.aikaApi.filters().run(eventName, args);
				}

				return result;
			}
		};

		return {
			registerPlugin: function(pluginName, plugin) {
				return app._registerPlugin.apply(app, [pluginName, plugin]);
			},
			registerPluginInjection: function(pluginName, injectionName, injection) {
				return app._registerPluginInjection.apply(app, [pluginName, injectionName, injection]);
			},
			deregisterPlugin: function(pluginName) {
				return app._deregisterPlugin.call(app, [pluginName]);
			},
			deregisterPluginInjection: function(injectionName) {
				return app._deregisterPluginInjection.call(app, injectionName);
			}
		};
	}());
})(jQuery);
