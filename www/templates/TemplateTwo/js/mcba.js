console.log( "loading mcba.js from plugins TemplateTwo directory... " );
// may 28, 2024 work in progress...
/*
 * class Button
 */
class Button {
    constructor( attrs ) {
        this.element = jQuery( document.createElement( 'a' ))
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
            }).append(( attrs.img ) ? jQuery( document.createElement( 'img' ) ).attr({
                    'src': attrs.img,
                    'alt': ( attrs.alt ? attrs.alt : '' ),
                    'border': '0'
            }).css({
                    'margin-top': attrs[ 'margin-top' ],
                }) : null
            );

        if ( typeof attrs.action !== 'undefined' ) {
            if ( attrs.action == "accept_background_location" ) {
                this.element.click = function() { Callback.askBackgroundPermission(); }
            } else {
                this.element.click( function () { 
					Callback.showToast( "You will not receive any promotional notices." );
					window.location.href = attrs.action; }); }
        }
    }
}
/*
 *
 */
function FontAwesomeSelectElement() {
    this.createElement = function ( initialCategoryArg ) {
        this.iconCategory = initialCategoryArg;
        let selectElement = document.createElement( "select" );
        let icons = MCBA.icons;
        let iconCategories = MCBA.iconCategories;
        for ( let icon in icons ) {
            if ( iconCategories[ this.iconCategory ].icons.includes( icon ) ) {
                if ( icons.hasOwnProperty( icon ) ) {
                    for ( let i = 0; i < icons[ icon ].styles.length; i++ ) {
                        let style = icons[ icon ].styles[ i ];
                        let iconName = icon;
                        let optionElement = document.createElement( "option" );
                        if ( style == "brands" ) {
                            optionElement.className = "fab";
                            optionElement.value = "fab fa-" + iconName;
                        } else if ( style == "solid" ) {
                            optionElement.className = "fas";
                            optionElement.value = "fas fa-" + iconName;
                        } else if ( style == "regular" ) {
                            optionElement.className = "far";
                            optionElement.value = "far fa-" + iconName;
                        } else {
                            console.error( "*** ERROR: can not determine style for " + style + "! guessing fa... ***" );
                            optionElement.className = "fa";
                            optionElement.value = "fa fa-" + iconName;
                        }
                        optionElement.innerHTML = " &#x" + icons[ icon ].unicode + "; " + iconName;
                        selectElement.appendChild( optionElement );
                        selectElement.className = optionElement.className;
                    }
                }
            }
        }
        let optionElement = document.createElement( "option" );
        optionElement.innerHTML = "-- Select icon from category " + this.iconCategory + " --";
        selectElement.prepend( optionElement );
        selectElement.selectedIndex = 0;
        return selectElement;
    };

    this.setIconCategory = function ( categoryArg ) {
        this.iconCategory = categoryArg;
    }
};










//! <Anchor>
/*
   #
  # #    #    #   ####   #    #   ####   #####
 #   #   ##   #  #    #  #    #  #    #  #    #
#     #  # #  #  #       ######  #    #  #    #
#######  #  # #  #       #    #  #    #  #####
#     #  #   ##  #    #  #    #  #    #  #   #
#     #  #    #   ####   #    #   ####   #    #
*/
function Anchor( attrs ) {

    let icon = ""
    if ( attrs.left_button_icon != undefined ) {
        icon = attrs.left_button_icon;
    } else if ( attrs.right_button_icon != undefined ) {
        icon = attrs.right_button_icon;
    } else if ( attrs.button_icon != undefined ) {
        icon = attrs.button_icon;
    }

    this.anchor = jQuery( document.createElement( 'a' ) )
        .attr( {
            'rel': 'external',
            'class': 'mcba_button', // ' + icon,
            'href': attrs.action,
            'id': attrs.id,
        } )
        .css( {
            'display': 'block',
            'width': attrs.width,
            'height': attrs.height,
            'border-radius': '6px', // rounds the corners slightly
            'font-size': attrs.font_size + "px",
            'font-family': attrs.font,
            'color': attrs.text_color,
            'lineHeight': attrs.lineHeight,
            'text-align': 'center',
            'cursor': 'pointer',
            'text-decoration': 'none',
            'background': backgroundColor,
            'margin-left': attrs.margin_left,
            'margin-right': attrs.margin_right,
            // 'backgroundImage': 'url(' + attrs.img + ')'
        } );

    if ( ( attrs.img.search( ".png" ) > 0 ) || ( attrs.img.search( ".jpg" ) > 0 ) ) {
        // this.anchor[ 0 ].style.backgroundImage = 'url(' + attrs.img + ')';
        this.anchor[ 0 ].style[ "background-size" ] = "100% 100%";
        this.anchor[ 0 ].style.color = "rgb(255, 255, 255,0)"; // that last 0 sets opacity to invisible
    }

    this.getAnchor = function () {
        return this.anchor;
    }

    this.getWidthPointer = function () {
        this.anchor[ 0 ].style.width;
    }
}
/*
#######                       #
#        #    #  #####       # #    #    #   ####   #    #   ####   #####
#        ##   #  #    #    #    #   ##   #  #    #  #    #  #    #  #    #
#####    # #  #  #    #    #     #  # #  #  #       ######  #    #  #    #
#        #  # #  #    #    #######  #  # #  #       #    #  #    #  #####
#        #   ##  #    #    #     #  #   ##  #    #  #    #  #    #  #   #
#######  #    #  #####     #     #  #    #   ####   #    #   ####   #    #
*/
//! </Anchor>


/*
 *  BlockListSubject
 */
/*
let BlockListSubject = ( function () {
    function BlockListSubject() {
        this.observers = [];

        this.clear = function () {
            this.observers = [];
        };

        this.subscribe = function ( observer ) { // observer is an update() function!
            this.observers.push( observer );
        };

        this.unsubscribe = function ( observer ) {
            this.observers = this.observers.filter(
                function ( item ) {
                    if ( item !== observer ) {
                        return item;
                    }
                }
            );
        };

        this.isSubscribed = function ( observer ) {
            for ( let i = 0; i < this.observers.length; i++ ) {
                if ( this.observers[ i ] === observer ) {
                    return true;
                }
            }
            return false;
        };

        this.fire = function ( thisObj, data ) {
            let scope = thisObj || window;
            this.observers.forEach( function ( observer ) {
                observer.call( scope, data );
            } );
        };
    }
    let instance;
    return {
        getInstance: function () {
            if ( null == instance ) {
                instance = new BlockListSubject();
                instance.constructor = null; // Note how the constructor is hidden to prevent instantiation
            }
            return instance; //return the singleton instance
        }
    };
} )(); */



/*!
######                                          ######
#     #  #    #   #####   #####   ####   #    # #     #   ####   #    #
#     #  #    #     #       #    #    #  ##   # #     #  #    #  #    #
######   #    #     #       #    #    #  # #  # ######   #    #  #    #
#     #  #    #     #       #    #    #  #  # # #   #    #    #  # ## #
#     #  #    #     #       #    #    #  #   ## #    #   #    #  ##  ##
######    ####      #       #     ####   #    # #     #   ####   #    #
*/

function Buttonrow( item ) {

    let self = this;
    self.item = item;
    self.propertyObjects = new Object();

    let factory = new PropertyObjectFactory( this );
    for ( let key in item ) {
        if ( item.hasOwnProperty( key ) ) { // use snake case for keys and camel case for live objects.
            self.propertyObjects[ key ] = factory.createPropertyObject( key.replace( /(\_\w)/g, function ( k ) {
                return k[ 1 ].toUpperCase();
            } ) );
        }
    }

    this.update = function ( triggeringObject ) {
        if ( this == self ) {
            let propertyObject = self.propertyObjects[ triggeringObject.model.name ];
            if ( propertyObject == null ) {
                console.error( "*** ERROR: \"" + factory.capitalizeFirstLetter( triggeringObject.model.name.replace( /(\_\w)/g, function ( k ) {
                        return k[ 1 ].toUpperCase();
                    } ) ) +
                    "Property\" object can not be found or it could be that it just doesn't exist. ***" );
                return;
            }
            propertyObject.setValue( triggeringObject.data[ triggeringObject.model.name ] );
        }
    };

    this.setLeftButtonTextAdjustment = function ( newValue ) {
        self.block.menu.children[ 3 ].setElementValue( newValue );
    };

    this.setRightButtonTextAdjustment = function ( buttonText ) {
        self.block.menu.children[ 4 ].setElementValue( buttonText );
    }

    this.getLeftButtonTextAdjustment = function () {
        return self.block.menu.children[ 3 ].getElementValue();
    };

    this.getRightButtonTextAdjustment = function ( buttonText ) {
        return self.block.menu.children[ 4 ].getElementValue();
    }

    this.getTextColorAdjustment = function ( buttonText ) {
        return self.block.menu.children[ 5 ].getElementValue();
    }

    this.setLeftButtonTextElement = function ( newText ) {
        self.element[ 0 ].children[ 0 ].outerText = newText;
    }

    this.setRighButtonTextElement = function ( newText ) {
        self.element[ 0 ].children[ 1 ].outerText = newText;
    }

    let button_width, button_height;
    if ( MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ "width" ] != undefined ) {
        button_width = MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ "width" ];
    } else {
        button_width = "45%";
    }
    if ( item.lineHeight != undefined )
        button_height = item.lineHeight + "px";
    else if ( MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ "lineHeight" ] != undefined ) {
        button_height = MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ "lineHeight" ];
    } else {
        button_height = "40px";
    }
    let buttonColor = "0000ff";
    if ( item.background_color != undefined )
        buttonColor = item.background_color;

    let left_image_path = "";
    let right_image_path = "";

    if ( MCBA.www_url != undefined ) {
        left_image_path = MCBA.www_url + 'images/' + item.left_button_image?.trim();
        right_image_path = MCBA.www_url + 'images/' + item.right_button_image?.trim();
    } else {
        left_image_path = 'images/' + item.left_button_image?.trim();
        right_image_path = 'images/' + item.right_button_image?.trim();
    }

    let leftButton = new CustomButton( {
        'img': left_image_path,
        'width': button_width,
        'lineHeight': button_height,
        'background': buttonColor,
        'text_color': self.item.text_color,
        'buttonText': self.item.left_button_text,
        'font_family': self.item.font,
        'left_button_icon': self.item.left_button_icon,
        'action': self.item.left_button_action,
        'font_size': self.item.font_size,
        'margin_left': "3.33333%"
    } ).element.css( {
        'float': 'left',
        'margin-left': '3.33333%'
    } ); // left button
    this.leftButtonElement = leftButton[ 0 ];

    let rightButton = new CustomButton( {
        'img': right_image_path,
        'width': button_width,
        'lineHeight': button_height,
        'background': buttonColor,
        'text_color': self.item.text_color,
        'buttonText': self.item.right_button_text,
        'font_family': self.item.font,
        'font_size': self.item.font_size,
        'left_button_icon': self.item.right_button_icon,
        'action': self.item.right_button_action,
        'margin_right': "3.33333%"
    } ).element.css( {
        'float': 'right',
        'margin-right': '3.33333%'
    } ); // right button
    this.rightButtonElement = rightButton[ 0 ];

    this.element = jQuery( document.createElement( 'div' ) ).attr( {
        id: 'header'
    } ).css( {
        'position': 'relative',
        'text-align': 'center',
        'margin-top': '0',
        'margin-bottom': '0',
        'padding-top': '5px',
        'padding-bottom': '6px',
        'background-repeat': 'repeat-x',
        'background-position': 'center bottom',
        'z-index': '100',
        'overflow': 'auto',
        //'margin-right': 'auto',
        //'margin-left': 'auto',
        'width': '100%'
    } );

    this.element.append( leftButton );
    this.element.append( rightButton );

    self.subject = BlockListSubject.getInstance();
    self.subject.subscribe( self.update );

    this.getSubject = function () {
        return self.subject;
    }
}

/*!

#######
#        #    #  #####
#        ##   #  #    #
#####    # #  #  #    #
#        #  # #  #    #
#        #   ##  #    #
#######  #    #  #####

######                                          ######
#     #  #    #   #####   #####   ####   #    # #     #   ####   #    #
#     #  #    #     #       #    #    #  ##   # #     #  #    #  #    #
######   #    #     #       #    #    #  # #  # ######   #    #  #    #
#     #  #    #     #       #    #    #  #  # # #   #    #    #  # ## #
#     #  #    #     #       #    #    #  #   ## #    #   #    #  ##  ##
######    ####      #       #     ####   #    # #     #   ####   #    #

*/

//! </ButtonRow>


function Contactform( item ) {

    this.element = jQuery( document.createElement( 'div' ) )
        .append(
            jQuery( document.createElement( 'form' ) )
            .attr( {
                'action': '/contact',
                'method': 'post',
            } )
            .css( {
                'margin': 'auto',
                'width': '90%',
            } )
            .append(
                jQuery( document.createElement( 'input' ) )
                .attr( {
                    'type': 'text',
                    'placeholder': 'Name *',
                    'name': 'name',
                    'value': '',
                } )
                .css( {
                    'display': 'block',
                    'margin': 'auto',
                    'margin-bottom': '5px',
                    'width': '100%',
                } )
            )
            .append(
                jQuery( document.createElement( 'input' ) )
                .attr( {
                    'type': 'text',
                    'placeholder': 'Email *',
                    'name': 'email',
                    'value': '',
                } )
                .css( {
                    'display': 'block',
                    'margin': 'auto',
                    'margin-bottom': '5px',
                    'width': '100%',
                } )
            )
            .append(
                jQuery( document.createElement( 'input' ) )
                .attr( {
                    'type': 'text',
                    'placeholder': 'Phone *',
                    'name': 'phone',
                    'value': '',
                } )
                .css( {
                    'display': 'block',
                    'margin': 'auto',
                    'margin-bottom': '5px',
                    'width': '100%',
                } )
            )
            .append(
                jQuery( document.createElement( 'input' ) )
                .attr( {
                    'type': 'text',
                    'placeholder': 'Subject *',
                    'name': 'subject',
                    'value': '',
                } )
                .css( {
                    'display': 'block',
                    'margin': 'auto',
                    'margin-bottom': '5px',
                    'width': '100%',
                } )
            )
            .append(
                jQuery( document.createElement( 'textarea' ) )
                .attr( {
                    'placeholder': 'Message *',
                    'name': 'message',
                    'value': '',
                    'rows': '10',
                } )
                .css( {
                    'display': 'block',
                    'margin': 'auto',
                    'margin-bottom': '5px',
                    'width': '100%',
                } )
            )
            .append(
                jQuery( document.createElement( 'input' ) )
                .attr( {
                    'type': 'submit',
                    'name': 'submit',
                    'value': 'submit',
                } )
            )
        );
}










//! <CustomButton>

/*
 #####
#     #  #    #   ####    #####   ####   #    #
#        #    #  #          #    #    #  ##  ##
#        #    #   ####      #    #    #  # ## #
#        #    #       #     #    #    #  #    #
#     #  #    #  #    #     #    #    #  #    #
 #####    ####    ####      #     ####   #    #

######
#     #  #    #   #####   #####   ####   #    #
#     #  #    #     #       #    #    #  ##   #
######   #    #     #       #    #    #  # #  #
#     #  #    #     #       #    #    #  #  # #
#     #  #    #     #       #    #    #  #   ##
######    ####      #       #     ####   #    #
*/

function CustomButton( attrs ) {

    if ( attrs.background != undefined ) {
        backgroundColor = attrs.background;
    } else {
        backgroundColor = "white";
    }

    var buttonImage = document.createElement( "img" );
    if ( attrs.img.slice( -1 ) == "/" || attrs.img.slice( -9 ) == "undefined" ) {
        buttonImage.src = "";
    } else {
        buttonImage.src = attrs.img;
    }
    buttonImage.alt = attrs.alt;
    buttonImage.css = {
        "margin-top": attrs[ "margin-top" ]
    };

    let anchor = new Anchor( attrs );
    this.element = anchor.getAnchor();
    
    if ( buttonImage.src.slice( -6 ) == "mockup" ) {
        buttonImage.src = "";
    } else {
        this.element.append( buttonImage );
    }


    let button_text = attrs.buttonText;
    if ( button_text != undefined ) {
        this.element[ 0 ].innerHTML = '<span' + ( attrs.font_family ? ' style="font-family:' + attrs.font_family + ';">' : ">" ) + button_text + '</span>';
    } else {
        this.element[ 0 ].innerHTML = "Custom Text";
    }

    if ( typeof attrs.action !== 'undefined' ) {
        if ( attrs.action == "accept_background_location" ) {
            this.element.click = function() { 
                console.log( "calling ask background permission..." );
                Callback.askBackgroundPermission(); }
        } else {
            this.element.click( function () { 
				Callback.showToast( "You will not receive any promotional notices." );
				window.location.href = attrs.action; }); }
    }

    this.widthPointer = anchor.getWidthPointer(); 
}
/*
#######
#        #    #  #####
#        ##   #  #    #
#####    # #  #  #    #
#        #  # #  #    #
#        #   ##  #    #
#######  #    #  #####

 #####
#     #  #    #   ####    #####   ####   #    #
#        #    #  #          #    #    #  ##  ##
#        #    #   ####      #    #    #  # ## #
#        #    #       #     #    #    #  #    #
#     #  #    #  #    #     #    #    #  #    #
 #####    ####    ####      #     ####   #    #

######
#     #  #    #   #####   #####   ####   #    #
#     #  #    #     #       #    #    #  ##   #
######   #    #     #       #    #    #  # #  #
#     #  #    #     #       #    #    #  #  # #
#     #  #    #     #       #    #    #  #   ##
######    ####      #       #     ####   #    #
*/
//! </CustomButton>


function Footer() {

    let self = this;
    this.element = jQuery( document.createElement( 'div' ) )
        .attr( {
            'id': 'footer'
        } )
        .css( {
            'position': 'relative',
            'width': '100%',
            'padding-top': '6px',
        } )
        .append(
            jQuery( document.createElement( 'div' ) )
            .css( {
                'width': '100%',
                'text-align': 'center',
            } )
            .append(
                jQuery( document.createElement( 'strong' ) )
                .append( MCBA.config.options[ 'companyname' ].value )
            )
            .append( jQuery( document.createElement( 'br' ) ) )
            .append( MCBA.config.options[ 'address' ].value )
            .append( jQuery( document.createElement( 'br' ) ) )
            .append( MCBA.config.options[ 'city' ].value + ", " + MCBA.config.options[ 'state' ].value + " " + MCBA.config.options[ 'zip' ].value )
            .append( jQuery( document.createElement( 'br' ) ) )
            .append(
                jQuery( document.createElement( 'div' ) )
                .append(
                    new Button( {
                        'img': MCBA.rootDir + 'images/awm-img-phone_small.png',
                        'alt': 'phone-small',
                        'size': 15,
                        'href': 'tel:' + config_data.options[ 'phone' ].value,
                    } ).element
                    .css( {
                        'float': 'left',
                        'margin-left': '16px',
                    } )
                )
                .append(
                    new Button( {
                        'img': MCBA.rootDir + 'images/awm-img-email_small.png',
                        'alt': 'email-small',
                        'size': 15,
                        'href': 'mailto:' + MCBA.config.options.email.value,
                    } ).element
                    .css( {
                        'float': 'right',
                        'margin-right': '16px',
                    } )
                )
                .append( jQuery( document.createElement( 'br' ) ) )
                .append( jQuery( document.createElement( 'br' ) ) )
                .append( "<a href='http://mycustombusinessapp.com/'>MCBA</a> © 2015 <a href='http://allwebnmobile.com'>" + MCBA.config.options.legalname.value + "</a> | " )
                .append(
                    jQuery( document.createElement( 'a' ) )
                    .attr( {
                        'href': 'http://allwebnmobile.com/privacy-policy/',
                        'rel': 'external'
                    } )
                    .append( 'Privacy Policy' )
                )
            )
        )

        .on( 'DOMNodeInserted', function ( event ) {
            jQuery( self.element )
                .css( {} );
        } );
}












function Header() {

    let self = this;
    let logoURL = MCBA.getOption( 'logo' ).value;
    if ( logoURL === "" || logoURL === undefined ) logoURL = ( ( MCBA.config.options.logo.value === "" || MCBA.config.options.logo.value === undefined ) ? MCBA.rootDir + "images/awm-logo-default.png" : 'images/' + MCBA.config.options.logo.value );
    let pageColor = ( MCBA.config.pages[ MCBA.currentPage ].pageColor ? MCBA.config.pages[ MCBA.currentPage ].page_color : MCBA.config.options.page_color.value );
    let arrowButton =
        /* Arrow button */
        new Button( {
            'img': MCBA.rootDir + 'images/ic_arrow_backsm.png',
            'alt': 'menu',
            'action': function () {
                MCBA.load( 'back' );
            }
        } ).element
        .css( {
            'float': 'left',
            'margin-left': '6px',
            'margin-right': '10px',
        } );
    let leftButton =
        /* Left button */
        new Button( {
            'img': MCBA.rootDir + 'images/awm-img-menu.png',
            'alt': 'menu',
            'width': '100px',
            'action': function () {
                jQuery( '.navigation' ).slideToggle( 'fast' );
                return false;
            }
        } ).element
        .css( {
            'float': 'left',
            'margin-left': '6px',
            'margin-right': '10px',
        } );


    if ( MCBA.currentPage === 0 ) {
        arrowButton = "";
    } else {
        leftButton = "";
    }

    this.element = jQuery( document.createElement( 'div' ) )
        .attr( {
            id: 'header'
        } )
        .css( {
            'position': 'relative',
            'text-align': 'center',
            'margin-top': '0',
            'margin-bottom': '0',
            'padding-top': '5px',
            'padding-bottom': '6px',
            'background-repeat': 'repeat-x',
            'background-position': 'center bottom',
            'z-index': '100',
            'overflow': 'auto',
            'margin-right': 'auto',
            'margin-left': 'auto',
            'width': '100%',
        } )
        .append( arrowButton )
        .append( leftButton )
        .append(
            /* Right button */
            new Button( {
                'img': MCBA.rootDir + 'images/awm-img-phone.png',
                'alt': 'phone',
                'href': 'tel:' + config_data.options[ 'phone' ].value,
                //'action' : function(){/*MCBA.load(attrs.page)*/}
            } ).element
            .css( {
                'float': 'right',
                'margin-right': '6px',
            } )
        )
        .append(
            jQuery( document.createElement( 'label' ) )
            .attr( {
                'class': 'mcba_template_page_title ',
            } )
            .append( MCBA.currentPagePtr.title )
        );


}


//! <MCBA_Image>
function MCBA_Image( item ) {
    if ( !item ) {
        console.log( "*** WARNING: Image constructor called with no item argument. ***" );
        return;
    }

    let self = this;
    let imgSRC = "";
    if ( item[ 'src' ] === "" || item[ 'src' ] === undefined ) {
        imgSRC = "";
    } else {
        if ( MCBA.smartphone ) {
            imgSRC = item[ 'www_url' ] + "templates/" + config_data.template + '/images/' + item[ 'src' ];
        } else {
            // imgSRC = '../wp-content/plugins/MCBA-Wordpress/www/templates/' + config_data.template + '/images/' + item[ 'src' ]
            imgSRC = '../wp-content/plugins/MCBA-Wordpress/www/images/' + item[ 'src' ];
        }
    }

    this.img = jQuery( document.createElement( 'img' ) )
        .attr( {
            'src': imgSRC,
        } )
        .css( {
            'width': item[ 'percent' ] + '%',
            'height': item[ 'percent' ] + '%',
        } );

    if ( typeof item[ 'position' ] !== 'undefined' ) {
        switch ( item[ 'position' ] ) {
            case 'Left':
                break;
            case 'Right':
                this.img.css( {
                    'margin-left': 'auto',
                } );
                break;
            case 'Center':
                this.img.css( {
                    'margin-right': 'auto',
                    'margin-left': 'auto',
                } );
                break;
            case 'Span':
                this.img.css( {
                    'margin-right': 'auto',
                    'margin-left': 'auto',
                    'width': '100%',
                } );
                break;
        }
    }

    this.removeImage = function ( fileItem, www_url ) {
        fileItem.element[ 0 ].children[ 1 ].children[ 0 ].value = "upload.png";
        fileItem.element[ 0 ].children[ 1 ].children[ 2 ].src = www_url + "images/" + "upload.png";
        this.element[ 0 ].children[ 0 ].src = "";
    }

    this.element = jQuery( document.createElement( 'div' ) )
        .css( {
            'display': 'flex',
            'position': 'relative',
            'width': '100%',
        } )
        .append( this.img[ 0 ] );

    this.update = function ( item ) {
        if ( this != self )
            return;
        if ( item.data.percent == "" )
            item.data.percent = "95";
        if ( item.data.www_url == undefined )
            item.data[ "www_url" ] = "";
        this.img[ 0 ].src = item.data.www_url + "images/" + item.data.src;
        if ( item.data.position == "Right" ) {
            this.img.css( {
                'margin-left': 'auto'
            } );
            this.img.css( {
                'margin-right': ''
            } );
        } else if ( item.data.position == "Center" ) {
            this.img[ 0 ].style.marginLeft = "auto";
            this.img[ 0 ].style.marginRight = "auto";
        } else if ( item.data.position == "Left" ) {
            this.img.css( {
                'margin-left': ''
            } );
            this.img.css( {
                'margin-right': 'auto'
            } );

        }
        this.img[ 0 ].style.width = item.data.percent + "%";
    }

    self.subject = BlockListSubject.getInstance();
    self.subject.subscribe( self.update );

    this.getSubject = function () {
        return self.subject;
    }
}
//! </Image>

/*
 *  ImageButton
 */


function Imagebutton( item ) {
    let self = this;
    let mirror_global = true;
    this.width = 0;

    this.updatePageItems = function ( key, value ) {

        MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ key ] = value;

        if ( mirror_global ) {
            for ( const item in MCBA.pageItems ) {
                if ( MCBA.pageItems.hasOwnProperty( item ) ) {
                    const pageItem = MCBA.pageItems[ item ];
                    if ( pageItem.type.toLocaleLowerCase() == this.constructor.name.toLocaleLowerCase() ) { // if singlebutton
                        const element = MCBA.pageItems[ item ];
                        MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ key ] = value;
                        element.element[ 0 ].firstChild.style[ key ] = value;
                        element.item[ key ] = value.replace( /\D/g, '' );
                        let children = pageItem.children;
                        for ( const child in children ) {
                            if ( children.hasOwnProperty( child ) ) {
                                const menu_element = children[ child ];
                                if ( menu_element.model.name == key ) {
                                    if ( key == "width" ) {
                                        menu_element.element[ 0 ].children[ 1 ].setAttribute( "value", value.replace( /\D/g, '' ) );
                                        menu_element.element[ 0 ].children[ 1 ].value = value.replace( /\D/g, '' );
                                    } else if ( key == "lineHeight" ) {
                                        menu_element.element[ 0 ].children[ 1 ].setAttribute( "value", value.replace( /\D/g, '' ) );
                                        menu_element.element[ 0 ].children[ 1 ].value = value.replace( /\D/g, '' );
                                    } else {
                                        console.log( "*** ERROR: unknown key " + key + "! ***" );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    let logoURL = MCBA.getOption( 'logo' ).value;
    if ( logoURL === "" || logoURL === undefined ) logoURL = ( ( MCBA.config.options.logo.value === "" || MCBA.config.options.logo.value === undefined ) ? MCBA.rootDir + "images/awm-logo-default.png" : 'images/' + MCBA.config.options.logo.value );
    let pageColor = ( MCBA.config.pages[ MCBA.currentPage ].pageColor ? MCBA.config.pages[ MCBA.currentPage ].page_color : MCBA.config.options.page_color.value );


    let lineHeight = "60px";
    if ( mirror_global ) {
        lineHeight = MCBA.config.options.singlebutton.lineHeight.replace( "px", "" ) + "px";
        this.lineHeight = lineHeight.replace( "px", "" );
        item.lineHeight = lineHeight.replace( "px", "" );
    } else {
        if ( item.lineHeight != undefined ) {
            if ( item.lineHeight.length != 0 ) {
                lineHeight = item.lineHeight.replace( "px", "" ) + "px";
            }
        }
    }

    let buttonWidth = "75%";
    if ( mirror_global ) {
        buttonWidth = MCBA.config.options.singlebutton.width.replace( "%", "" ) + "%";
        this.width = buttonWidth.replace( "%", "" );
        item.width = buttonWidth.replace( "%", "" );
    } else {
        if ( item.percent != undefined ) {
            if ( item.percent.length != 0 ) {
                buttonWidth = item.percent + "%";
            }
        }
    }

    let leftMargin = "6px";
    let rightMargin = "10px";

    if ( item.leftMargin != undefined ) {
        leftMargin = item.leftMargin + "%";
    }

    if ( item.rightMargin != undefined ) {
        rightMargin = item.rightMargin + "%";
    }

    let leftButton = new CustomButton( {
            'img': MCBA.rootDir + 'images/awm-img-menu.png',
            'alt': 'menu',
            'width': buttonWidth,
            'lineHeight': lineHeight,
            'action': item.action
        } ).element
        .css( {
            /*'float': 'left', */
            'margin-left': 'auto',
            'margin-right': 'auto',
            'background': ""
        } );


    this.element = jQuery( document.createElement( 'div' ) )
        .attr( {
            id: 'header'
        } )
        .css( {
            'position': 'relative',
            'text-align': 'center',
            'margin-top': '0',
            'margin-bottom': '0',
            'padding-top': '5px',
            'padding-bottom': '6px',
            'background-repeat': 'repeat-x',
            'background-position': 'center bottom',
            'z-index': '100',
            'overflow': 'auto',
            'margin-right': 'auto',
            'margin-left': 'auto',
            'display': 'block',
            'width': '100%'
        } )

        .append( leftButton );

    this.update = function () {}
}

function Menu( item ) {

    let self = this;
    this.childElements = [];
    let listElem = jQuery( document.createElement( 'ul' ) )
        .css( {
            'position': 'relative',
            'width': '100%',
        } )
        .attr( {
            'class': 'mcba_menu center'
        } );

    for ( let i = 0; i < item.values.length; i++ ) {
        let detail = item.values[ i ];
        let pageName = detail.page;
        let pageNum = -1;
        for ( let x = 0; x < MCBA.config.pages.length; x++ ) {
            if ( MCBA.config.pages[ x ].title === pageName ) {
                pageNum = x;
                break;
            }
        }

        let child =
            jQuery( document.createElement( 'li' ) )
            .css( {
                'cursor': 'pointer'
            } )
            .append(
                jQuery( document.createElement( 'a' ) )
                .attr( {
                    'rel': 'external'
                } )
                .data( 'page', pageNum )
                .click( function () {
                    MCBA.load( parseInt( jQuery( this ).data( 'page' ), radix ) );
                } )
                .append(
                    jQuery( document.createElement( 'div' ) )
                    .attr( {
                        'width': '100%',
                        'height': '100%'
                    } )
                    .append( detail.page )
                )
            );
        self.childElements.push( child );
        listElem.append( child );
    }
    this.element = listElem;
}

function Navigation() {

    this.element = jQuery( document.createElement( 'div' ) )
        .attr( {
            'class': 'navigation center'
        } )
        .css( {
            'top': '0px',
            'display': 'none' // Hide the menu for now
        } )
        .append(
            // Navigation list
            ( function ( elem ) {
                let keepCountForIOS = 0;
                for ( index in MCBA.config.pages ) {
                    newIndex = keepCountForIOS++;
                    elem.append(
                        jQuery( document.createElement( 'li' ) )
                        .css( {
                            'cursor': 'pointer',
                        } )
                        .append(
                            jQuery( document.createElement( 'a' ) )
                            .attr( {
                                'rel': 'external',
                            } )
                            .data( 'page', newIndex )
                            .click( function () {
                                let liindex = jQuery( '.navigation li' ).index( jQuery( this ).parent() );
                                let parsedPage = parseInt( jQuery( this ).data( 'page' ) );
                                //alert(parsedPage:"+parsedPage+" liindex:"+liindex);
                                if ( isNaN( parsedPage ) ) parsedPage = liindex;
                                MCBA.load( parsedPage );
                            } )
                            .append(
                                jQuery( document.createElement( 'div' ) )
                                .attr( {
                                    'width': '100%',
                                    'height': '100%'
                                } )
                                .append( MCBA.config.pages[ index ].title.replace( /_/g, ' ' ).toUpperCase() )
                            )

                        )
                    );
                }
                return elem;
            } )( jQuery( document.createElement( 'ul' ) ) )


        );
}

/*
 *  Space
 */
// function Space(item) {

//     let self = this;
//     this.element = jQuery(document.createElement('div'))
//         .css({
//             'position': 'relative',
//             'width': '100%',
//         });

//     this.setHeight = function () {
//         for (let i = 0; i < item.height; i++) {
//             this.element.append(document.createElement('br'));
//         }
//     }


//     this.update = function (newData) {
//         if (this != self)
//             return;
//         while (this.element[0].lastElementChild) {
//             this.element[0].removeChild(this.element[0].lastElementChild);
//         }
//         if (newData !== undefined)
//             item.height = newData.height;
//         this.setHeight();
//     }

//     this.setHeight();

//     let subject = BlockListSubject.getInstance();
//     subject.subscribe(this.update);
// }

MCBA.loadStyle( "css/custom.css" );
MCBA.loadStyle( "www/js/widgets/jquery-ui.css" ); // TODO: make sure this isn't loading twice.

MCBA.getOption = function ( key ) {
    let option = {};
    // let logoURL = ((MCBA.config.options.logo.value === "" || MCBA.config.options.logo.value === undefined) ? MCBA.rootDir + "images/awm-logo-default.png" : ('images/' + MCBA.config.options.logo.value));

    for ( subkey in MCBA.config.options[ key ] ) {
        option[ subkey ] = MCBA.config.options[ key ][ subkey ];
    }

    option[ 'default' ] = MCBA.config.options[ key ].value ? false : true;

    switch ( key ) {
        case 'logo':
            option.value =
                ( option[ 'default' ] ?
                    MCBA.rootDir + "images/awm-logo-default.png" :
                    logoURL
                );
            break;
    }

    return option;
};

function MCBALoaded() {}




function BackgroundColorProperty( parent ) {
    this.parentObject = parent;

    this.setValue = function ( newColor ) {
        if ( newColor.length == 0 )
            return;
        this.parentObject.leftButtonElement.style.backgroundColor = newColor;
        if ( this.parentObject.rightButtonElement != undefined ) {
            this.parentObject.rightButtonElement.style.backgroundColor = newColor;
        }
        MCBA.config.options.buttonrow.background_color = newColor;
    }
}


function ButtonIconProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newIcon ) {
        this.parentObject.leftButtonElement.className = "mcba_button " + newIcon;
    }
}



function ButtonTextProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newText ) {
        this.parentObject.element[ 0 ].children[ 0 ].children[ 0 ].innerText = newText;
    }
}

/*
 * FontProperty object
 */


function FontProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newFont ) {
        this.parentObject.leftButtonElement.children[ 0 ].style[ "font-family" ] = newFont;
        if ( this.parentObject.rightButtonElement != undefined ) {
            this.parentObject.rightButtonElement.children[ 0 ].style[ "font-family" ] = newFont;
        }
    }
}

/*
 *
 */

function FontSizeProperty( parent ) {

    this.parentObject = parent;

    this.setValue = function ( newFontSize ) {
        this.parentObject.element[ 0 ].children[ 0 ].style.fontSize = newFontSize + "px"; // left button 
        this.parentObject.element[ 0 ].children[ 1 ].style.fontSize = newFontSize + "px"; // right button
    }
}










//!<LeftButtonActionProperty>
/*
#                               ######
#        ######  ######   ##### #     #  #    #   #####   #####   ####   #    #
#        #       #          #   #     #  #    #     #       #    #    #  ##   #
#        #####   #####      #   ######   #    #     #       #    #    #  # #  #
#        #       #          #   #     #  #    #     #       #    #    #  #  # #
#        #       #          #   #     #  #    #     #       #    #    #  #   ##
#######  ######  #          #   ######    ####      #       #     ####   #    #

   #
  # #     ####    #####     #     ####   #    #
 #   #   #    #     #       #    #    #  ##   #
#     #  #          #       #    #    #  # #  #
#######  #          #       #    #    #  #  # #
#     #  #    #     #       #    #    #  #   ##
#     #   ####      #       #     ####   #    #

######
#     #  #####    ####   #####   ######  #####    #####   #   #
#     #  #    #  #    #  #    #  #       #    #     #      # #
######   #    #  #    #  #    #  #####   #    #     #       #
#        #####   #    #  #####   #       #####      #       #
#        #   #   #    #  #       #       #   #      #       #
#        #    #   ####   #       ######  #    #     #       #
*/

function LeftButtonActionProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newAction ) {
        console.log( "setting new action to " + newAction );
    }
}

/*
#######
#        #    #  #####
#        ##   #  #    #
#####    # #  #  #    #
#        #  # #  #    #
#        #   ##  #    #
#######  #    #  #####

#                               ######
#        ######  ######   ##### #     #  #    #   #####   #####   ####   #    #
#        #       #          #   #     #  #    #     #       #    #    #  ##   #
#        #####   #####      #   ######   #    #     #       #    #    #  # #  #
#        #       #          #   #     #  #    #     #       #    #    #  #  # #
#        #       #          #   #     #  #    #     #       #    #    #  #   ##
#######  ######  #          #   ######    ####      #       #     ####   #    #

   #
  # #     ####    #####     #     ####   #    #
 #   #   #    #     #       #    #    #  ##   #
#     #  #          #       #    #    #  # #  #
#######  #          #       #    #    #  #  # #
#     #  #    #     #       #    #    #  #   ##
#     #   ####      #       #     ####   #    #

######
#     #  #####    ####   #####   ######  #####    #####   #   #
#     #  #    #  #    #  #    #  #       #    #     #      # #
######   #    #  #    #  #    #  #####   #    #     #       #
#        #####   #    #  #####   #       #####      #       #
#        #   #   #    #  #       #       #   #      #       #
#        #    #   ####   #       ######  #    #     #       #
*/
//! </LeftButtonActionProperty>








//! </RightButtonActionProperty
/*
######
#     #     #     ####   #    #   #####
#     #     #    #    #  #    #     #
######      #    #       ######     #
#   #       #    #  ###  #    #     #
#    #      #    #    #  #    #     #
#     #     #     ####   #    #     #

######
#     #  #    #   #####   #####   ####   #    #
#     #  #    #     #       #    #    #  ##   #
######   #    #     #       #    #    #  # #  #
#     #  #    #     #       #    #    #  #  # #
#     #  #    #     #       #    #    #  #   ##
######    ####      #       #     ####   #    #

   #
  # #     ####    #####     #     ####   #    #
 #   #   #    #     #       #    #    #  ##   #
#     #  #          #       #    #    #  # #  #
#######  #          #       #    #    #  #  # #
#     #  #    #     #       #    #    #  #   ##
#     #   ####      #       #     ####   #    #

######
#     #  #####    ####   #####   ######  #####    #####   #   #
#     #  #    #  #    #  #    #  #       #    #     #      # #
######   #    #  #    #  #    #  #####   #    #     #       #
#        #####   #    #  #####   #       #####      #       #
#        #   #   #    #  #       #       #   #      #       #
#        #    #   ####   #       ######  #    #     #       #
*/

function RightButtonActionProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newAction ) {
        console.log( "setting new action to " + newAction );
    }
}

/*
#######
#        #    #  #####
#        ##   #  #    #
#####    # #  #  #    #
#        #  # #  #    #
#        #   ##  #    #
#######  #    #  #####

######
#     #     #     ####   #    #   #####
#     #     #    #    #  #    #     #
######      #    #       ######     #
#   #       #    #  ###  #    #     #
#    #      #    #    #  #    #     #
#     #     #     ####   #    #     #

######
#     #  #    #   #####   #####   ####   #    #
#     #  #    #     #       #    #    #  ##   #
######   #    #     #       #    #    #  # #  #
#     #  #    #     #       #    #    #  #  # #
#     #  #    #     #       #    #    #  #   ##
######    ####      #       #     ####   #    #

   #
  # #     ####    #####     #     ####   #    #
 #   #   #    #     #       #    #    #  ##   #
#     #  #          #       #    #    #  # #  #
#######  #          #       #    #    #  #  # #
#     #  #    #     #       #    #    #  #   ##
#     #   ####      #       #     ####   #    #

######
#     #  #####    ####   #####   ######  #####    #####   #   #
#     #  #    #  #    #  #    #  #       #    #     #      # #
######   #    #  #    #  #    #  #####   #    #     #       #
#        #####   #    #  #####   #       #####      #       #
#        #   #   #    #  #       #       #   #      #       #
#        #    #   ####   #       ######  #    #     #       #
*/
//! </RightButtonActionProperty>







function LeftButtonIconCategoryProperty( parent ) {

    this.parentObject = parent;
    this.setValue = function ( newCategory ) {
        let factory = new FontAwesomeSelectElement();
        let selectElement = factory.createElement( newCategory );
        let motherDiv = jQuery( this.parentObject.block.menu.element ).find( "label:contains('Left Button Icon:')" )[ 0 ].parentElement
        let selectDiv = jQuery( motherDiv ).find( 'select' )
        selectElement.onchange = selectDiv[ 0 ].onchange
        selectDiv.replaceWith( selectElement );
    }
}




function LeftButtonIconProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newIcon ) {
        this.parentObject.leftButtonElement.className = "mcba_button " + newIcon;
        this.parentObject.block.item.children[ 12 ].element[ 0 ].children[ 1 ].className = newIcon.split( " " )[ 0 ];
    }
}




function LeftButtonImageProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newImage ) {
        let imagePath = "";
        if ( MCBA.www_url == undefined ) {
            MCBA[ "www_url" ] = "";
            imagePath = "templates/TemplateTwo/images/";
        } else {
            imagePath = "templates/TemplateTwo/images/";
        }
        let left_image_path = MCBA.www_url + imagePath + newImage.trim();
        if ( newImage != 0 ) {
            // this.parentObject.leftButtonElement.style.backgroundImage = 'url(' + left_image_path + ')';
            this.parentObject.leftButtonElement.style[ "background-size" ] = "100% 100%";
            this.parentObject.leftButtonElement.style.color = "rgb(255, 255, 255,0)"; // clear text
        } else {
            // this.parentObject.leftButtonElement.style.backgroundImage = "";
            this.parentObject.leftButtonElement.children[ 0 ].textContent = this.parentObject.getLeftButtonTextAdjustment();
            this.parentObject.leftButtonElement.style.color = this.parentObject.getTextColorAdjustment(); // unclear text
        }
    }
}



function LeftButtonTextProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newText ) {
        this.parentObject.element[ 0 ].children[ 0 ].children[ 0 ].innerText = newText;
    }
}

/*
 *
 */

function LineHeightProperty( parent ) {

    this.parentObject = parent;

    this.setValue = function ( newHeight ) {
        this.parentObject.element[ 0 ].children[ 0 ].style.lineHeight = newHeight.replace( /\D/g, '' ) + "px";
        this.parentObject.element[ 0 ].children[ 1 ].style.lineHeight = newHeight.replace( /\D/g, '' ) + "px";
    }
}



function PropertyObjectFactory( parent ) {

    let self = this;
    self.parentObject = parent;

    this.createPropertyObject = function ( propertyKey ) {
        let object_name = self.getPropertyObjectName( propertyKey );
        let constructor = window[ object_name ];
        if ( !constructor )
            return null;
        let object = new constructor( self.parentObject );
        return object;
    };

    this.capitalizeFirstLetter = function ( string ) {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
    };

    this.getPropertyObjectName = function ( propertyKey ) {
        return self.capitalizeFirstLetter( propertyKey ) + "Property";
    };
}

/*
 *
 */
function RightButtonIconCategoryProperty( parent ) {

    this.parentObject = parent;
    this.setValue = function ( newCategory ) {
        let factory = new FontAwesomeSelectElement();
        let selectElement = factory.createElement( newCategory );
        let motherDiv = jQuery( this.parentObject.block.menu.element ).find( "label:contains('Right Button Icon:')" )[ 0 ].parentElement
        let selectDiv = jQuery( motherDiv ).find( 'select' )
        selectElement.onchange = selectDiv[ 0 ].onchange
        selectDiv.replaceWith( selectElement );
    }
}



function RightButtonIconProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newIcon ) {
        this.parentObject.rightButtonElement.className = "mcba_button " + newIcon;
        this.parentObject.block.item.children[ 14 ].element[ 0 ].children[ 1 ].className = newIcon.split( " " )[ 0 ];
    }
}


function RightButtonImageProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newImage ) {
        let imagePath = "";
        if ( MCBA.www_url == undefined ) {
            MCBA[ "www_url" ] = "";
            imagePath = "TemplateTwo/images/";
        } else {
            imagePath = "images/";
        }
        let right_image_path = MCBA.www_url + imagePath + newImage.trim();
        if ( newImage != 0 ) {
            // this.parentObject.rightButtonElement.style.backgroundImage = 'url(' + right_image_path + ')';
            this.parentObject.rightButtonElement.style[ "background-size" ] = "100% 100%";
            this.parentObject.rightButtonElement.style.color = "rgb(255, 255, 255,0)"; // clear text
        } else {
            // this.parentObject.rightButtonElement.style.backgroundImage = "";
            this.parentObject.rightButtonElement.children[ 0 ].textContent = this.parentObject.getRightButtonTextAdjustment();
            this.parentObject.rightButtonElement.style.color = this.parentObject.getTextColorAdjustment(); // unclear text
        }
    }
}



function RightButtonTextProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newText ) {
        this.parentObject.element[ 0 ].children[ 1 ].children[ 0 ].innerText = newText;
    }
}




function TextColorProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newColor ) {
        if ( newColor.length == 0 )
            return;
        this.parentObject.leftButtonElement.style.color = newColor;
        if ( this.parentObject.rightButtonElement != undefined ) {
            this.parentObject.rightButtonElement.style.color = newColor;
        }
    }
}

/*
 *
 */

function WidthProperty( parent ) {
    this.parentObject = parent;
    this.setValue = function ( newWidth ) {

        if ( this.parentObject.block.item.type == "Singlebutton" ) {
            this.parentObject.element[ 0 ].children[ 0 ].style.width = newWidth + "%";
        } else {
            // validate through input tag max min limits max = 48; 
            this.parentObject.leftButtonElement.style.width = newWidth + "%";
            this.parentObject.rightButtonElement.style.width = newWidth + "%";
            let newMargin = ( 100 - ( newWidth * 2 ) ) / 3;
            this.parentObject.leftButtonElement.style.marginLeft = newMargin + "%";
            this.parentObject.rightButtonElement.style.marginRight = newMargin + "%";
        }
    }
}



function Extender() {}

// Extend an object with an extension
Extender.prototype.extend = function ( extension, obj ) {
    for ( let key in extension ) {
        obj[ key ] = extension[ key ];
    }
};

// The Observer
function Observer() {
    this.update = function () {
        // ...
        alert( "Observer update() method must be implemented." );
        console.log( "*** ERROR: the Observer update() method must be implemented. ***" );
    };
}

function ObserverList() {
    this.observerList = [];
}

ObserverList.prototype.add = function ( obj ) {
    return this.observerList.push( obj );
};

ObserverList.prototype.count = function () {
    return this.observerList.length;
};

ObserverList.prototype.get = function ( index ) {
    if ( index > -1 && index < this.observerList.length ) {
        return this.observerList[ index ];
    }
};

ObserverList.prototype.indexOf = function ( obj, startIndex ) {
    let i = startIndex;

    while ( i < this.observerList.length ) {
        if ( this.observerList[ i ] === obj ) {
            return i;
        }
        i++;
    }

    return -1;
};

ObserverList.prototype.removeAt = function ( index ) {
    this.observerList.splice( index, 1 );
};
let SingleButtonObservable = ( function () {
    function SingleButtonObservable() {
        this.handlers = []; // observers

        this.subscribe = function ( observer ) {
            this.handlers.push( observer );
        };

        this.unsubscribe = function ( observer ) {
            this.handlers = this.handlers.filter(
                function ( item ) {
                    if ( item !== observer ) {
                        return item;
                    }
                }
            );
        };

        this.fire = function ( o, thisObj ) {
            let scope = thisObj || window;
            this.handlers.forEach( function ( item ) {
                item.call( scope, o );
            } );
        }
    }
    let instance;
    return {
        getInstance: function () {
            if ( null == instance ) {
                instance = new SingleButtonObservable();
                instance.constructor = null; // Note how the constructor is hidden to prevent instantiation
            }
            return instance; //return the singleton instance
        }
    };
} )();

function Subject() {
    this.observers = new ObserverList();
}

Subject.prototype.addObserver = function ( observer ) {
    this.observers.add( observer );
};

Subject.prototype.removeObserver = function ( observer ) {
    this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
};

Subject.prototype.notify = function ( context ) {
    let observerCount = this.observers.count();
    for ( let i = 0; i < observerCount; i++ ) {
        this.observers.get( i ).update( context );
    }
};

/** @class GoogleMap */
// class GoogleMap {
//     constructor(map_configuration) {
//         if (!map_configuration) {
//             return;
//         }
//         console.log("constructing GoogleMap... ");
//         this.center_of_map = {
//             lat: parseFloat(map_configuration.latitude),
//             lng: parseFloat(map_configuration.longitude),
//         };
//         this.circle_radius = parseFloat(map_configuration.circle_radius);
//         this.element = document.getElementById("map");
//         if (!this.element) {
//             this.element = document.createElement("div");
//             this.element.setAttribute("id", "map");
//         }
//         this.radius_div = document.createElement("div");
//         this.radius_div.setAttribute("id", "radius");
//         this.radius_div.innerHTML = map_configuration.circle_radius;
//         this.element.appendChild(this.radius_div);
//         this.map = new google.maps.Map(this.element, {
//             zoom: 16,
//             center: this.center_of_map,
//             legend: "none",
//             disableDefaultUI: true,
//             scrollwheel: true,
//         });

//         this.marker = new google.maps.Marker({
//             position: this.center_of_map,
//             map: this.map,
//             draggable: true,
//             title: "Drag me to set your lat/lng.  Grab the circle to set your radius.",
//         });
//         //this.subject = BlockListSubject.getInstance();
//         //this.subject.subscribe( this.update );
//         let labelText = "1";
//         let myOptions = {
//             content: labelText,
//             boxStyle: {
//                 border: "none",
//                 textAlign: "center",
//                 fontSize: "10pt",
//                 width: "50px",
//             },
//             disableAutoPan: true,
//             pixelOffset: new google.maps.Size(-25, -5),
//             position: this.center_of_map,
//             closeBoxURL: "",
//             isHidden: false,
//             pane: "floatPane",
//             enableEventPropagation: true,
//         };

//         let ibLabel = new InfoBox( myOptions );
//         ibLabel.visible = true;
//         // ibLabel.open( this.map );
//         this.initializeEventListeners();
//         setTimeout(() => {
//             this.initializeCircle();
//         }, 500);
//     }

//     initializeEventListeners() {
//         google.maps.event.addListener(this.marker, "dragend", function (event) {
//             document.getElementById("latbox").value = Number(
//                 this.getPosition().lat()
//             ).toFixed(6);
//             document.getElementById("lngbox").value = Number(
//                 this.getPosition().lng()
//             ).toFixed(6);
//         });
//     }

//     initializeCircle() {
//         this.circle = new google.maps.Circle({
//             map: this.map,
//             radius: this.circle_radius,
//             editable: true,
//             strokeColor: "#0000FF",
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: "#00BFFF",
//             fillOpacity: 0.35,
//         });
//         this.circle.bindTo("center", this.marker, "position");
//         google.maps.event.addListener(
//             this.circle,
//             "radius_changed",
//             function () {
//                 console.log(
//                     "*** Radius changed.  might want to do something here... ***"
//                 );
//                 document.getElementById("radius").value =
//                     this.circle.getRadius();
//             }
//         );
//     }

//     update(newData) {
//         if (newData.type != this.constructor.name) {
//             return;
//         }
//     }

//     getSubject() {
//         return this.subject;
//     }
// }
/** end   @class GoogleMap   */
