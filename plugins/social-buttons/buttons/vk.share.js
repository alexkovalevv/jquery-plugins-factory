/**
 * Кнопка поделиться вконтакте
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	if( !window.__onp_wdgt_vk_share_couter_callbacks ) {
		window.__onp_wdgt_vk_share_couter_callbacks = {};
	}

	var button = $.aikaCore.extendPluginClass('aikaSocialButtons', ['control', 'iframe-buttons-loader']);

	button.name = 'vk-share';

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'Поделиться',
		// Тип кнопки (iframe, custom)
		// по умолчанию iframe
		buttonType: 'iframe',
		// Заголовок записи на стене
		pageTitle: null,
		// Описание записи на стене
		pageDescription: null,
		// Url записи на стене
		pageUrl: null,
		// Изображение записи на стене
		pageImage: null,
		// Ширина всплывающего окна
		popupWidth: 655,
		// Высота всплывающего окна
		popupHeight: 450,
		// Url всплывающего окна
		popupUrl: '//vk.com/share.php?url={url}&title={title}',
		// Url для получения счетчика
		counterUrl: '//vk.com/share.php?act=count&url={url}&index={index}'
	};

	// Вконтакте не любит киррилические домены, поэтому мы преобразуем url перед тем, как его использовать.
	button._extractUrl = function() {
		var URL = this.options.url || window.location.href;

		if( $.aikaApi.tools.checkDomainType(URL) == 'cyrillic' ) {
			var arrUrlParts = URL.split("/");
			URL = arrUrlParts[0] + '//' + $.aikaApi.punycode.toASCII($.aikaApi.tools.normalizecyrillicDomain(arrUrlParts[2]));
		}
		return $.aikaApi.tools.URL.normalize(URL);
	};

	button.prepareOptions = function() {
		this.idx = parseInt(this.idx) + 100;

		if( $.aikaApi.tools.checkDomainType(this.url) == 'punycode' ) {
			this.counter = false;
		}
	};

	button.counterInit = function() {
		var self = this;
		$(document).bind($.aikaApi.tools.hash('vk-counter-ready-' + this.idx), function(e, idx, number) {
			self._deferred.resolve(number);
		});
		this.initCheck();
	};

	/***
	 * Используется для проверки счетчика. Устанавливает счетчик для кнопки,
	 * безопасно устраняет конфликты с другими плагинами,
	 * которые используют такуюже технологию получения счетчика.
	 */
	button.initCheck = function() {
		var self = this;

		self.rewriteVkMethod();

		self.getShareCounterScripts(
			function() {
				clearInterval(checkConflict);
			}
		);

		var checkConflict = setInterval(
			function() {
				self.rewriteVkMethod();
			}, 50
		);
	};

	/***
	 * Перезаписывает стандартный объект VK.Share, чтобы не было конфликтов
	 * с другими плагинами.
	 * @returns void
	 */
	button.rewriteVkMethod = function() {
		var self = this;

		if( !window.VK ) {
			window.VK = {};
		}
		if( !window.VK.Share ) {
			window.VK.Share = {};
		}

		if( window.VK.Share.count === self.getCounterByVkMethod ) {
			return;
		}

		if( window.VK.Share.count ) {
			window.__onp_wdgt_vk_share_couter_callbacks[this.idx] = window.VK.Share.count;
		}

		window.VK.Share.count = self.getCounterByVkMethod;
	};

	/**
	 * Вызывает тригер установки счетчика, с помощью метода вконтакте.
	 * Если индекс счетчика меньше 100, значит этот метод не наш, просто вызываем его,
	 * чтобы не сломать чужое приложение.
	 * @param idx
	 * @param number
	 */
	button.getCounterByVkMethod = function(idx, number) {
		if( idx > 100 ) {
			$(document).trigger($.aikaApi.tools.hash('vk-counter-ready-' + idx), [idx, number]);
		} else {
			window.__onp_wdgt_vk_share_couter_callbacks[this.idx] && window.__onp_wdgt_vk_share_couter_callbacks[this.idx](idx, number);
		}
	};

	button.getIcon = function() {
		return '<svg class="plusonet-svg generator-elem-active" viewBox="-150 160.9 535 535">' +
			'<path d="M-44.8,213.9h188.5c62,0,114.8,30.4,114.7,91.8c0,51.3-18.6,71.2-56.8,93.8c3.3,2.7,25.1,9.2,32.5,12.8  c11.8,5.8,18.7,11.7,26.4,19.5c21.6,22,25.7,42.1,25.7,76.7c0,80.1-77.5,120.4-152.1,120.4H-45.6L-44.8,213.9L-44.8,213.9z   M57.6,322.9l0,53.9c48.5,0,94.2,6.4,94.2-46.2c0-48.7-51.6-40.7-94.2-40.7L57.6,322.9L57.6,322.9z M57.6,552.5  c53.2,0,118.9,8.8,120.1-51.6c1.2-63-67.5-51.6-120-51.6L57.6,552.5z" class=""></path>' +
			'</svg>';

	};

	/***
	 * Создает кнопку, счетчик и контейнеры
	 * @param $holder
	 */
	button.renderButton = function($holder) {

		if( this.buttonType !== 'iframe' ) {
			this.renderCustomButton($holder);
			return;
		}

		this.button = $("<div></div>").appendTo($holder);
		this.button.attr('id', this.uq(this.name + '-' + 'widget-id') + Math.floor((Math.random() * 999999) + 1));

		this.createIframeButton(this.button, button.name, {
			pageTitle: this.options.pageTitle,
			pageDescription: this.options.pageDescription,
			pageUrl: this.url,
			pageImage: this.options.pageImage,
			pageId: this.options.pageId,
			layout: this.layout,
			counter: this.counter,
			lang: this.lang
		});
	};

	$.aikaCore.addPluginObject('aikaSocialButtons', 'buttons', button.name, button);

})(jQuery);