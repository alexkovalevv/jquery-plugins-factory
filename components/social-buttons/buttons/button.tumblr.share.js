/**
 * Кнопка twitter поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var button = $.aikaCore.tools.extend($.aikaComponent.sbtns.control);

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

	button.getIcon = function() {
		return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-250 0 1000 1000">' +
			'<path d="M345.603 0v252.756h237.3v156.983h-237.3v256.442c0 57.96 3.061 95.177 9.218 111.653 6.122 16.446 17.571 29.584 34.251 39.414 22.126 13.261 47.413 19.907 75.914 19.907 50.608 0 100.978 -16.476 151.073 -49.398v157.713c-42.746 20.124 -81.441 34.283 -116.056 42.382 -34.653 8.099 -72.119 12.149 -112.384 12.149 -45.694 0 -86.108 -5.782 -121.238 -17.312 -35.128 -11.561 -65.082 -28.037 -89.897 -49.366 -24.817 -21.392 -42.016 -44.111 -51.587 -68.192 -9.583 -24.051 -14.374 -58.949 -14.374 -104.639v-350.753h-110.523v-141.515c39.276 -12.766 72.958 -31.048 100.94 -54.899 28.025 -23.815 50.493 -52.44 67.432 -85.855 16.963 -33.385 28.625 -75.89 34.998 -127.469h142.232"/>' +
			'</svg>';
	};

	$.aikaComponent.sbtns.buttons["tumblr-share"] = button;

})(jQuery);