/**
 * Tools
 * @author Alex Kovalev <alex.kovalevv@gmail.com>
 * @copyright Alex Kovalev 01.11.2016
 * @version 1.0
 */

(function($) {
	'use strict';

	/*
	 * Cookie's function.
	 * Allows to set or get cookie.
	 *
	 * Based on the plugin jQuery Cookie Plugin
	 * https://github.com/carhartl/jquery-cookie
	 *
	 * Copyright 2011, Klaus Hartl
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://www.opensource.org/licenses/mit-license.php
	 * http://www.opensource.org/licenses/GPL-2.0
	 */
	$.aikaCore.tools.cookie = $.aikaCore.tools.cookie || function(key, value, options) {

		// Sets cookie

		if( arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined) ) {
			options = $.extend({}, options);
			if( value === null || value === undefined ) {
				options.expires = -1;
			}
			if( typeof options.expires === 'number' ) {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}
			value = String(value);
			return (document.cookie = [
				encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '',
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}
		// Gets cookie.
		options = value || {};
		var decode = options.raw ? function(s) {
			return s;
		} : decodeURIComponent;
		var pairs = document.cookie.split('; ');
		for( var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++ ) {
			if( decode(pair[0]) === key ) {
				return decode(pair[1] || '');
			}
		}
		return null;
	};

	/*
	 * jQuery MD5 Plugin 1.2.1
	 * https://github.com/blueimp/jQuery-MD5
	 *
	 * Copyright 2010, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * http://creativecommons.org/licenses/MIT/
	 *
	 * Based on
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */
	$.aikaCore.tools.hash = $.aikaCore.tools.hash || function(str) {
		var hash = 0;
		if( !str || str.length === 0 ) {
			return hash;
		}
		for( var i = 0; i < str.length; i++ ) {
			var charCode = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + charCode;
			hash = hash & hash;
		}
		hash = hash.toString(16);
		hash = hash.replace("-", "");
		return hash;
	};

	/**
	 * Implements the inheritance.
	 */
	$.aikaCore.tools.extend = function(o) {
		function F() {
		}

		F.prototype = $.extend(true, {}, o);
		return new F();
	};

	/**
	 * Дабавляет метку или куку в локальное хранилище
	 * @param cookieName
	 * @param value
	 * @param expires
	 */
	$.aikaCore.tools.setStorage = function(cookieName, value, expires) {
		if( localStorage && localStorage.setItem ) {
			try {
				var unixtime = Math.round(+new Date() / 1000);
				var str = {
					data: value,
					expires: expires * 86400 + unixtime
				};
				localStorage.setItem(cookieName, JSON.stringify(str));
			}
			catch( e ) {
				$.aikaCore.tools.cookie(cookieName, value, {
					expires: expires,
					path: "/"
				});
			}
		} else {
			$.aikaCore.tools.cookie(cookieName, value, {
				expires: expires,
				path: "/"
			});
		}
	};

	/**
	 * Получает метку или куку из локального хранилища
	 * @param cookieName
	 * @returns {string}
	 */
	$.aikaCore.tools.getFromStorage = function(cookieName) {
		var result = localStorage && localStorage.getItem && localStorage.getItem(cookieName);
		if( result ) {
			var unixtime = Math.round(+new Date() / 1000);
			result = JSON.parse(result);
			if( result.expires < unixtime ) {
				$.aikaCore.tools.removeStorage(cookieName);
				return null;
			}
			return result.data;
		} else {
			return $.aikaCore.tools.cookie(cookieName) ? $.aikaCore.tools.cookie(cookieName) : null;
		}
	};

	/**
	 * Checks does a browers support 3D transitions:
	 * https://gist.github.com/3794226
	 */

	$.aikaCore.tools.has3d = $.aikaCore.tools.has3d || function() {
		var el = document.createElement('p'),
			has3d,
			transforms = {
				'WebkitTransform': '-webkit-transform',
				'OTransform': '-o-transform',
				'MSTransform': '-ms-transform',
				'MozTransform': '-moz-transform',
				'Transform': 'transform'
			};
		el.className = 'onp-sl-always-visible';
		// Add it to the body to get the computed style
		document.body.insertBefore(el, null);
		for( var t in transforms ) {
			if( el.style[t] !== undefined ) {
				el.style[t] = 'translate3d(1px,1px,1px)';
				has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
			}
		}
		document.body.removeChild(el);
		return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
	};
	/**
	 * Checks does a brower support Blur filter.
	 */

	$.aikaCore.tools.canBlur = $.aikaCore.tools.canBlur || function() {
		var el = document.createElement('div');
		el.style.cssText = _browserPrefixes.join('filter' + ':blur(2px); ');
		var result = !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
		if( result ) {
			return true;
		}
		try {
			result = typeof SVGFEColorMatrixElement !== undefined &&
			SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
		}
		catch( e ) {
		}
		return result;
	};

	/**
	 * Returns true if a current user use a touch device
	 * http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
	 */
	$.aikaCore.isTouch = $.aikaCore.isTouch || function() {
		return !!('ontouchstart' in window) // works on most browsers
			|| !!('onmsgesturechange' in window); // works on ie10
	};

	/**
	 * Удаляет метку или куку из локального хранилища
	 * @param cookieName
	 */
	$.aikaCore.tools.removeStorage = function(cookieName) {
		if( localStorage && localStorage.removeItem ) {
			localStorage.removeItem(cookieName);
		} else {
			$.aikaCore.tools.cookie(cookieName, null, {
				expires: 0,
				path: "/"
			});
		}
	};

	$.aikaCore.tools.inArray = function(value, array) {
		return $.inArray(value, array) !== -1;
	};

	/**
	 * Comapres two arrays and return differents.
	 */
	$.aikaCore.tools.diffArrays = function(arr1, arr2) {
		return $.grep(arr1, function(el) {
			return $.inArray(el, arr2) == -1;
		});
	};

	/**
	 * Comapres two arrays and the common elemtnts.
	 */
	$.aikaCore.tools.unionArrays = function(arr1, arr2) {
		return $.grep(arr1, function(element) {
			return $.inArray(element, arr2) !== -1;
		});
	};

	$.aikaCore.detectBrowser = $.aikaCore.detectBrowser || function() {
		var uaMatch = jQuery.uaMatch || function(ua) {
				ua = ua.toLowerCase();
				var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
					/(webkit)[ \/]([\w.]+)/.exec(ua) ||
					/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
					/(msie) ([\w.]+)/.exec(ua) ||
					ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
					[];
				return {
					browser: match[1] || "",
					version: match[2] || "0"
				};
			};
		var matched = uaMatch(navigator.userAgent);
		$.aikaCore.browser = {};
		if( matched.browser ) {
			$.aikaCore.browser[matched.browser] = true;
			$.aikaCore.browser.version = matched.version;
		}
		function getInternetExplorerVersion() {
			var rv = -1;
			if( navigator.appName == 'Microsoft Internet Explorer' ) {
				var ua = navigator.userAgent;
				var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if( re.exec(ua) != null ) {
					rv = parseFloat(RegExp.$1);
				}
			}
			else if( navigator.appName == 'Netscape' ) {
				var ua = navigator.userAgent;
				var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
				if( re.exec(ua) != null ) {
					rv = parseFloat(RegExp.$1);
				}
			}
			return rv;
		}

		var ieVersion = getInternetExplorerVersion();
		if( ieVersion > 0 ) {
			$.aikaCore.browser.msie = true;
			$.aikaCore.browser.version = ieVersion;
		}
		if( navigator.userAgent.search(/YaBrowser/i) > 0 ) {
			var yaMatchExec = /(YaBrowser)[ \/]([\w.]+)/.exec(navigator.userAgent);
			$.aikaCore.browser.YaBrowser = true;
			$.aikaCore.browser.version = yaMatchExec[2] || "0";
		}
		// Chrome is Webkit, but Webkit is also Safari.
		if( $.aikaCore.browser.chrome ) {
			$.aikaCore.browser.webkit = true;
		} else if( $.aikaCore.browser.webkit ) {
			$.aikaCore.browser.safari = true;
		}
	};

	$.aikaCore.detectBrowser();

	/**
	 * Converts string of the view 'foo-bar' to 'fooBar'.
	 * http://stackoverflow.com/questions/10425287/convert-string-to-camelcase-with-regular-expression
	 */
	$.aikaCore.tools.camelCase = function(input) {
		return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
			return group1.toUpperCase();
		});
	};

	$.aikaCore.tools.capitaliseFirstLetter = function(input) {
		return input.charAt(0).toUpperCase() + input.slice(1);
	};

	/**
	 * Returns true if a current user uses a mobile device, else false.
	 */
	$.aikaCore.tools.isMobile = function() {
		if( (/webOS|iPhone|iPod|BlackBerry/i).test(navigator.userAgent) ) {
			return true;
		}
		if( (/Android/i).test(navigator.userAgent) && (/Mobile/i).test(navigator.userAgent) ) {
			return true;
		}
		return false;
	};

	/**
	 * Returns true if a current user uses a mobile device or tablet device, else false.
	 */
	$.aikaCore.tools.isTabletOrMobile = function() {
		if( (/webOS|iPhone|iPad|Android|iPod|BlackBerry/i).test(navigator.userAgent) ) {
			return true;
		}
		return false;
	};

	/**
	 * Updates the query string parameter in the given url.
	 * http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
	 */
	$.aikaCore.tools.updateQueryStringParameter = function(uri, key, value) {
		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		if( uri.match(re) ) {
			return uri.replace(re, '$1' + key + "=" + value + '$2');
		}
		else {
			return uri + separator + key + "=" + value;
		}
	};

	$.aikaCore.tools.isValidEmailAddress = function(emailAddress) {
		var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		return pattern.test(emailAddress);
	};

	$.aikaCore.tools.isValidUrl = function(emailAddress) {
		var pattern = new RegExp(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);
		return pattern.test(emailAddress);
	};

	// Find Left Boundry of current Window
	$.aikaCore.tools.findLeftWindowBoundry = function() {
		// In Internet Explorer window.screenLeft is the window's left boundry
		if( window.screenLeft ) {
			return window.screenLeft;
		}
		// In Firefox window.screenX is the window's left boundry
		if( window.screenX ) {
			return window.screenX;
		}
		return 0;
	};

	// Find Left Boundry of current Window
	$.aikaCore.tools.findTopWindowBoundry = function() {
		// In Internet Explorer window.screenLeft is the window's left boundry
		if( window.screenTop ) {
			return window.screenTop;
		}
		// In Firefox window.screenY is the window's left boundry
		if( window.screenY ) {
			return window.screenY;
		}
		return 0;
	};

	// Finds JSON object inside text
	$.aikaCore.tools.extractJSON = function(str) {
		var firstOpen, firstClose, candidate;
		firstOpen = str.indexOf('{', firstOpen + 1);
		do {
			firstClose = str.lastIndexOf('}');
			if( firstClose <= firstOpen ) {
				return null;
			}
			do {
				candidate = str.substring(firstOpen, firstClose + 1);
				try {
					var res = $.parseJSON(candidate);
					if( res ) {
						return res;
					}
				}
				catch( e ) {
				}
				firstClose = str.substr(0, firstClose).lastIndexOf('}');
			} while( firstClose > firstOpen );
			firstOpen = str.indexOf('{', firstOpen + 1);
		} while( firstOpen != -1 );
		return false;
	};

})(jQuery);
