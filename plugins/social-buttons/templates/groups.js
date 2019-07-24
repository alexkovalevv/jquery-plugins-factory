/**
 * Шаблоны групп
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 23.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	$.wbcrPluginSocialButtons.groupThemes['default'] = function() {
	    return '<div class="{groupContanierClasses}">' +
			        '<ul class="{buttonsContanierClassess}">{buttons}</ul>'+
			        '<div class="{groupCounterClasses}">{groupCounter}</div>'+
		       '</div>'
	};
})(jQuery);
