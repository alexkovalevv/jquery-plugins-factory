/**
 * Кнопка google поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var button = $.wbcrCore.extendPluginClass('wcSocialButtons', 'control');

	button.name = 'google-share';

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'Поделиться',
		// Тип кнопки (iframe, custom)
		buttonType: 'custom',
		// Url всплывающего окна
		counterUrl: '//share.yandex.ru/gpp.xml?url={pageUrl}&callback=?',
		// Url для получения счетчика
		popupUrl: 'https://plus.google.com/share?url={pageUrl}',
		// Ширина всплывающего окна
		popupWidth: 500,
		// Высота всплывающего окна
		popupHeight: 550
	};

	button.convertNumber = function(number) {
		return parseInt(number.replace(/\D/g, ''), 10);
	};

	button.counterInit = function() {
		this.getShareCounterJson();
	};

	button.getIcon = function() {
		return '<svg viewBox="0 0 35 35">' +
			'<path d="M19.81,0.76c0,0-6.997,0-9.393,0c-4.297,0-8.343,3.016-8.343,6.786c0,3.852,2.929,6.848,7.301,6.848    c0.305,0,0.6-0.069,0.89-0.09c-0.286,0.541-0.485,1.123-0.485,1.758c0,1.071,0.574,1.926,1.301,2.635    c-0.546,0-1.08,0.008-1.661,0.008C4.098,18.706,0,22.094,0,25.609c0,3.462,4.492,5.63,9.815,5.63c6.069,0,9.422-3.447,9.422-6.909    c0-2.775-0.82-4.439-3.351-6.234c-0.867-0.611-2.523-2.103-2.523-2.981c0-1.027,0.293-1.533,1.841-2.743    c1.583-1.237,2.706-2.714,2.706-4.741c0-2.409-1.036-5.349-3.052-5.349h3.429L19.81,0.76z M16.657,23.73    c0.073,0.323,0.117,0.654,0.117,0.989c0,2.798-1.806,4.984-6.979,4.984c-3.68,0-6.336-2.328-6.336-5.126    c0-2.741,3.296-5.026,6.978-4.984c0.856,0.009,1.658,0.148,2.383,0.379C14.818,21.364,16.25,22.149,16.657,23.73z M10.763,13.294    c-2.47-0.072-4.818-2.763-5.243-6.004c-0.425-3.246,1.231-5.728,3.7-5.655c2.469,0.076,4.818,2.679,5.243,5.922    C14.889,10.799,13.233,13.367,10.763,13.294z"></path><polygon points="27.429,12.94 27.429,8.369 24.381,8.369 24.381,12.94 19.81,12.94 19.81,15.988 24.381,15.988 24.381,20.559 27.429,20.559 27.429,15.988 32,15.988 32,12.94"></polygon>' +
			'</svg>';
	};

	$.wbcrCore.addPluginObject('wcSocialButtons', 'buttons', button.name, button);

})(jQuery);