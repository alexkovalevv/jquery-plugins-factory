/**
 * Класс группы социальных кнопок
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 23.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';

	$.wbcrPluginSocialButtons.group = {

		/**
		 * Инициализирует группу социальных кнопок
		 * @param options object
		 * @param plugin object
		 */
		init: function(options, plugin) {
			this.prefix = plugin.prefix;
			this._default = plugin.options.group;
			this.options = options;
			this.pluginOptions = plugin.options;
			this.plugin = plugin;
		},

		_getGroupTemplate: function(buttons) {
			var getTemplate, template, templateName = null;

		    if(this.options.template && typeof this.options.template === 'string') {
			    template = this.options.template;
			    templateName = template;

			    if( !$.wbcrPluginSocialButtons.groupThemes[templateName] ) {
				    this.showCriticalError('Шаблон {'+ templateName +'} кнопок не существует.');
				    return;
			    }

			    getTemplate = $.wbcrPluginSocialButtons.groupThemes[templateName];
		    } else if( template && typeof template === 'function') {
			    getTemplate = template;
		    } else {
			    this.showCriticalError('Невозможно определить формат данных.');
			    return;
		    }

			var	themeVars = {
					groupContanierClasses: this.uq('contanier'),
					buttons: buttons,
					groupCounterClasses: '',
					grpoupCounter: ''
				};

			if(templateName) {
				themeVars['groupContanierClasses'] = ' ' + this.uq('group-template-' + templateName);
			}

			// Устанавливаем выравнивание кнопок
			if( this.options.align ) {
				if( !$.wbcrApi.tools.inArray(this.options.align, ['left', 'center', 'right']) ) {
					this.showWarning('Выбранная вами тема не поддерживает "' + this.options.align + '" выравнивание кнопок."', '_render')
					this.options.align = this._default.align;
				}
				themeVars['groupContanierClasses'] += ' ' + this.uq('group-align-' + this.options.align);
			}

			return $.wbcrApi.tools.createSkin(getTemplate(), themeVars);
		},

		_createButton: function(buttonName) {
			if( !$.wbcrPluginSocialButtons.buttons[buttonName] ) {
				this.showCriticalError('Кнопки {' + buttonName + '} не существует.');
				return;
			}

			var parts = buttonName.split('-');

			var networkName = parts.length === 2 ? parts[0] : null;
			//var buttonAlias = parts.length === 2 ? parts[1] : parts[0];


			if( !this.pluginOptions[networkName] ) {
				this.pluginOptions[networkName] = {};
			}

			$.wbcrPluginSocialButtons.buttons[buttonName].init(this.pluginOptions[networkName], this.plugin);
			return $.wbcrPluginSocialButtons.buttons[buttonName].render();
		},

		render: function() {
			var self = this;

			if( !this.options.order.length ) {
				this.plugin.showCriticalError('Не установлена сортировка кнопок.');
				return;
			}

			this._loadButtons = {};
			var buttons = '';
			for( var i = 0; i < this.options.order.length; i++ ) {
				buttons += self._createButton(this.options.order[i]);
			}

			/*$.map(this.options.order, function(buttonName) {
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

			var buttons = '';
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

			return this._getGroupTemplate(buttons);
		},

		uq: function(value, separator, attr) {
			return this.plugin.uq(value, separator, attr);
		}
	}

})(jQuery);
