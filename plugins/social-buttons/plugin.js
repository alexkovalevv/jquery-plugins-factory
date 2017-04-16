/**
 * Модуль социальных кнопок
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	$.aikaCore.registerPlugin('aikaSocialButtons', {
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
			this._render();
		},

		prepareOptions: function() {
			/// вызываем родительский метод
			this.superclass.prepareOptions.call(this);

			this._style = this.options.style && this.options.style.name || this._default.style['name']
			this._layout = this.options.layout || this._default['layout'];
			this._align = this.options.align || this._default['align'];
			this._size = this.options.size || this._default['size'];
			this._effect = this.options.effect || this._default['effect'];
			this._order = this.options.order || this._default['order'];

			this._buttons = this.getPluginObjects('buttons');
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

				if( !self._buttons[buttonName] ) {
					self.showCriticalError('Кнопка {' + buttonName + '} не зарегистрирована. Пожалуйста, проверьте конфигурацию плагина.');
				}

				var parts = buttonName.split('-'),
					networkName = parts.length === 2 ? parts[0] : null,
					buttonType = parts.length === 2 ? parts[1] : null;

				var buttonOptions = $.extend(true, {}, self.options);

				if( self.options[networkName] && self.options[networkName][buttonType] ) {
					buttonOptions = $.extend(true, buttonOptions, self.options[networkName][buttonType]);
				}

				self._buttons[buttonName].prefix = self.prefix;
				self._buttons[buttonName].network = networkName;
				self._buttons[buttonName].idx = index;

				self._buttons[buttonName].init(buttonOptions);
				self._buttons[buttonName].create(self.element);

				if( self._buttons[buttonName].buttonType == 'custom' ) {
					self._buttons[buttonName].getState().always(function(counterNumber) {
						console.log(counterNumber);
						if( !counterNumber ) {
							counterNumber = 0;
						}
						self._buttons[buttonName].updateCounter(counterNumber);
						self._buttons[buttonName].setLoadingState();
					});
				}
			});

			for( var i in this._order ) {
				if( !this._order.hasOwnProperty(i) ) {
					continue;
				}

				var buttonName = this._order[i];

				/*var buttons = '';
				 var timer = setInterval(function() {
				 if( Object.keys(self._loadButtons).length === self.options.order.length ) {
				 for( var i in self.options.order ) {
				 if( !self._loadButtons.hasOwnProperty(self.options.order[i]) ) {
				 continue;
				 }
				 //$('.' + buttonContanier, self.element)
				 //.append(self._loadButtons[self.options.order[i]]);
				 buttons += self._loadButtons[self.options.order[i]];

				 self.runHook('button-after-create', [self.options.order[i]]);
				 }

				 //self._createButtonTotalCounter();

				 clearInterval(timer);
				 }
				 }, 50);*/
			}
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
		},

		/**
		 * Получает скрипт счетчика c помощью функции getJSON
		 * @param callback
		 * @returns void
		 */
		_getShareCounterJson: function() {
			var self = this;
			$.getJSON(this.makeUrl(this.options.counterUrl, {
				url: this.url
			})).done(function(data) {
				try {
					var number = data;
					if( $.isFunction(self.convertNumber) ) {
						number = self.convertNumber(data);
					}
					self._deferred.resolve(number);
				}
				catch( e ) {
					self._deferred.reject();
				}
			}).fail(self._deferred.reject);
		},

		/**
		 * Получает скрипт счетчика c помощью функции getScript
		 * @param callback
		 * @returns void
		 */
		_getShareCounterScripts: function(callback) {
			$.getScript(this.makeUrl(this.options.counterUrl, {
				url: this.url,
				index: this.idx
			}), callback ? callback : function() {
			}).fail(this._deferred.reject);
		}
	});

	/*$(document).ready(function() {
	 $('.content').aikaSocialButtons({
	 order: ['tumblr-share', 'google-share']
	 });
	 });*/

})(jQuery);
