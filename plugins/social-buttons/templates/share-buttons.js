/**
 * Шаблон кнопки
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 23.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';

	if( !$.aikaPluginSocialButtons.buttonThemes ) {
		$.aikaPluginSocialButtons.buttonThemes = {};
	}

	$.aikaPluginSocialButtons.buttonThemes['default'] = function() {
		return '<li>' +
					'<a href="#" class=\"{classes}\" data-button-name="{buttonName}">' +
						'<span class="{pluginPrefix}-btn-bage">' +
							'<span class="{pluginPrefix}-btn-icon"></span>' +
							'<span class="{pluginPrefix}-btn-title">{title}</span>' +
						'</span>' +
						'<span class="{pluginPrefix}-btn-counter">{counter}</span>' +
					'</a>' +
				'</li>';
   };

})(jQuery);
