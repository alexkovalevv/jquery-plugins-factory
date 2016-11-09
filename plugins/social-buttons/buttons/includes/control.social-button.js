(function($) {
	'use strict';

	var socialButton = {};

	socialButton.init = function(options, plugin) {
		this.component = plugin;
		this.prefix = this.component._prefix;
		this.theme = this.component.options.buttons.theme;
		this.counter = this.component.options.buttons.counter;
		this.availableCounter = true;
		this.effect = this.component.options.buttons.effect;

		var parts = this.name.split('-');
		this.networkName = parts.length === 2 ? parts[0] : null;
		this.buttonType = parts.length === 2 ? parts[1] : null;

		var temp = $.extend(true, {}, this._defaults);
		this.options = $.extend(true, temp, options);
		this.url = this._extractUrl();
		this.title = this.options.title || this._defaults.title;
		this.icon = this.getIcon();

		this.counterNumber = 0;

		this.urlHash = $.aikaApi.tools.hash(this.url);
		this.counterCacheName = this._uq('cache-counter') + '-' + this.urlHash;

		this._deferred = $.Deferred();

		if( this.prepareOptions ) {
			this.prepareOptions();
		}

		if( this.counter && this.availableCounter && !this.getCache() ) {
			this.getCounter();
			return;
		} else if( this.getCache() ) {
			this._deferred.resolve(this.getCache());
			this.counterNumber = this.getCache();
			return;
		}

		this._deferred.resolve();
	};

	socialButton.getCache = function(all) {
		var counterCache = $.aikaApi.tools.getFromStorage(this.counterCacheName);

		if( counterCache ) {
			counterCache = JSON.parse(counterCache);
		}

		if( all ) {
			return counterCache;
		}

		if( counterCache && counterCache[this.name] ) {
			return counterCache[this.name];
		}

		return null;
	};

	socialButton.setCache = function(number) {
		var self = this,
			getCounters;

		if( this.getCache(true) ) {
			getCounters = this.getCache(true);
			if( getCounters[this.name] ) {
				return false;
			}
			getCounters[this.name] = number;
		} else {
			getCounters = {};
			getCounters[this.name] = number;
		}

		var storageData = JSON.stringify(getCounters);

		$.aikaApi.tools.setStorage(self.counterCacheName, storageData, 1);

		return true;
	};

	socialButton.render = function() {
		var self = this;
		var output = '';

		return self.createButton();
	};

	socialButton.createButton = function() {
		var themeVars = {
			classes: this._uq('btn'),
			serviceName: this.networkName,
			buttonName: this.name,
			prefix: this.prefix,
			themeName: this.theme,
			icon: this.icon,
			title: this.title
		};

		themeVars['classes'] += ' ' + this._uq(this.theme + '-btn');
		themeVars['classes'] += ' ' + this._uq(this.theme) + '-btn-' + this.name;

		if( this.counter && !this.availableCounter ) {
			this.showWarning('Кнопка с именем "' + this.name + '" не поддерживает счетчик.', '_renderButton');
			// Принудительно убираем счетчик у кнопки, если кнопка его не поддерживает
			themeVars['classes'] += ' ' + this._uq('btn-hidden');
		}

		// Устанавливаем эффект для кнопки
		themeVars['classes'] += ' hvr-' + this.effect;

		// Получаем настройки выбранного шаблона
		var buttonsTemplateConfig = this.component._getThemeConfig();

		// Если в настройках есть разрешение для счетчика и пользователь активировал счетчик,
		// то передаем счетчик
		if( buttonsTemplateConfig.isCounter && this.counter ) {
			themeVars['counter'] = this.convertLongNumbers(this.counterNumber);
		}

		// Получаем шаблон кнопки
		var buttonTemplate = this.component._getTheme();

		return $.aikaApi.tools.createSkin(buttonTemplate, themeVars);
	};

	socialButton.getState = function() {
		return this._deferred.promise();
	};

	socialButton.getCounter = function() {
		var self = this;
		if( this.counterInit ) {
			this.counterInit();
		}
		return this._deferred.done(function(number) {
			self.counterNumber = number;
			self.setCache(number);
		});
	};

	/**
	 * Преобразует длинное число счетчика в короткое
	 * @param n
	 * @returns string
	 */
	socialButton.convertLongNumbers = function(n) {
		return this.component._convertLongNumbers(n);
	};

	/**
	 * Получает скрипт счетчика c помощью функции getJSON
	 * @param callback
	 * @returns void
	 */
	socialButton.getShareCounterJson = function() {
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
	};

	/**
	 * Получает скрипт счетчика c помощью функции getScript
	 * @param callback
	 * @returns void
	 */
	socialButton.getShareCounterScripts = function(callback) {
		$.getScript(this.makeUrl(this.options.counterUrl, {
			url: this.url,
			index: this.idx
		}), callback ? callback : function() {
		})
			.fail(this._deferred.reject);
	};

	/**
	 * The funtions which returns an URL to like/share for the button.
	 * Uses the options and a current location to determine the URL.
	 */
	socialButton._extractUrl = function() {
		return this.options.url || window.location.href;
	};

	socialButton._uq = function(value, separator, attr) {
		return this.component._uq(value, separator, attr);
	};

	socialButton.makeUrl = function(url, context) {
		return $.aikaApi.tools.createSkin(url, context, encodeURIComponent);
	};

	socialButton.showWarning = function(message, sender, showForce) {
		return this.component._showWarning(message, sender, showForce);
	};

	socialButton.showCriticalError = function(message, sender) {
		return this.component._showCriticalError(message, sender);
	};

	// --------------------------------------------------------------
	// Events
	// --------------------------------------------------------------

	/**
	 * Subscribes to the specified hook.
	 */
	socialButton.addHook = function(eventName, callback, priority) {
		return this.component.addHook(eventName, callback, priority);
	};

	/**
	 * Runs the specified hook.
	 */
	socialButton.runHook = function(eventName, args) {
		return this.component.runHook(eventName, args);
	};

	/**
	 * Subscribes to the specified hook.
	 */
	socialButton.addFilter = function(eventName, callback, priority) {
		return this.component.addFilter(eventName, callback, priority);
	};

	/**
	 * Runs the specified hook.
	 */
	socialButton.applyFilters = function(eventName, input, args) {
		return this.component.applyFilters(eventName, input, args);
	};

	$.aikaPluginSocialButtons.control = socialButton;

})(jQuery);