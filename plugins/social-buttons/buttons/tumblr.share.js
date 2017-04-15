/**
 * Кнопка twitter поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var button = $.aikaApi.tools.extend($.aikaPluginSocialButtons.control);

	button.name = 'tumblr-share';

	button._defaults = {
		counterUrl: '//api.tumblr.com/v2/share/stats?url={url}&callback=?',
		popupUrl: 'http://tumblr.com/widgets/share/tool?canonicalUrl={url}',
		popupWidth: 600,
		popupHeight: 359
	};

	button.convertNumber = function(data) {
		return data.response.note_count;
	};

	button.counterInit = function() {
		this.getShareCounterJson();
	};

	$.aikaPluginSocialButtons.buttons["tumblr-share"] = button;

})(jQuery);