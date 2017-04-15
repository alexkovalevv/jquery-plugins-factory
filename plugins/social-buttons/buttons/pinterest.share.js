/**
 * Кнопка pinterest поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var button = $.aikaApi.tools.extend($.aikaPluginSocialButtons.control);

	button.name = 'pinterest-share';

	button._defaults = {
		counterUrl: '//api.pinterest.com/v1/urls/count.json?url={url}&callback=?',
		popupUrl: 'https://pinterest.com/pin/create/button/?url={url}&description={title}',
		popupWidth: 740,
		popupHeight: 550
	};

	button.convertNumber = function(data) {
		return data.count;
	};

	button.counterInit = function() {
		this.getShareCounterJson();
	};

	button.getIcon = function() {
		return '<svg viewBox="0 0 110.001 110.001" style="enable-background:new 0 0 100.001 100.001;" xml:space="preserve">' +
			'<path d="M43.081,66.14c-2.626,13.767-5.833,26.966-15.333,33.861c-2.932-20.809,4.307-36.436,7.668-53.027   c-5.73-9.646,0.689-29.062,12.777-24.277c14.873,5.885-12.881,35.865,5.75,39.611c19.453,3.908,27.395-33.752,15.332-46   C51.847-1.376,18.542,15.905,22.638,41.224c0.996,6.191,7.391,8.068,2.555,16.611c-11.154-2.473-14.484-11.27-14.055-23   c0.69-19.197,17.25-32.639,33.86-34.498c21.006-2.352,40.721,7.711,43.443,27.471c3.066,22.303-9.48,46.459-31.943,44.721   C50.41,72.056,47.853,69.04,43.081,66.14z" fill="#FFFFFF"/>' +
			'</svg>';

	};

	$.aikaPluginSocialButtons.buttons["pinterest-share"] = button;

})(jQuery);