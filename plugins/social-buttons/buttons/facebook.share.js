/**
 * Кнопка facebook поделиться
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	var button = $.aikaCore.extendPluginClass('aikaSocialButtons', ['control', 'iframe-buttons-loader']);

	button.name = 'facebook-share';

	button._defaults = {
		// Заголовок кнопки (только для шкафчиков или произвольных кнопок)
		title: 'Поделиться',
		// Тип кнопки (iframe, custom)
		// по умолчанию iframe
		buttonType: 'iframe',
		// Url которым нужно поделиться
		url: null,
		// if set, then use the Share Dialog
		shareDialog: false,
		counterUrl: 'http://graph.facebook.com/{url}',
		popupUrl: '//www.facebook.com/sharer/sharer.php?u={url}',
		popupWidth: 600,
		popupHeight: 359
	};

	button.convertNumber = function(data) {
		if( !data['share'] ) {
			return null;
		}
		return data['share']['share_count'];
	};

	button.counterInit = function() {
		this.getShareCounterJson();
	};

	button.getIcon = function() {
		return '<svg class="aika-sbtns-facebook-svg" viewBox="-250 0 1000 1000">' +
			'<path d="M124.074 1000v-469.229h-124.074v-168.945h124.074v-144.301c0 -113.393 73.291 -217.525 242.169 -217.525 68.376 0 118.937 6.555 118.937 6.555l-3.984 157.766s-51.564 -.502 -107.833 -.502c-60.9 0 -70.657 28.065 -70.657 74.646v123.361h183.331l-7.977 168.945h-175.354v469.229h-178.632"/></svg>';
	};

	button.renderButton = function($holder) {
		if( this.buttonType !== 'iframe' ) {
			this.renderCustomButton($holder);
			return;
		}

		this.button = $("<div></div>").appendTo($holder);
		this.button.attr('id', this.uq(this.name + '-' + 'widget-id') + Math.floor((Math.random() * 999999) + 1));

		this.createIframeButton(this.button, button.name, {
			url: this.url,
			counter: this.counter,
			lang: this.lang,
			shareDialog: this.options.shareDialog
			//layout: this.groupOptions.layout,
		});
	};

	$.aikaCore.addPluginObject('aikaSocialButtons', 'buttons', button.name, button);

})(jQuery);