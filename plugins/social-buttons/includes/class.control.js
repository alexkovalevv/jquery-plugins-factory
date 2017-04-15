(function($) {
	'use strict';

	var socialButton = {};

	socialButton.init = function(options) {

		this.options = $.extend(true, this._defaults, options);

		this.counter = this.options.counter || this.options.counters;
		this.availableCounter = true;
		this.effect = this.options.effect;

		this.url = this._extractUrl();
		this.title = this.options.title || this._defaults.title;

		this.counterNumber = 0;

		this.urlHash = $.aikaApi.tools.hash(this.url);
		this.counterCacheName = this.uq('cache-counter') + '-' + this.urlHash;

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

	socialButton.getTemplate = function() {
		var button = $('<a href="#"></a>');
		button.data('buttons-name', this.name);
		this.addClass(button, ['btn']);

		var bage = $('<span class="' + this.uq('btn-bage') + '">' +
		'<span class="' + this.uq('btn-icon') + '"></span>' +
		'<span class="' + this.uq('btn-title') + '">' + this.title + '</span>' +
		'</span>');
		button.append(bage);

		var counter = $('<span class="' + this.uq('btn-counter') + '">' + this.counterNumber + '</span>');
		button.append(counter);

		return button;
	};

	/**
	 * Оборачивает iframe кнопку в нужный шаблон и передает обратно
	 * @param $holder iframe кнопка
	 */
	socialButton.getIframeButtonTemplate = function($holder) {
		return $holder;
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

	socialButton.render = function($holder) {
		this.wrap = $('<div></div>');
		this.addClass(this.wrap, ['control', 'control-' + this.name, 'network-' + this.network]);
		this.wrap.append(this.getTemplate());
		$holder.append(this.wrap);
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
		if( n < 1000 ) {
			return n;
		}

		n = n / 1000;
		n = Math.round(n * 10) / 10;

		return n + "k";
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
		}).fail(this._deferred.reject);
	};

	/**
	 * The funtions which returns an URL to like/share for the button.
	 * Uses the options and a current location to determine the URL.
	 */
	socialButton._extractUrl = function() {
		return this.options.url || window.location.href;
	};

	socialButton.makeUrl = function(url, context) {
		return $.aikaApi.tools.createSkin(url, context);
	};

	/*socialButton.showWarning = function(message, sender, showForce) {
	 return this.plugin.showWarning(message, sender, showForce);
	 };

	 socialButton.showCriticalError = function(message, sender) {
	 return this.plugin.showCriticalError(message, sender);
	 };*/

	$.aikaCore.registerPluginClass('aikaSocialButtons', 'control', socialButton);

})(jQuery);