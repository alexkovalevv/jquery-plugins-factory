/*
 * Themes Presets
 * Copyright 2016, OnePress, http://byonepress.com
 * 
 * @since 1.0.0
 * @pacakge core
 */
(function($) {

	// Theme: Great Attractor

	$.aikaMagicBox.themes['great-attractor'] = {};

	// Theme: Friendly Giant

	$.aikaMagicBox.themes['friendly-giant'] = {

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

	$.aikaMagicBox.themes['dark-force'] = {

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

	$.aikaMagicBox.themes['starter'] = {

		socialButtons: {
			layout: 'horizontal',
			counter: true,
			flip: false
		}
	};

	// Theme: Secrets

	$.aikaMagicBox.themes['secrets'] = {

		socialButtons: {
			layout: 'horizontal',
			counter: true,
			flip: true
		}
	};

	// Theme: Dandyish

	$.aikaMagicBox.themes['dandyish'] = {

		socialButtons: {
			unsupported: ['twitter-follow'],
			layout: 'vertical',
			counter: true,
			flip: false
		}
	};

	// Theme: Glass

	$.aikaMagicBox.themes['glass'] = {

		socialButtons: {
			layout: 'horizontal',
			counter: true,
			flip: false
		}
	};

	// Theme: Flat

	$.aikaMagicBox.themes['flat'] = {

		socialButtons: {
			layout: 'horizontal',
			counter: true,
			flip: true
		}
	};

})(jQuery);