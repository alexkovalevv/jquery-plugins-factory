/*
 * Localization
 * Copyright 2016, OnePress, http://byonepress.com
 * @pacakge core
*/
(function ($) {

    /**
    * Text resources.
    */

    $.aikaCore.lang.defaults = {

    };
    
    $.aikaCore.lang = $.aikaCore.lang.defaults;
    
    if ( window.__aikaCore && window.__aikaCore.lang ) {
        $.pandalocker.lang = $.extend( $.aikaCore.lang, window.__aikaCore.lang );
        window.__aikaCore.lang = null;
    }
 
})(jQuery);