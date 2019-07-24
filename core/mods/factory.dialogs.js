/**
 * Диалоговые окна
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 18.04.2017
 * @version 1.0
 */
(function($) {
	'use strict';

	/*var support = {animations: Modernizr.cssanimations},
	 animEndEventNames = {
	 'WebkitAnimation': 'webkitAnimationEnd',
	 'OAnimation': 'oAnimationEnd',
	 'msAnimation': 'MSAnimationEnd',
	 'animation': 'animationend'
	 },
	 animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];

	 var onEndAnimation = function(el, callback) {
	 var onEndCallbackFn = function(ev) {
	 if( support.animations ) {
	 if( ev.target != this ) {
	 return;
	 }
	 this.removeEventListener(animEndEventName, onEndCallbackFn);
	 }
	 if( callback && typeof callback === 'function' ) {
	 callback.call();
	 }
	 };
	 if( support.animations ) {
	 el.addEventListener(animEndEventName, onEndCallbackFn);
	 }
	 else {
	 onEndCallbackFn();
	 }
	 };*/

	var dialog = {
		isOpen: false,

		init: function(element, options) {
			this.element = $(element);
			this._prepareOptions(options);

			$.data(element, 'plugin_wcFactoryDialog', this);
		},

		_prepareOptions: function(options) {
			this.options = $.extend(true, options, this.options);
		},

		dialogShow: function() {
			if( this.isOpen ) {
				return;
			}
			console.log('000');
			this.element.addClass('wbcr-dialog-open');
			console.log('111');
			if( !this.isAnimationSupport() ) {
				console.log('ddd');
				this.element.fadeIn();
			}

			this.isOpen = true;
		},

		dialogHide: function() {
			if( this.isOpen ) {
				this.element.removeClass('wbcr-dialog-open');
				this.element.addClass('wbcr-dialog-close');
			}

		},

		isAnimationSupport: function() {
			var animation = false,
				animationstring = 'animation',
				keyframeprefix = '',
				domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
				pfx = '',
				elm = document.createElement('div');

			if( elm.style.animationName !== undefined ) {
				animation = true;
			}

			if( animation === false ) {
				for( var i = 0; i < domPrefixes.length; i++ ) {
					if( elm.style[domPrefixes[i] + 'AnimationName'] !== undefined ) {
						pfx = domPrefixes[i];
						animationstring = pfx + 'Animation';
						keyframeprefix = '-' + pfx.toLowerCase() + '-';
						animation = true;
						break;
					}
				}
			}

			return animation;
		}
	};

	$.fn['wcFactoryDialog'] = function() {
		var args = arguments;
		var argsCount = arguments.length;
		var toReturn = this;
		this.each(function() {
			var widget = $.data(this, 'plugin_wcFactoryDialog');
			// a widget is not created yet
			if( !widget && argsCount <= 1 ) {
				dialog.init(this, argsCount ? args[0] : false);
			} else if( argsCount == 1 && typeof args[0] === 'string' ) {
				widget[args[0]] && widget[args[0]]();
			}
		});
		return toReturn;
	};

	/*function DialogFx(el, options) {
	 this.el = el;
	 this.options = extend({}, this.options);
	 extend(this.options, options);
	 this.ctrlClose = this.el.querySelector('[data-dialog-close]');
	 this.isOpen = false;
	 this._initEvents();
	 }

	 DialogFx.prototype.options = {
	 // callbacks
	 onOpenDialog: function() {
	 return false;
	 },
	 onCloseDialog: function() {
	 return false;
	 }
	 }*/

	/*DialogFx.prototype._initEvents = function() {
	 var self = this;

	 // close action
	 this.ctrlClose.addEventListener('click', this.toggle.bind(this));

	 // esc key closes dialog
	 document.addEventListener('keydown', function(ev) {
	 var keyCode = ev.keyCode || ev.which;
	 if( keyCode === 27 && self.isOpen ) {
	 self.toggle();
	 }
	 });

	 //this.el.querySelector( '.dialog__overlay' ).addEventListener( 'click', this.toggle.bind(this) );
	 }*/

	/*DialogFx.prototype.toggle = function() {
	 var self = this;
	 if( this.isOpen ) {
	 classie.remove(this.el, 'dialog--open');
	 classie.add(self.el, 'dialog--close');

	 onEndAnimation(this.el.querySelector('.dialog__content'), function() {
	 classie.remove(self.el, 'dialog--close');
	 });

	 // callback on close
	 this.options.onCloseDialog(this);
	 }
	 else {
	 console.log('dialog--open');
	 classie.add(this.el, 'dialog--open');

	 // callback on open
	 this.options.onOpenDialog(this);
	 }
	 this.isOpen = !this.isOpen;
	 };

	 // add to global namespace
	 window.DialogFx = DialogFx;*/

})(jQuery);