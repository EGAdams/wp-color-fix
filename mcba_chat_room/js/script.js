/*
* ScrollToElement 1.0
* Copyright (c) 2009 Lauri Huovila, Neovica Oy
*  lauri.huovila@neovica.fi
*  http://www.neovica.fi
*  
* Dual licensed under the MIT and GPL licenses.
*/

(function($) {
    $.scrollToElement = function($element, speed) {

        speed = speed || 750;

        $("html, body").animate({
            scrollTop: $element.offset().top,
            scrollLeft: $element.offset().left
        }, speed);
        return $element;
    };

    $.fn.scrollTo = function(speed) {
        speed = speed || "normal";
        return $.scrollToElement(this, speed);
    };
})(jQuery);

jQuery( document ).ready( function ( $ )
{

	/**
	 * Split string into multiple values, separated by commas
	 *
	 * @param val
	 *
	 * @return array
	 */
	function split( val )
	{
		return val.split( /,\s*/ );
	}

	/**
	 * Extract string Last into multiple values
	 * @param term
	 *
	 */
	function extract_last( term )
	{
		return split( term ).pop();
	}

	$( '#recipient' ).autocomplete( {
		source: function ( request, response )
		{
			var data = {
				action: 'rwpm_get_users',
				term  : extract_last( request.term )
			};
			$.post( ajaxurl, data, function ( r )
			{
				response( r );
			}, 'json' );
		},
		select: function ( event, ui )
		{
			var terms = split( this.value );
			terms.pop();
			terms.push( ui.item.value );
			terms.push( "" );
			this.value = terms.join( "," );
			return false;
		}
	} );

} );