/**
 * Подключение инъекции социального замка
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 06.11.2016
 * @version 1.0
 */


(function($) {
	'use strict';
	$.wbcrCore.registerPluginInjection('wbcrLocker', 'sociallocker', {

		_injectionName: 'sociallocker',

		init: function() {
			var self = this;

			//this.getModule('socialbuttons').init();

			console.log('start injection with plugin id ' + this.pluginId);

			this._registerHooks();

			var buttonsContanier = $('<div style="margin-left:50px">Поддержите наш канал и наши сообщества, нажмите на одну из кнопок, чтобы посмотреть видео. Мы рады любой помощи, даже столь незначительной как подписка или лайк, благодаря вам мы развиваемся и продолжаем радовать людей различными новинками.</div>');

			$(this.element).wbcrMagicBox({
				id: self.pluginId,
				//useInjections: ['socialbuttons', 'custom-forms'],
				content: buttonsContanier
			});

			$(buttonsContanier).wcSocialButtons({
				order: ['tumblr-share', 'google-share', 'pinterest-share', 'vkontakte-share']
			});

			/*link.click(function(e) {
			 self.runHook('plugin-magicbox-hide', [self._injectionName]);
			 });*/

		},

		_registerHooks: function() {
			var self = this;

			this.addHook('plugin-locker-lock', function() {
				self.runHook('plugin-magicbox-show', [self._injectionName]);

			});

			this.addHook('plugin-locker-unlock', function() {
				self.runHook('plugin-magicbox-hide', [self._injectionName]);
			});

			/*this.addHook('init', function() {
			 console.log('Plugin ' + self.pluginId + 'init, injection start proccess');
			 });

			 this.addHook('magicbox-init', function() {
			 console.log('magicbox-init ' + self.pluginId);
			 });

			 this.addHook('before-show-magicbox', function() {
			 console.log('before-show-magicbox');
			 });
			 this.addHook('hide-magicbox', function(content, sender) {
			 console.log('injection ' + self.pluginId + ' trace hide-magicbox');
			 //self._hideMagicBox(sender, content);
			 //self.runHook('magic-box-hide');
			 });*/

		}
	});
})(jQuery);