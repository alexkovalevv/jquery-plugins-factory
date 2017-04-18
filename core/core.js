/**
 * Ядро
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 06.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var _loadPlugins = {},
		_loadPluginInjections = {},
		_pluginObjects = {},
		_pluginClasses = {};

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
					var factory = {
						createWidget: function(element, options) {

							var pluginAbstract = self._extendPluginClass('core', 'plugin');
							var widget = $.extend(true, {}, pluginAbstract, plugin);

							widget.superclass = pluginAbstract;
							widget.element = $(element);
							widget.options = $.extend(true, widget.options, options);
							widget.id = widget.options.id || widget.generteId();

							for( var inj in _loadPluginInjections ) {
								if( !_loadPluginInjections.hasOwnProperty(inj) ) {
									continue;
								}

								if( _loadPluginInjections[inj].pluginName === pluginName ) {

									var pluginPublicApi = {
										element: widget.element,
										prefix: widget.prefix,
										pluginId: widget.id,
										pluginOptions: widget.options

									};

									var injection = $.extend(true, {},
										_loadPluginInjections[inj].injection,
										pluginPublicApi,
										self._getPublicHooks(pluginName, widget.id)
									);

									injection.init();
								}
							}

							widget.getPluginObject = function(groupName, objectName) {
								return self._getPluginObject(pluginName, groupName, objectName);
							};

							widget.getPluginObjects = function(groupName) {
								return self._getPluginObjects(pluginName, groupName);
							};

							if( widget.init ) {
								widget.init();
							}
							if( widget.create ) {
								widget.create();
							}

							_loadPlugins[pluginName] = widget;
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

			/**
			 * Добавляет объект к выбранному плагину. Объект может быть кнопкой, формой, какой-то сущностью.
			 * Создает приватность для добавляемого объекта и доступность изнутри плагина.
			 * @param pluginName
			 * @param groupName
			 * @param objectName
			 * @param object
			 * @returns {boolean}
			 * @private
			 */
			_addPluginObject: function(pluginName, groupName, objectName, object) {
				if( _pluginObjects[pluginName] && _pluginObjects[pluginName][groupName] && _pluginObjects[pluginName][groupName][objectName] ) {
					return false;
				}
				if( !pluginName || !groupName || !objectName || !object ) {
					throw new Error('Не передан один или несколько обязательных атрибутов pluginName, groupName, objectName, object.');
				}

				if( typeof pluginName != 'string' || typeof groupName != 'string' || typeof objectName != 'string' ) {
					throw new Error('Атрибуты  pluginName, groupName, objectName должены быть строкой.');
				}

				if( typeof object !== 'object' ) {
					throw new Error('Атрибут object должен быть объектом.');
				}

				if( !_pluginObjects[pluginName] ) {
					_pluginObjects[pluginName] = {};
				}
				if( !_pluginObjects[pluginName][groupName] ) {
					_pluginObjects[pluginName][groupName] = {};
				}
				_pluginObjects[pluginName][groupName][objectName] = object;
			},

			/**
			 * Получает объект плагина
			 * @param pluginName
			 * @param groupName
			 * @param objectName
			 * @returns {*}
			 * @private
			 */
			_getPluginObject: function(pluginName, groupName, objectName) {
				if( !_pluginObjects[pluginName] || !_pluginObjects[pluginName][groupName] || !_pluginObjects[pluginName][groupName][objectName] ) {
					return null;
				}
				return _pluginObjects[pluginName][groupName][objectName];
			},

			/**
			 * Получает объекты плагина
			 * @param pluginName
			 * @param groupName
			 * @returns {*}
			 * @private
			 */
			_getPluginObjects: function(pluginName, groupName) {
				if( !_pluginObjects[pluginName] || !_pluginObjects[pluginName][groupName] ) {
					return null;
				}
				return _pluginObjects[pluginName][groupName];
			},

			/**
			 * Регистрирует класс плагина. Метод создает полную приватность классу и доступность для класса
			 * наследующего.
			 * @param pluginName
			 * @param className
			 * @param classObject
			 * @returns {boolean}
			 * @private
			 */
			_registerPluginClass: function(pluginName, className, classObject) {
				if( _pluginClasses[pluginName] && _pluginClasses[pluginName][className] ) {
					return false;
				}

				if( !pluginName || !className || !classObject ) {
					throw new Error('Не передан один или несколько обязательных атрибутов pluginName, className, classObject.');
				}

				if( typeof pluginName != 'string' || typeof className != 'string' ) {
					throw new Error('Атрибуты  pluginName, className должены быть строкой.');
				}

				if( typeof classObject !== 'object' ) {
					throw new Error('Атрибут classObject должен быть объектом.');
				}

				if( !_pluginClasses[pluginName] ) {
					_pluginClasses[pluginName] = {};
				}

				classObject = $.extend(true, classObject, this._getPublicHooks(pluginName));

				_pluginClasses[pluginName][className] = classObject;
				return true;
			},

			/**
			 * Позволяет наследовать зарегистрированные классы плагина
			 * @param pluginName
			 * @param className
			 * @returns {*}
			 * @private
			 */
			_extendPluginClass: function(pluginName, classNames) {

				if( !$.isArray(classNames) ) {
					var className = classNames;
					classNames = [];
					classNames.push(className);
				}

				var extendClass = {};

				for( var i = 0; i < classNames.length; i++ ) {

					if( !_pluginClasses[pluginName] || !_pluginClasses[pluginName][classNames[i]] ) {
						throw new Error('Класс ' + classNames[i] + ' не зарегистрирован.');
					}

					extendClass = $.extend(true, extendClass, $.aikaApi.tools.extend(_pluginClasses[pluginName][classNames[i]]));
				}

				return extendClass;
			},

			_getPlugin: function(pluginName) {
				if( !_loadPlugins[pluginName] ) {
					return null;
				}
				return _loadPlugins[pluginName];
			},

			// --------------------------------------------------------------------------------------
			// Hooks & Filters
			// --------------------------------------------------------------------------------------

			_getPublicHooks: function(pluginName, pluginId) {
				var self = this;

				return {
					addHook: function(eventName, callback, priority, global) {
						pluginId = pluginId || this.id;
						return self._addHook(pluginId, eventName, callback, priority, global);
					},
					runHook: function(eventName, args, global) {
						pluginId = pluginId || this.id;
						return self._runHook(pluginId, eventName, args, global);
					},
					addFilter: function(eventName, callback, priority, global) {
						pluginId = pluginId || this.id;
						return self._addFilter(pluginId, eventName, callback, priority, global);
					},
					applyFilters: function(eventName, input, args, global) {
						pluginId = pluginId || this.id;
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
			registerPluginClass: function(pluginName, className, classObject) {
				return app._registerPluginClass(pluginName, className, classObject);
			},
			extendPluginClass: function(pluginName, className) {
				return app._extendPluginClass(pluginName, className);
			},
			addPluginObject: function(pluginName, groupName, objectName, object) {
				return app._addPluginObject(pluginName, groupName, objectName, object);
			},
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
