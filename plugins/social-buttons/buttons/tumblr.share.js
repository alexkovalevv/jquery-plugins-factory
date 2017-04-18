/**
 * Кнопка twitter поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var button = $.aikaCore.extendPluginClass('aikaSocialButtons', 'control');

	button.name = 'tumblr-share';

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'Поделиться',
		// Тип кнопки (iframe, custom)
		buttonType: 'custom',
		// Url записи на стене
		url: null,
		// Url всплывающего окна
		counterUrl: '//api.tumblr.com/v2/share/stats?url={pageUrl}&callback=?',
		// Url для получения счетчика
		popupUrl: 'http://tumblr.com/widgets/share/tool?canonicalUrl={pageUrl}',
		// Ширина всплывающего окна
		popupWidth: 600,
		// Высота всплывающего окна
		popupHeight: 359
	};

	button.convertNumber = function(data) {
		return data.response.note_count;
	};

	button.counterInit = function() {
		this.getShareCounterJson();
	};

	button.getIcon = function() {
		return null;
	};

	$.aikaCore.addPluginObject('aikaSocialButtons', 'buttons', button.name, button);

})(jQuery);