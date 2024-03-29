/**
 * Кнопка twitter поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var button = $.wbcrCore.extendPluginClass('wcSocialButtons', 'control');

	button.name = "twitter-tweet";

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'Поделиться',
		// Тип кнопки (iframe, custom)
		buttonType: 'custom',
		// От кого публикуем твит
		via: 'sociallocker',
		// Хештеги
		hashtags: null,
		// Url всплывающего окна
		popupUrl: 'https://twitter.com/intent/tweet?via={via}&text={pageDescription}&url={pageUrl}&hashtags={hashtags}',
		// Ширина всплывающего окна
		popupWidth: 740,
		// Высота всплывающего окна
		popupHeight: 550
	};

	button.prepareOptions = function() {
		// Отключаем счетчик для этой кнопки
		this.availableCounter = false;
		this.via = this.options.via;
		this.hashtags = this.options.hashtags;
	};

	// Извлекает url страницы
	button._extractPageUrl = function() {
		if( !this.options.pageUrl && $("link[rel='canonical']").length > 0 ) {
			return $.wbcrApi.tools.URL.normalize($("link[rel='canonical']").attr('href'));
		}
		return $.wbcrApi.tools.URL.normalize(this.options.pageUrl || window.location.href);
	};

	// Извлекает заголовок страницы
	// Обрабатывается внутри кнопки
	button._extractPageDescription = function() {
		var $title = $("title");

		var description;
		if( $title.length > 0 ) {
			description = $($title[0]).text();
		} else {
			description = "";
		}

		return description;
	};

	button.getIcon = function() {
		return '<svg version="1.1" id="Layer_1" x="0px" y="0px"' +
			'width="39.359px" height="39.359px" viewBox="0 0 39.359 39.359" xml:space="preserve">' +
			'<path d="M-5.18,35.087c0.801,0.078,1.601,0.119,2.4,0.119c4.693,0,8.881-1.44,12.56-4.318c-2.185-0.027-4.146-0.695-5.879-2.002' +
			'c-1.735-1.306-2.92-2.973-3.561-5.001c0.533,0.109,1.161,0.161,1.88,0.161c0.934,0,1.827-0.121,2.68-0.36' +
			'c-2.346-0.451-4.287-1.606-5.82-3.459c-1.534-1.855-2.3-3.995-2.3-6.421v-0.121c1.414,0.801,2.945,1.215,4.599,1.24' +
			'c-1.385-0.907-2.486-2.099-3.299-3.58C-2.733,9.866-3.14,8.26-3.14,6.527c0-1.814,0.468-3.506,1.4-5.081' +
			'c2.506,3.12,5.567,5.607,9.181,7.461c3.613,1.852,7.485,2.885,11.62,3.1c-0.187-0.88-0.281-1.654-0.281-2.32' +
			'c0-2.774,0.987-5.147,2.96-7.12c1.974-1.973,4.359-2.96,7.161-2.96c2.905,0,5.358,1.067,7.359,3.201' +
			'c2.319-0.481,4.453-1.308,6.4-2.48c-0.747,2.426-2.215,4.293-4.4,5.6c1.947-0.239,3.867-0.773,5.76-1.6' +
			'c-1.28,2-2.947,3.747-5.001,5.239v1.322c0,2.69-0.394,5.391-1.18,8.099c-0.785,2.707-1.987,5.293-3.6,7.762' +
			'c-1.614,2.465-3.54,4.66-5.78,6.578c-2.239,1.92-4.926,3.448-8.06,4.581c-3.133,1.134-6.5,1.698-10.101,1.698' +
			'C4.726,39.606-0.434,38.1-5.18,35.087z"/>' +
			'</svg>';
	};

	$.wbcrCore.addPluginObject('wcSocialButtons', 'buttons', button.name, button);

})(jQuery);