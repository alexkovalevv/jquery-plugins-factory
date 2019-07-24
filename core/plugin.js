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

		prefix: 'wbcr',

		dialogIsOpen: false,

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

		showErrorDialog: function(message) {
			this.showDialog('dialog-danger', 'Произошла ошибка', message);
		},

		/**
		 * Публичный вызов диалогового окна
		 * @param theme
		 * @param header
		 * @param message
		 */
		showDialog: function(theme, header, message) {
			if( this.superclass._dialog ) {
				if( this.superclass.dialogIsOpen ) {
					this.superclass._hideDialog();
					this.superclass._showDialog(theme, header, message);
					return;
				}

				this.superclass._showDialog(theme, header, message);
				return;
			}

			this.superclass._createDialogMarkup(this.id, theme, header, message);
		},

		/**
		 * Выбрасывает диалоговое окно (ошибка, уведомление, запрос)
		 * @param pluginId srtring id вызывающего окно плагина
		 * @param theme string название класса для стилизации окна
		 * @param header string заголовок окна
		 * @param message string текстовое сообщение
		 * @private
		 */
		_createDialogMarkup: function(pluginId, theme, header, message) {
			var self = this;

			if( this._dialog ) {
				return;
			}

			if( !theme ) {
				theme = 'dialog-default';
			}

			this._dialog = $('<div></div>');
			this.addClass(this._dialog, ['dialog', 'dialog-plugin-id' + pluginId, theme]);

			this._dialogOverlay = $('<div></div>');
			this.addClass(this._dialogOverlay, ['dialog-overlay']);
			this._dialog.append(this._dialogOverlay);

			var content = $('<div class="' + this.uq('dialog-content') + '">' +
			'<h2 class="' + this.uq('dialog-header') + '">' + header + '</h2>' +
			'<div class="' + this.uq('dialog-text') + '">' + message + '</div>' +
			'<div></div>' +
			'</div>');

			this._dialogCloseButton = $('<a href="#">Закрыть</button>');
			this.addClass(this._dialogCloseButton, 'dialog-btn-close');

			this._dialogCloseButton.on('click', function() {
				console.log('close');
				self._hideDialog();
				return false;
			});

			content.append(this._dialogCloseButton.wrap('div'));

			this._dialog.append(content);
			$('body').append(this._dialog);

			this._dialog.wcFactoryDialog();
			this._dialog.wcFactoryDialog('dialogShow');
		},

		_showDialog: function() {
			if( !this._dialog ) {
				return;
			}
			this._dialog.wcFactoryDialog('dialogShow');
		},

		_hideDialog: function() {
			if( !this._dialog ) {
				return;
			}
			this._dialog.wcFactoryDialog('dialogHide');
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

	$.wbcrCore.registerPluginClass('core', 'plugin', plugin);
})
(jQuery);
