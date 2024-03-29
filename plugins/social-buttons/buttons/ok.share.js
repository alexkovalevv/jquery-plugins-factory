/**
 * Кнопка одноклассники поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	if( !window.__onp_wdgt_ok_share_couter_callbacks ) {
		window.__onp_wdgt_ok_share_couter_callbacks = {};
	}

	var button = $.wbcrCore.extendPluginClass('wcSocialButtons', ['control', 'iframe-buttons-loader']);

	button.name = 'ok-share';

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'Поделиться',
		// Тип кнопки (iframe, custom)
		buttonType: 'custom',
		// Url всплывающего окна
		counterUrl: '//connect.ok.ru/dk?st.cmd=extLike&ref={pageUrl}&uid={index}',
		// Url для получения счетчика
		popupUrl: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={pageUrl}',
		// Ширина всплывающего окна
		popupWidth: 580,
		// Высота всплывающего окна
		popupHeight: 336
	};

	button.prepareOptions = function() {
		this.index = parseInt(this.index) + 100;
	};

	button.counterInit = function() {
		var self = this;
		$(document).bind($.wbcrApi.tools.hash('ok-counter-ready-' + this.index), function(e, index, number) {
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

		if( !window.ODKL ) {
			window.ODKL = {};
		}

		if( window.ODKL.updateCount === self.getCounterByVkMethod ) {
			return;
		}

		if( window.ODKL.updateCount ) {
			window.__onp_wdgt_ok_share_couter_callbacks[this.index] = window.ODKL.updateCount;
		}

		window.ODKL.updateCount = self.getCounterByVkMethod;
	};

	/**
	 * Вызывает тригер установки счетчика, с помощью метода вконтакте.
	 * Если индекс счетчика меньше 100, значит этот метод не наш, просто вызываем его,
	 * чтобы не сломать чужое приложение.
	 * @param index
	 * @param number
	 */
	button.getCounterByVkMethod = function(index, number) {
		if( index > 100 ) {
			$(document).trigger($.wbcrApi.tools.hash('ok-counter-ready-' + index), [index, number]);
		} else {
			window.__onp_wdgt_ok_share_couter_callbacks[index] && window.__onp_wdgt_ok_share_couter_callbacks[index](index, number);
		}
	};

	button.getIcon = function() {
		return '<svg class="plusonet-svg generator-elem-active" viewBox="-8 -80.1 579 1000">' +
			'<path d="M281.6-80.1C139.3-80.1,23.5,35.7,23.5,178c0,142.3,115.8,258,258.1,258c142.3,0,258.1-115.7,258.1-258  C539.7,35.7,424-80.1,281.6-80.1z M281.6,71.1c58.9,0,106.8,48,106.8,106.9c0,58.9-47.9,106.8-106.8,106.8  c-58.9,0-106.9-47.9-106.9-106.8C174.8,119.1,222.7,71.1,281.6,71.1z M68.8,444.8c-25.5-0.4-50.7,12.2-65.2,35.4  c-22.3,35.4-11.6,82,23.7,104.3c46.7,29.3,97.3,50.1,149.8,62L32.9,790.8c-29.5,29.5-29.5,77.4,0,106.9  c14.8,14.7,34.1,22.1,53.5,22.1c19.3,0,38.7-7.4,53.5-22.2L281.6,756l141.8,141.8c29.5,29.5,77.3,29.5,106.9,0  c29.5-29.5,29.5-77.4,0-106.9L386,646.5c52.5-12,103.2-32.8,149.8-62.1c35.4-22.2,46-69,23.8-104.3c-22.3-35.4-68.9-46-104.3-23.8  c-105.7,66.5-241.8,66.4-347.5,0C95.7,448.8,82.2,445,68.8,444.8L68.8,444.8z" class=""></path>' +
			'</svg>';

	};

	$.wbcrCore.addPluginObject('wcSocialButtons', 'buttons', button.name, button);

})(jQuery);