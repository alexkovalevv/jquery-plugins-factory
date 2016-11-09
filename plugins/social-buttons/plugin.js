/**
 * Модуль социальных кнопок
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	$.aikaCore.registerPlugin('aikaSocialButtons', {

		_pluginName: 'social-buttons',

		_defaults: {
			// Сортировка кнопок
			order: [
				'tumblr-share',
				'google-share',
				'twitter-tweet',
				'facebook-share',
				'vkontakte-share',
				'odnoklassniki-share',
				'mail-share',
				'linkedin-share',
				'pinterest-share'
			],

			buttons: {
				theme: 'cozy',
				effect: 'push',
				size: 'small',
				counter: true,
				counterType: 'vertical',
				align: 'left',
				facebook: {
					share: {
						title: 'share',
						url: 'https://google.com'
					}
				},
				twitter: {
					tweet: {
						title: 'tweet',
						url: 'https://google.com'
					}
				},
				google: {
					share: {
						title: '+plus',
						url: 'https://google.com'
					}
				},
				vkontakte: {
					share: {
						title: 'share',
						url: 'http://google.com'
					}
				},
				odnoklassniki: {
					share: {
						title: 'share',
						url: 'https://google.com'
					}
				},
				mail: {
					share: {
						title: 'share',
						url: 'https://google.com'
					}
				},
				linkedin: {
					share: {
						title: 'share',
						url: 'https://google.com'
					}
				},
				pinterest: {
					share: {
						title: 'share',
						url: 'https://google.com'
					}
				},
				tumblr: {
					share: {
						title: 'share',
						url: 'https://google.com'
					}
				}
			}
		},

		_create: function() {
			this._prefix = this._uq('sbtns', '-');
			console.log('init social buttons component');
			return this.render();
		},

		render: function() {
			var self = this;

			if( !this.options.order.length ) {
				return;
			}

			var buttonContanier = this._uq('contanier'),
				themeVars = {
					classes: buttonContanier + ' ' + this._uq(this.options.buttons.theme + '-contanier')
				},
				contanierTemplate = this._getButtonsContanierTemplate();

			// Устанавливаем выравнивание кнопок
			if( this.options.buttons.align ) {
				if( !$.aikaApi.tools.inArray(this.options.buttons.align, ['left', 'center', 'right']) ) {
					this._showWarning('Выбранная вами тема не поддерживает "' + this.options.buttons.align + '" выравнивание кнопок."' + this.options.buttons.theme + '".', '_render')
					this.options.buttons.align = this._defaults.buttons.align;
				}
				themeVars['classes'] += ' ' + this._uq('align-' + this.options.buttons.align);
			}

			// Получаем настройки выбранного шаблона
			var buttonsTemplateConfig = this._getThemeConfig();

			// Проверяем размер кнопок установленных пользователем и разрешенный размеры в шаблоне
			// Если пользовательский размер кнопок доступен в шаблоне, печатаем настройки этого размера
			if( buttonsTemplateConfig.size && buttonsTemplateConfig.size.length ) {
				if( !$.aikaApi.tools.inArray(this.options.buttons.size, buttonsTemplateConfig.size) ) {
					this._showWarning('Выбранная вами тема не поддерживает "' + this.options.buttons.size + '" размер кнопок."' + this.options.buttons.theme + '".', '_render');
					this.options.buttons.size = this._defaults.buttons.size;
				}

				themeVars['size'] = this.options.buttons.size;
				themeVars['classes'] += ' ' + this._uq(this.options.buttons.theme + '-' + this.options.buttons.size);
			}

			// Если в настройках есть разрешение для счетчика и пользователь активировал счетчик,
			// показваем счетчик у кнопок
			if( buttonsTemplateConfig.isCounter && this.options.buttons.counter ) {
				themeVars['classes'] += ' ' + this._uq(this.options.buttons.theme + '-counter-available');

				if( !$.aikaApi.tools.inArray(this.options.buttons.counterType, buttonsTemplateConfig.counterType) ) {
					this._showWarning('Выбранная вами тема не поддерживает "' + this.options.buttons.counterType + '" тип счетчика.', '_render');
					this.options.buttons.counterType = this._defaults.buttons.counterType;
				}

				themeVars['classes'] += ' ' + this._uq(this.options.buttons.theme + '-counter-' + this.options.buttons.counterType);
			}

			this.element.append($.aikaApi.tools.createSkin(contanierTemplate, themeVars));
			this._loadButtons = {};

			$.map(this.options.order, function(buttonName) {
				var button = self._createButton(buttonName);

				button.getState().always(function(counterNumber) {
					if( !counterNumber ) {
						counterNumber = 0;
					}
					counterNumber = parseInt(counterNumber);
					self.totalCounter = self.totalCounter + counterNumber;

					self._loadButtons[buttonName] = button.render();
				});
			});

			var timer = setInterval(function() {
				if( Object.keys(self._loadButtons).length === self.options.order.length ) {
					for( var i in self.options.order ) {
						if( !self._loadButtons.hasOwnProperty(self.options.order[i]) ) {
							continue;
						}
						$('.' + buttonContanier, self.element)
							.append(self._loadButtons[self.options.order[i]]);

						self.runHook('button-after-create', [self.options.order[i]]);
					}

					self._createButtonTotalCounter();

					clearInterval(timer);
				}
			}, 50);

			return this.element;
		},

		_createButton: function(name) {
			if( !$.aikaPluginSocialButtons.buttons[name] ) {
				this._showCriticalError('Кнопка с именем ' + name + ' не существует.', '_createButton');
			}

			this.runHook('button-before-create', [name]);

			var parts = name.split('-'),
				networkName = parts.length === 2 ? parts[0] : null,
				buttonType = parts.length === 2 ? parts[1] : null;

			var button = $.aikaApi.tools.extend($.aikaPluginSocialButtons.buttons[name]);
			button.init(this.options.buttons[networkName][buttonType], this);

			return button;
		},

		_createButtonTotalCounter: function() {
			var buttonContanier = $('.' + this._uq('contanier'), this.element),
				childTag = buttonContanier.children().prop("tagName");

			buttonContanier.append(
				'<' + childTag + ' class="' + this._uq('total-counter') + '">'
				+ this._convertLongNumbers(this.totalCounter) + '<span>shares</span>' +
				'</' + childTag + '>'
			);
		},

		_getThemeConfig: function() {
			return $.aikaPluginSocialButtons.themes[this.options.buttons.theme].config
				? $.aikaPluginSocialButtons.themes[this.options.buttons.theme].config
				: {};
		},

		_getTheme: function() {
			return $.aikaPluginSocialButtons.themes[this.options.buttons.theme].button
				? $.aikaPluginSocialButtons.themes[this.options.buttons.theme].button()
				: false;
		},

		_getButtonsContanierTemplate: function() {
			return $.aikaPluginSocialButtons.themes[this.options.buttons.theme].contanier
				? $.aikaPluginSocialButtons.themes[this.options.buttons.theme].contanier()
				: false;
		},

		_showWarning: function(message, sender, showForce) {
			if( !message || message == '' ) {
				return;
			}

			if( !showForce && this.options.appPublic ) {
				return;
			}

			this.runHook('warning-error', [message, sender]);

			var errorContanier = this.element.find('.' + this._uq('plugin-warning-error'));
			if( errorContanier.length ) {
				errorContanier.html(errorContanier.html() + '<br><b>Внимание!</b> ' + message);
			} else {
				this.element.prepend('<div class="' + this._uq('plugin-warning-error') + '"><b>Внимание!</b> ' + message + '</div>');
			}
		},

		_showCriticalError: function(message, sender) {
			if( !message || message == '' ) {
				return;
			}

			this.runHook('critical-error', [message, sender]);

			var errorContanier = this.element.find('.' + this._uq('plugin-critical-error'));
			if( errorContanier.length ) {
				errorContanier.html(errorContanier.html() + '<br>' + message);
			} else {
				this.element.prepend('<div class="' + this._uq('plugin-critical-error') + '"><b>Ошибка!</b> ' + message + '</div>');
			}

			throw new Error(message);
		},
		/**
		 * Преобразует длинное число счетчика в короткое
		 * @param n
		 * @returns string
		 */
		_convertLongNumbers: function(n) {
			if( n < 1000 ) {
				return n;
			}

			n = n / 1000;
			n = Math.round(n * 10) / 10

			return n + "k";
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
