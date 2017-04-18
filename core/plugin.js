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

		prefix: 'aika',

		defaults: {
			appPublic: false,
			demo: false
		},

		init: function() {
			this.prepareOptions();
			this.runHook('init');
			this.registerHooks();
		},

		/**
		 * Подготавливаем опции к работе
		 * для вызова родительского метода
		 * this.superclass.prepareOptions.call(this);
		 */
		prepareOptions: function() {
			var defaults = $.extend({}, this.defaults);
			this.defaults = this.applyFilters('plugin-' + this.pluginName + '-filter-default-options', defaults);

			// now merges with the options specified by a user
			var options = $.extend(this.defaults, this.options);

			this.options = this.applyFilters('plugin-' + this.pluginName + '-filter-options', options);

			// Расширяем настройки по умолчанию
			this._extendPrepareOptions && this._extendPrepareOptions(this.options);
		},

		registerHooks: function() {

		},

		showError: function(message) {
			var dialog = '<div id="somedialog" class="dialog">' +
				'<div class="dialog__overlay"></div>' +
				'<div class="dialog__content">' +
				'<h2 class="dialog__head">' + message + '</h2>' +
				'<div class="dialog__text">Произошла ошибка выполнения кода.</div>' +
				'<div><button class="action" data-dialog-close>Close</button></div>' +
				'</div>' +
				'</div>';

			$('body').append(dialog);

			var dlg = new DialogFx(document.getElementById("somedialog"));
			dlg.toggle(dlg);

			/*dlg.options.onCloseDialog = function(e) {
			 $.cookie('onp-sl-promo', '1', {
			 expires: 7,
			 path: '/'
			 });
			 };*/

			/*$('body').mouseout(function(event) {
			 if( dlg.isOpen || $.cookie('onp-sl-promo') ) {
			 return;
			 }
			 if( event.relatedTarget == null && event.screenY < 100 ) {
			 dlg.toggle(dlg);
			 }
			 });	*/

		},

		/**
		 * Публичный api для передачи его различным сущностям
		 */
		getPluginPublicApi: function() {
			var methods = {
				uq: this.uq,
				addClass: this.addClass,
				addClasses: this.addClasses,
				removeClass: this.removeClass
			};

			// Расшияем api по умолчанию
			if( this._extendPublicApi ) {
				methods = $.extend(true, methods, this._extendPublicApi(methods));
			}

			return methods;
		},

		/**
		 * Унифицирует переденное имя или класс
		 * @param value string
		 * @param separator string
		 * @returns {*}
		 * @private
		 */
		uq: function(value, separator) {
			if( !value ) {
				return null;
			}
			if( !separator ) {
				separator = '-';
			}
			return this.prefix + separator + value;
		},

		/**
		 * Добавляет класс к выбранному элементу
		 * @param element object
		 * @param className string
		 * @returns {boolean}
		 */
		addClass: function(element, className) {
			return this.addClasses(element, className);
		},

		/**
		 * Добавляет несколько классов к выбранному элементу
		 * @param element object
		 * @param classes array
		 * @returns {boolean}
		 */
		addClasses: function(element, classes) {
			if( !element || !classes ) {
				return false;
			}

			if( $.isArray(classes) ) {
				for( var i = 0; i < classes.length; i++ ) {
					element.addClass(this.uq(classes[i]));
				}
				return true;
			}
			element.addClass(this.uq(classes));
			return true;
		},

		/**
		 *
		 * @param element object
		 * @param className string
		 * @returns {boolean}
		 */
		removeClass: function(element, className) {
			if( element.hasClass(className) ) {
				element.removeClass(this.uq(className));
				return true;
			}
			return false;
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
