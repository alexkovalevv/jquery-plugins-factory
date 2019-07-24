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

	var button = $.wbcrCore.extendPluginClass('wcSocialButtons', ['control', 'iframe-buttons-loader']);

	button.name = "facebook-like";

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'like',
		// Тип кнопки
		buttonType: 'iframe'
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
			href: this.pageUrl,
			counter: this.options.counter,
			lang: this.lang
		});
	};

	$.wbcrCore.addPluginObject('wcSocialButtons', 'buttons', button.name, button);

})(jQuery);
