(function($) {
	'use strict';

	var socialButton = {};

	socialButton.init = function(options) {

		this._isRendered = false;

		this.options = $.extend(true, this._defaults, options);

		this.title = this.options.title || this._defaults.title;
		this.lang = 'ru_RU';
		this.buttonType = this.options.buttonType || 'custom';
		this.layout = this.options.style.layout || 'horizontal';
		this.effect = this.options.effect;
		this.availableCounter = true;
		this.counter = this.options.counter || this.options.counters;

		if( this.options.style.layout && this.options.style.layout == 'vertical' ) {
			this.counter = true;
		}

		this.pageUrlHash = $.aikaApi.tools.hash(this.pageUrl);
		this.counterNumber = 0;
		this.counterCacheName = this.uq('cache-counter') + '-' + this.pageUrlHash;

		this.pageUrl = this._extractPageUrl();
		this.pageTitle = this.options.pageTitle || this._extractPageTitle();
		this.pageDescription = this.options.pageDescription || this._extractPageDescription();
		this.pageImage = this.options.pageImage || this._extractPageImage();

		this._deferred = $.Deferred();

		if( this.prepareOptions ) {
			this.prepareOptions();
		}

		if( !this.availableCounter ) {
			this.counter = false;
		}

		if( this.buttonType == 'iframe' ) {
			return;
		}

		if( this.counter && this.availableCounter && !this.getCache() ) {
			this.getCounter();
			return;
		} else if( this.getCache() ) {
			this._deferred.resolve(this.getCache());
			this.counterNumber = this.getCache();
			return;
		}

		this._deferred.resolve(0);
	};

	/**
	 * Открывает окно для публикации сообщения в социальную сеть
	 */
	socialButton.openShareWindow = function() {
		var self = this;

		if( this.buttonType !== 'custom' || !this.options.popupUrl ) {
			throw new Error('Окно не может быть вызвано, так как этот тип кнопок не поддерживает эту возможность.');
		}

		self.runHook('open-share-window', [self.name, self.options]);

		var shareUrl = this.makeUrl(this.options.popupUrl, this);

		$.aikaApi.tools.openWindow(shareUrl, {winName: 'Share by ' + this.name}, function() {
			// Выполнит хук, если окно было закрыто
			self.runHook('close-share-window', [self.name, self.options]);
		});
	};

	/**
	 * Функция обратного вызова, которая будет вызвана после
	 * срабатывания одного из событий iframe кнопки
	 * @param data object названия событий, коды ошибок, различные уведомления.
	 */
	socialButton.iframeButtonCallback = function(data) {
		// код который нужно выполнить в результате действия кнопки
	};

	/**
	 * Публикует кнопку в заранее переданный контейнер
	 * @param $holder object контейнер
	 */
	socialButton.renderButton = function($holder) {
		this.renderCustomButton($holder);
	};

	/**
	 * Публикует произвольную кнопку в заранее переданный контейнер
	 * В отличии от iframe кнопки, она имеет свою разметку и все ресурсы используются локально
	 * @param $holder object контейнер
	 */
	socialButton.renderCustomButton = function($holder) {
		var button = $('<a href="#"></a>');
		button.data('button-name', this.name);
		this.addClass(button, ['btn']);

		var bage = $('<span class="' + this.uq('btn-bage') + '">' +
		'<span class="' + this.uq('btn-icon') + '">' + this.getIcon() + '</span>' +
		'<span class="' + this.uq('btn-title') + '">' + this.title + '</span>' +
		'</span>');
		button.append(bage);

		if( this.counter ) {
			var counter = $('<span class="' + this.uq('btn-counter') + '">' + this.counterNumber + '</span>');
			button.append(counter);
		}

		$holder.append(button);
	};

	/**
	 * Создает разметку кнопки и публикует ее в переданный контейнер.
	 * @param $holder object контейнер
	 */
	socialButton.create = function($holder) {
		this.wrap = $('<div></div>').appendTo($holder);
		this.innerWrap = $('<div></div>').appendTo(this.wrap);
		this.addClass(this.wrap, [
			'control',
			'control-' + this.network,
			'control-' + this.name,
			'btn-type-' + this.buttonType
		]);

		if( this.counter ) {
			this.addClass(this.wrap, 'counter-on');
		} else {
			this.addClass(this.wrap, 'counter-off');
		}

		this.addClass(this.innerWrap, 'control-inner-wrap');

		this._isRendered = true;

		this.renderButton(this.innerWrap);
	};

	// ----------------------------------------------------------------
	// Методы для работа со статусом загрузки кнопок
	// ----------------------------------------------------------------

	/**
	 * Установливает статус, что кнопка загружена
	 */
	socialButton.setLoadingState = function() {
		var self = this;
		if( this.isLoading() ) {
			return;
		}

		this.innerWrap.fadeIn(150, function() {
			self.addClass(self.wrap, 'button-loaded');
		});

		this._isLoadingState = true;
	};

	/**
	 * Удаляет статус, что кнопка загружена
	 */
	socialButton.removeLoadingState = function() {
		this.removeClass(this.wrap, 'button-loaded');
		this._isLoadingState = false;
	};

	/**
	 * Проверяет, загружена ли кнопка.
	 */
	socialButton.isLoading = function() {
		return this._isLoadingState;
	};

	// ----------------------------------------------------------------
	// Методы для работы со счетчиками
	// ----------------------------------------------------------------

	/**
	 * Получает состояние загрузки кнопки
	 * @returns {*}
	 */
	socialButton.getState = function() {
		return this._deferred.promise();
	};

	/**
	 * Запускает процес получения счетчика из соц. сетей
	 * @returns {*}
	 */
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
	 * Обновляет счетчик
	 * @param counterNumber
	 * @returns {boolean}
	 */
	socialButton.updateCounter = function(counterNumber) {
		if( !this.wrap || !this.wrap.length ) {
			return false;
		}
		this.wrap.find('.' + this.uq('btn-counter')).text(counterNumber);
		return true;
	};

	/**
	 * Получает закешированные счетчики
	 * @param all boolean если нужно получать все счетчики, нужно использовать true
	 * @returns {*}
	 */
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

	/**
	 * Кеширует счетчики на 1 день
	 * @param number int число, которое нужно закешировать
	 * @returns {boolean}
	 */
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

	/**
	 * Получает скрипт счетчика c помощью функции getJSON
	 * @param callback
	 * @returns void
	 */
	socialButton.getShareCounterJson = function() {
		var self = this;

		$.getJSON(this.makeUrl(this.options.counterUrl, this)).done(function(data) {
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
		$.getScript(this.makeUrl(this.options.counterUrl, this), callback ? callback : function() {
		}).fail(this._deferred.reject);
	};

	// ----------------------------------------------------------------
	// Обработка ошибок
	// ----------------------------------------------------------------

	socialButton._setError = function(message) {
		if( this._error ) {
			return;
		}
		this._error = message;
	};

	socialButton._hasError = function() {
		return this._error ? true : false;
	};

	socialButton.showError = function(message, $holder) {
		var self = this;

		if( !this._isRendered ) {
			this.runHook('control-error', [self.name, message]);
			this._setError(message);
			return;
		}

		var $holder = $holder || this.innerWrap;
		var message = message || this._error;

		this.runHook('control-error', [self.name, message]);

		if( this.wrap.hasClass('onp-sl-state-error') ) {
			return;
		}

		self.removeClass(self.wrap, 'button-loaded');
		self.addClass(self.wrap, 'state-error');

		var $error = this.createErrorMarkup(message).appendTo($holder);

		$error.find("." + this.uq('control-error-title')).click(function() {
			//self.group.showError(self.name, message);
			self.runHook('open-control-error-message', [self.name, message]);
			return false;
		});
	};

	/**
	 * Creats the markup for the error.
	 */
	socialButton.createErrorMarkup = function(text) {
		return $("<div class='" + this.uq('control-error-body') + "'><a href='#' class='" + this.uq('control-error-title') + "'>" + text + "</a></div>");
	};

	// ----------------------------------------------------------------
	// Вспомогательные методы
	// ----------------------------------------------------------------

	/**
	 * Преобразует длинное число счетчика в короткое
	 * @param n
	 * @returns string
	 */
	socialButton.convertLongNumbers = function(n) {
		if( n < 1000 ) {
			return n;
		}

		n = n / 1000;
		n = Math.round(n * 10) / 10;

		return n + "k";
	};

	// Извлекает url страницы
	socialButton._extractPageUrl = function() {
		return $.aikaApi.tools.URL.normalize(this.options.pageUrl || window.location.href);
	};

	// Извлекает заголовок страницы
	// Обрабатывается внутри кнопки
	socialButton._extractPageTitle = function() {
		return null;
	};

	// Извлекает заголовок страницы
	// Обрабатывается внутри кнопки
	socialButton._extractPageDescription = function() {
		return null;
	};

	// Извлекает описание страницы
	// Обрабатывается внутри кнопки
	socialButton._extractPageImage = function() {
		return null;
	};

	// Извлекает изображение страницы
	// Обрабатывается внутри кнопки
	socialButton.makeUrl = function(url, context) {
		return $.aikaApi.tools.buildUrl(url, context);
	};

	/*socialButton.showWarning = function(message, sender, showForce) {
	 return this.plugin.showWarning(message, sender, showForce);
	 };

	 socialButton.showCriticalError = function(message, sender) {
	 return this.plugin.showCriticalError(message, sender);
	 };*/

	$.aikaCore.registerPluginClass('aikaSocialButtons', 'control', socialButton);

})(jQuery);