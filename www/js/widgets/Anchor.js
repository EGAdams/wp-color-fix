/** class Anchor */
function Anchor( attrs ) {

    var icon = ""
    if ( attrs.left_button_icon != undefined ) {
        icon = attrs.left_button_icon;
    } else if ( attrs.right_button_icon != undefined ) {
        icon = attrs.right_button_icon;
    } else if ( attrs.button_icon != undefined ) {
        icon = attrs.button_icon;
    }

    this.anchor = document.createElement( 'a' );
    this.anchor.setAttribute( 'rel', 'external' );
    this.anchor.setAttribute( 'class', 'mcba_button ' + icon );
    this.anchor.setAttribute( 'href', attrs.action );
    this.anchor.setAttribute( 'id', attrs.id );

    this.anchor.style.display = 'block';
    this.anchor.style.width = attrs.width;
    this.anchor.style.height = attrs.height;
    this.anchor.style.borderRadius = '6px'; // rounds the corners slightly
    this.anchor.style.fontSize = attrs.font_size + "px";
    this.anchor.style.fontFamily = attrs.font;
    this.anchor.style.color = attrs.text_color;
    this.anchor.style.lineHeight = attrs.lineHeight;
    this.anchor.style.textAlign = 'center';
    this.anchor.style.cursor = 'pointer';
    this.anchor.style.textDecoration = 'none';
    this.anchor.style.background = backgroundColor;
    this.anchor.style.marginLeft = attrs.margin_left;
    this.anchor.style.marginRight = attrs.margin_right;
    this.anchor.style.backgroundImage = 'url(' + attrs.img + ')';


    if ( ( attrs.img.search( ".png" ) > 0 ) || ( attrs.img.search( ".jpg" ) > 0 ) ) {
        this.anchor[ 0 ].style.backgroundImage = 'url(' + attrs.img + ')';
        this.anchor[ 0 ].style[ "background-size" ] = "100% 100%";
        this.anchor[ 0 ].style.color = "rgb(255, 255, 255,0)"; // that last 0 sets opacity to invisible
    }

    this.getAnchor = function () {
        return this.anchor;
    }

    this.getWidthPointer = function () {
        return this.anchor.style.width;
    }
}