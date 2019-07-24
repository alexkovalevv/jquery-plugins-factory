/**
 * Vkontakte like
 * Copyright 2017, Alex Kovalev, http://bizpanda.ru
 *
 * @!obfuscator:false
 * @!preprocess:false
 * @!priority:50
 * @!uglify:true
 * @!lang:[]
 * @!build:['free', 'premium', 'full-free', 'full-premium']
 */
(function($) {
	'use strict';

	var button = $.wbcrCore.extendPluginClass('wcSocialButtons', ['control', 'iframe-buttons-loader']);

	button.name = "vk-like";

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'like',
		// Тип кнопки
		buttonType: 'iframe',
		// Id страницы, необходимо задавать если url страницы не изменяется.
		pageId: null,
		// Обязательно делиться с друзьями, если true
		requireSharing: 1
	};

	button.prepareOptions = function() {
		// Кнопка не может иметь друкой тип.
		this.buttonType = 'iframe';
	};

	// Вконтакте не любит киррилические домены, поэтому мы преобразуем url перед тем, как его использовать.
	button._extractUrl = function() {
		var URL = this.options.pageUrl || window.location.href;

		if( $.wbcrApi.tools.checkDomainType(URL) == 'cyrillic' ) {
			var arrUrlParts = URL.split("/");
			URL = arrUrlParts[0] + '//' + $.wbcrApi.punycode.toASCII($.wbcrApi.tools.normalizecyrillicDomain(arrUrlParts[2]));
		}
		return $.wbcrApi.tools.URL.normalize(URL);
	};

	button.renderButton = function($holder) {
		this.button = $("<div></div>").appendTo($holder);
		this.button.attr('id', this.uq(this.name + '-' + 'widget-id') + Math.floor((Math.random() * 999999) + 1));

		this.createIframeButton(this.button, button.name, {
			pageTitle: this.pageTitle,
			pageDescription: this.pageDescription,
			pageUrl: this.pageUrl,
			pageImage: this.pageImage,
			pageId: this.options.pageId,
			lang: this.lang,
			layout: this.layout,
			counter: this.counter,
			requireSharing: this.options.requireSharing
		});
	};

	$.wbcrCore.addPluginObject('wcSocialButtons', 'buttons', button.name, button);

})(jQuery);