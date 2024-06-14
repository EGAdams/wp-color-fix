/*
 * class Button
 */
class Button {
    constructor( attrs ) {
        this.element = $( document.createElement( 'a' ))
            .attr({
                'rel': 'external',
                'class': 'mcba_button',
                'href': attrs.href,
                'id': attrs.id,
            }).css({
                'display': 'block',
                'width': '35px',
                'height': '35px',
                'border-radius': '6px', // rounds the corners slightly
                'font-size': '20px',
                'color': '#fff',
                'line-height': '35px',
                'text-align': 'center',
                'cursor': 'pointer',
                'text-decoration': 'none',
                'background': MCBA.config.options.base_color.value,
            }).hover({
                'color': '#ccc',
                'text-decoration': 'none',
                'background': shade( MCBA.config.options.base_color.value, 10 )
            }).append(( attrs.img ) ? $( document.createElement( 'img' ) ).attr({
                    'src': attrs.img,
                    'alt': ( attrs.alt ? attrs.alt : '' ),
                    'border': '0'
            }).css({
                    'margin-top': attrs[ 'margin-top' ],
                }) : null
            );

        if ( typeof attrs.action !== 'undefined' ) {
            this.element.click( attrs.action ); }
    }
}
