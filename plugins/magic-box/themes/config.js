/*
 * Themes Presets
 * Copyright 2016, OnePress, http://byonepress.com
 * 
 * @since 1.0.0
 * @pacakge core
 */
(function($) {

	// Theme: Great Attractor

	$.wbcrMagicBox.themes['great-attractor'] = {};

	// Theme: Friendly Giant

	$.wbcrMagicBox.themes['friendly-giant'] = {

		theme: {
			fonts: [
				{
					name: 'Open Sans',
					styles: ['400', '700']
				}
			]
		}
	};

	// Theme: Dark Force

	$.wbcrMagicBox.themes['dark-force'] = {

		theme: {
			fonts: [
				{
					name: 'Montserrat',
					styles: ['400', '700']
				}
			]
		}
	};

	// Theme: Starter

	$.wbcrMagicBox.themes['starter'] = {

		socialButtons: {
			layout: 'horizontal',
			counter: true,
			flip: false
		}
	};

	// Theme: Secrets

	$.wbcrMagicBox.themes['secrets'] = {

		socialButtons: {
			layout: 'horizontal',
			counter: true,
			flip: true
		}
	};

	// Theme: Dandyish

	$.wbcrMagicBox.themes['dandyish'] = {

		socialButtons: {
			unsupported: ['twitter-follow'],
			layout: 'vertical',
			counter: true,
			flip: false
		}
	};

	// Theme: Glass

	$.wbcrMagicBox.themes['glass'] = {

		socialButtons: {
			layout: 'horizontal',
			counter: true,
			flip: false
		}
	};

	// Theme: Flat

	$.wbcrMagicBox.themes['flat'] = {

		socialButtons: {
			layout: 'horizontal',
			counter: true,
			flip: true
		}
	};

})(jQuery);