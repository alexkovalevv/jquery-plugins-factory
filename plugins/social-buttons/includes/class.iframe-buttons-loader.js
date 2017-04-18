/**
 * Загружает кнопки из облака
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 15.04.2017
 * @version 1.0
 */

(function($) {
	'use strict';

	var _idx = 0;
	var _callbacks = {};

	var creator = {
		createIframeButton: function($holder, buttonName, options, callback) {
			var self = this;

			if( !$holder || !buttonName ) {
				throw new Error("Параметры id и buttonName являются обязательным!");
			}

			if( !options ) {
				options = {};
			}

			options.name = buttonName;

			var widget = $('<iframe></iframe>'),
				widgetContanier = $('<div></div>'),
				widgetName = this._genWidgetName(buttonName),
				widgetSrc = '//cdn.sociallocker.ru/service/buttons/' + buttonName + '.html';

			while( _callbacks[widgetName] || $('iframe[name="' + widgetName + '"]').length ) {
				widgetName = this._genWidgetName(buttonName);
			}

			_idx += 1;

			widgetContanier.css({
				position: "relative",
				zIndex: "9",
				verticalAlign: "bottom",
				overflow: "hidden",
				display: "none"
			});

			widget.attr("id", "onpwgt" + _idx);
			widget.attr("name", widgetName);
			widget.attr("src", widgetSrc);
			widget.attr("frameborder", "0");
			widget.attr("scrolling", "no");
			widget.attr("width", "180");
			widget.attr("height", "20");
			widget.attr("wmode", "transparent");
			widget.css("position", "absolute");

			widgetContanier.append(widget);

			if( !$holder.length ) {
				return;
			}

			$(widget).on('load', function() {
				var postMessageData = {
					onpwgt_to: {
						button: options
					}
				};

				window.frames[widgetName].postMessage(JSON.stringify(postMessageData), '*');
			});

			$holder.append(widgetContanier);

			this._registerCallback(widgetName, callback);
		},

		_registerCallback: function(widgetName, callback) {
			if( _callbacks[widgetName] ) {
				return false;
			}
			_callbacks[widgetName] = function(data) {
				if( !data.iframe ) {
					return;
				}

				var el = $('iframe[name="' + data.iframe + '"]');

				if( data.event === 'resize' ) {
					el.add(el.parent()).css({
						width: data.width + "px",
						height: data.height + "px"
					});

					if( data.name === 'vk-like' ) {
						el.css({
							width: "350px",
							height: "250px",
							zIndex: "10"
						});
					}
				}

				if( data.event === 'alert' ) {
					if( data.status === 'show' ) {
						el.parent().css({
							overflow: "visible",
							zIndex: "99"
						});
					} else {
						el.parent().css({
							overflow: "hidden",
							zIndex: "10"
						});
					}
				}

				if( data.event === 'loaded' ) {
					el.parent().css("display", "inline-block");
				}

				callback && callback(data);
			};
		},

		_genWidgetName: function(buttonName) {
			return $.aikaApi.tools.hash(
					buttonName + Math.floor((Math.random() * 999999) + 1)
				) + 'ab';
		}
	};

	function onpwgt___create_button_stream(event) {
		'use strict';

		if( typeof event.data != 'string' || event.data.indexOf('onpwgt') === -1 ) {
			return;
		}

		var data = JSON.parse(event.data);

		if( !data.onpwgt.button ) {
			return;
		}

		_callbacks[data.onpwgt.button.iframe](data.onpwgt.button);
	}

	if( window.addEventListener ) {
		window.addEventListener("message", onpwgt___create_button_stream);
	} else {
		// IE8
		window.attachEvent("onmessage", onpwgt___create_button_stream);
	}

	/**
	 * Регистрируем класс для управления iframe кнопками
	 * доступен только один публичный метод createIframeButton
	 */
	$.aikaCore.registerPluginClass('aikaSocialButtons', 'iframe-buttons-loader', {
		createIframeButton: function($holder, buttonName, options) {
			// Контентекст метода class.control.js
			var self = this;
			return creator.createIframeButton($holder, buttonName, options, function(data) {
				if( data.event === 'loaded' ) {
					self.setLoadingState();
				}
				if( data.event ) {
					self.runHook('button-event-' + data.event, [self.name]);
				}
				self.iframeButtonCallback && self.iframeButtonCallback(data);
			});
		}
	});
})(jQuery);
