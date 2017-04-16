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

	var button = $.aikaCore.extendPluginClass('aikaSocialButtons', ['control', 'iframe-buttons-loader']);

	button.name = "vk-like";

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'like',
		// Тип кнопки
		buttonType: 'iframe',
		// Заголовок записи на стене
		pageTitle: null,
		// Описание записи на стене
		pageDescription: null,
		// Url записи на стене
		pageUrl: null,
		// Изображение записи на стене
		pageImage: null,
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
		var URL = this.options.url || window.location.href;

		if( $.aikaApi.tools.checkDomainType(URL) == 'cyrillic' ) {
			var arrUrlParts = URL.split("/");
			URL = arrUrlParts[0] + '//' + $.aikaApi.punycode.toASCII($.aikaApi.tools.normalizecyrillicDomain(arrUrlParts[2]));
		}
		return $.aikaApi.tools.URL.normalize(URL);
	};

	button.renderButton = function($holder) {
		this.button = $("<div></div>").appendTo($holder);
		this.button.attr('id', this.uq(this.name + '-' + 'widget-id') + Math.floor((Math.random() * 999999) + 1));

		this.createIframeButton(this.button, button.name, {
			pageTitle: this.options.pageTitle,
			pageDescription: this.options.pageDescription,
			pageUrl: this.url,
			pageImage: this.options.pageImage,
			pageId: this.options.pageId,
			lang: this.lang,
			layout: this.layout,
			counter: this.counter,
			requireSharing: this.options.requireSharing
		});
	};

	$.aikaCore.addPluginObject('aikaSocialButtons', 'buttons', button.name, button);

})(jQuery);