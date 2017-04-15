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

	if( !$.pandalocker.data ) {
		$.pandalocker.data = {};
	}
	$.pandalocker.data.__facebookLikeButton = null;

	var button = $.pandalocker.tools.extend($.pandalocker.entity.socialButton);

	button.name = "facebook-like";

	button.sdk = 'onp';
	button.verification.container = '.onp-button-loaded';

	button._defaults = {

		// URL to like/share
		url: null,

		// Tooltip Text (to confirm like)
		tooltipText: $.pandalocker.lang.errors.facebookLikeAlertText,

		// Button layout, available: standart, button_count, box_count.
		// By default 'standard'.
		layout: 'button_count'
	};

	button.prepareOptions = function() {
		this.url = this._extractUrl();

		this.options.counter = "vertical" === this.groupOptions.layout ? true : this.groupOptions.counters;
	};

	button.setupEvents = function() {
	};

	button._extendCallback = function(data) {
		var self = this;

		if( data.event === 'liked' ) {
			if( this.url !== $.pandalocker.tools.URL.normalize(data.url) ) {
				return;
			}

			this.unlock("button", this.name, this.url, data.other_info);
		}

		if( data.event === 'unliked' ) {
			this.showNotice($.pandalocker.lang.alerts.social_unshare);
		}
	};

	/**
	 * Renders the button.
	 */
	button.renderButton = function($holder) {
		var self = this;
		this.button = $("<div></div>").appendTo($holder);
		this.widgetId = "onp-fb-like-widget-id" + Math.floor((Math.random() * 999999) + 1);
		this.button.attr('id', this.widgetId);

		if( !window.ONPWGT ) {
			return;
		}

		window.ONPWGT.init(this.widgetId, 'facebook-like', {
			href: this.url,
			counter: this.options.counter,
			layout: this.groupOptions.layout,
			lang: this.groupOptions.lang
		}, function(data) {
			self._callback(data);
		});
	};

	$.pandalocker.controls["social-buttons"]["facebook-like"] = button;

})(__$onp);
