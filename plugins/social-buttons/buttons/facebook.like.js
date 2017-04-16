/**
 * Facebook Like Button
 * Copyright 2017, Alex Kovalevv <alex.kovalevv@gmail.com>, http://sociallocker.ru

 * @!obfuscator:false
 * @!preprocess:false
 * @!priority:50
 * @!uglify:true
 * @!lang:[]
 * @!build:['premium', 'full-premium']
 */
(function($) {
	'use strict';

	var button = $.aikaCore.extendPluginClass('aikaSocialButtons', ['control', 'iframe-buttons-loader']);

	button.name = "facebook-like";

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'like',
		// Тип кнопки
		buttonType: 'iframe',
		// Url которым нужно поделиться
		url: null
	};

	button.prepareOptions = function() {
		// Кнопка не может иметь друкой тип.
		this.buttonType = 'iframe';
	};

	/**
	 * Renders the button.
	 */
	button.renderButton = function($holder) {
		var self = this;
		this.button = $("<div></div>").appendTo($holder);
		this.button.attr('id', this.uq(this.name + '-' + 'widget-id') + Math.floor((Math.random() * 999999) + 1));

		this.createIframeButton(this.button, button.name, {
			href: this.url,
			counter: this.options.counter,
			//layout: this.layout,
			lang: this.lang
		});
	};

	$.aikaCore.addPluginObject('aikaSocialButtons', 'buttons', button.name, button);

})(jQuery);
