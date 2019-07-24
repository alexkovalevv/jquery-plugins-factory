/**
 * Модуль социальных кнопок
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	$.wbcrCore.registerPlugin('wcSocialButtons', {
		pluginName: 'social-buttons',

		defaults: {
			// Положение шаблона вертикально(vertical) или горизонтально(horizontal)
			layout: 'horizontal',
			// Выравнивание кнопок
			align: 'left',
			// Сортировка кнопок
			order: ['facebook-share'],
			// Стиль кнопок
			style: {
				name: 'starter',
				layout: 'horizontal'
			},
			// Эффект кнопок
			effect: 'push',
			// Размер кнопок
			size: 'small',
			// Счетчики
			counters: true
		},

		create: function() {
			this.prefix = this.uq('sbtns', '-');
			this._setupEvents();
			this._render();

		},

		_extendPrepareOptions: function() {
			this._style = this.options.style && this.options.style.name || this._default.style['name']
			this._layout = this.options.layout || this._default['layout'];
			this._align = this.options.align || this._default['align'];
			this._size = this.options.size || this._default['size'];
			this._effect = this.options.effect || this._default['effect'];
			this._order = this.options.order || this._default['order'];

			this._buttons = this.getPluginObjects('buttons');
		},

		_setupEvents: function() {
			var self = this;

			$(document).on('click', '.' + this.uq('btn'), function() {

				var buttonName = $(this).data('button-name');
				if( !self._issetButton(buttonName) ) {
					return false;
				}
				self.runHook('before-open-share-window', [buttonName, self._buttons[buttonName].options]);
				//self._buttons[buttonName].openShareWindow();

				self.showErrorDialog('test test');

				return false;
			});
		},

		_render: function() {
			this._createTemplate();
			this._renderButtons();
		},

		_createTemplate: function() {
			this.addClass(this.element, [
				'plugin',
				'style-' + this._style,
				this._layout,
				this._align,
				this._size,
				this._effect
			]);
		},

		_renderButtons: function() {
			var self = this;

			$.map(this.options.order, function(buttonName, index) {
				if( !self._issetButton(buttonName) ) {
					return;
				}

				var parts = buttonName.split('-'),
					networkName = parts.length === 2 ? parts[0] : null,
					buttonType = parts.length === 2 ? parts[1] : null;

				var buttonOptions = $.extend(true, {}, self.options);

				if( self.options[networkName] && self.options[networkName][buttonType] ) {
					buttonOptions = $.extend(true, buttonOptions, self.options[networkName][buttonType]);
				}

				// Расширяем кнопки публичный api плагина
				self._buttons[buttonName] = $.extend(true, self.getPluginPublicApi(), self._buttons[buttonName]);

				self._buttons[buttonName].prefix = self.prefix;
				self._buttons[buttonName].network = networkName;
				self._buttons[buttonName].index = index;

				self._buttons[buttonName].init(buttonOptions);
				self._buttons[buttonName].create(self.element);

				self._renderButton(buttonName);
			});
		},

		_renderButton: function(buttonName) {
			var self = this;

			if( !self._issetButton(buttonName) ) {
				return;
			}

			if( self._buttons[buttonName].buttonType == 'custom' ) {
				self._buttons[buttonName].getState().always(function(counterNumber) {
					if( !counterNumber ) {
						counterNumber = 0;
					}
					self._buttons[buttonName].updateCounter(counterNumber);
					self._buttons[buttonName].setLoadingState();
				});
			}
		},

		_issetButton: function(buttonName) {
			if( !this._buttons[buttonName] ) {
				this.showCriticalError('Кнопка {' + buttonName + '} не зарегистрирована. Пожалуйста, проверьте конфигурацию плагина.');
				return false;
			}

			return true;
		},

		showWarning: function(message, sender, showForce) {
			if( !message || message == '' ) {
				return;
			}

			if( !showForce && this.options.appPublic ) {
				return;
			}

			this.runHook('warning-error', [message, sender]);

			var errorContanier = this.element.find('.' + this.uq('plugin-warning-error'));
			if( errorContanier.length ) {
				errorContanier.html(errorContanier.html() + '<br><b>Внимание!</b> ' + message);
			} else {
				this.element.prepend('<div class="' + this.uq('plugin-warning-error') + '"><b>Внимание!</b> ' + message + '</div>');
			}
		},

		showCriticalError: function(message, sender) {
			if( !message || message == '' ) {
				return;
			}

			this.runHook('critical-error', [message, sender]);

			var errorContanier = this.element.find('.' + this.uq('plugin-critical-error'));
			if( errorContanier.length ) {
				errorContanier.html(errorContanier.html() + '<br>' + message);
			} else {
				this.element.prepend('<div class="' + this.uq('plugin-critical-error') + '"><b>Ошибка!</b> ' + message + '</div>');
			}

			throw new Error(message);
		}

	});
})(jQuery);
