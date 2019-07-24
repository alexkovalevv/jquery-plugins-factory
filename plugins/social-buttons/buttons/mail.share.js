/**
 * Кнопка мой мир поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var button = $.wbcrCore.extendPluginClass('wcSocialButtons', ['control', 'iframe-buttons-loader']);

	button.name = 'mail-share';

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'Поделиться',
		// Тип кнопки (iframe, custom)
		buttonType: 'custom',
		// Url всплывающего окна
		counterUrl: '//connect.mail.ru/share_count?url_list={pageUrl}&callback=1&func=?',
		// Url для получения счетчика
		popupUrl: 'https://connect.mail.ru/share?share_url={pageUrl}&title={pageTitle}&description={pageDescription}&image_url={pageImage}',
		// Ширина всплывающего окна
		popupWidth: 492,
		// Высота всплывающего окна
		popupHeight: 500
	};

	button.convertNumber = function(data) {
		for( var url in data ) {
			if( data.hasOwnProperty(url) ) {
				return data[url].shares;
			}
		}
	};

	button.counterInit = function() {
		this.getShareCounterJson();
	};

	button.getIcon = function() {
		return '<svg class="plusonet-svg generator-elem-active" viewBox="0 0 96.311 100.241">' +
			'<path d="M93.136,24.456c-2.116-4.937-5.129-9.22-9.038-12.848c-3.91-3.628-8.616-6.469-14.117-8.525   C64.479,1.028,58.322,0,51.511,0c-4.918,0-9.604,0.615-14.057,1.844C33,3.074,28.869,4.817,25.06,7.074   c-3.809,2.258-7.265,4.988-10.369,8.192c-3.104,3.204-5.744,6.782-7.92,10.731c-2.177,3.951-3.85,8.233-5.018,12.847   C0.584,43.461,0,48.287,0,53.325c0,7.337,1.199,13.906,3.597,19.71c2.397,5.804,5.865,10.722,10.399,14.752   c4.534,4.03,10.056,7.113,16.566,9.25c6.509,2.135,13.895,3.204,22.158,3.204c4.716,0,9.039-0.354,12.968-1.058   c3.93-0.705,7.789-1.865,11.578-3.476l-3.083-7.436c-3.023,1.289-6.309,2.267-9.855,2.932c-3.547,0.665-7.457,0.998-11.729,0.998   c-6.933,0-13.13-0.867-18.591-2.6c-5.462-1.734-10.087-4.263-13.875-7.588c-3.789-3.325-6.691-7.395-8.706-12.212   c-2.016-4.816-3.023-10.308-3.023-16.475c0-6.327,1.067-12.232,3.204-17.714c2.136-5.481,5.109-10.257,8.918-14.329   c3.809-4.07,8.353-7.275,13.633-9.613c5.28-2.337,11.064-3.507,17.352-3.507c5.239,0,10.086,0.816,14.54,2.448   c4.453,1.632,8.283,3.89,11.487,6.771c3.204,2.882,5.714,6.298,7.528,10.248c1.814,3.951,2.721,8.263,2.721,12.938   c0,4.474-0.535,8.494-1.603,12.061c-1.068,3.567-2.509,6.581-4.322,9.039c-1.814,2.459-3.93,4.344-6.348,5.653   c-2.418,1.31-4.978,1.965-7.678,1.965c-1.17,0-2.016-0.322-2.539-0.967c-0.524-0.644-0.786-1.551-0.786-2.721   c0-0.927,0.13-2.045,0.393-3.355c0.262-1.309,0.574-3.028,0.937-4.761l7.799-34.9h-9.613l-1.149,5.155   c-1.935-2.095-4.132-3.59-6.59-4.678c-2.459-1.088-5.341-1.583-8.646-1.583c-3.748,0-7.296,0.912-10.641,2.685   c-3.346,1.774-6.278,4.235-8.797,7.358c-2.52,3.124-4.504,6.829-5.955,11.1c-1.451,4.273-2.177,8.911-2.177,13.909   c0,3.386,0.463,6.401,1.391,9.04c0.927,2.64,2.216,4.878,3.869,6.712c1.652,1.835,3.637,3.226,5.955,4.172   c2.317,0.948,4.846,1.421,7.587,1.421c3.224,0,6.288-0.745,9.19-2.237c2.902-1.49,5.502-3.607,7.799-6.348   c0.121,1.209,0.463,2.338,1.028,3.386c0.564,1.049,1.32,1.956,2.267,2.721c0.946,0.766,2.045,1.371,3.295,1.814   c1.249,0.444,2.6,0.665,4.051,0.665c4.272,0,8.232-0.846,11.88-2.539c3.648-1.693,6.802-4.141,9.462-7.346   c2.66-3.204,4.735-7.124,6.227-11.759c1.491-4.634,2.237-9.894,2.237-15.78C96.311,34.724,95.252,29.394,93.136,24.456z    M56.831,53.325c-0.565,2.459-1.371,4.666-2.418,6.62c-1.049,1.956-2.267,3.628-3.658,5.018c-1.391,1.391-2.932,2.459-4.625,3.204   c-1.693,0.746-3.446,1.118-5.26,1.118c-6.933,0-10.399-4.373-10.399-13.12c0-3.587,0.473-6.972,1.421-10.157   c0.946-3.183,2.207-5.964,3.779-8.343c1.572-2.378,3.395-4.262,5.471-5.653c2.075-1.39,4.241-2.086,6.499-2.086   c3.062,0,5.662,0.565,7.799,1.693c2.136,1.129,3.909,2.5,5.32,4.111L56.831,53.325z" class=""></path>' +
			'</svg>';

	};

	$.wbcrCore.addPluginObject('wcSocialButtons', 'buttons', button.name, button);

})(jQuery);