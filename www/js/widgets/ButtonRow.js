// path: ... /wordpress/wp-content/plugins/MCBA-Wordpress/www/js/widgets/ButtonRow.js
/** class Buttonrow */
function Buttonrow( item ) {
    console.log( "just inside Buttonrow class." )
    let self = this;
    self.item = item;
    self.propertyObjects = new Object();

    let factory = new PropertyObjectFactory( this );
    console.log( "creating property objects for var key in item..." );
    for ( var key in item ) {
        if ( item.hasOwnProperty( key ) ) { // use snake case for keys and camel case for live objects.
            self.propertyObjects[ key ] = factory.createPropertyObject( key.replace( /(\_\w)/g, function ( k ) {
                return k[ 1 ].toUpperCase();
            } ) );
        }
    }

    console.log( "defining the update function..." );
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

    if ( MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ "width" ] != undefined )
        var button_width = MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ "width" ];
    else
        button_width = "45%";

    if ( item.lineHeight != undefined )
        button_height = item.lineHeight + "px";
    else if ( MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ "lineHeight" ] != undefined )
        var button_height = MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ "lineHeight" ];
    else
        button_height = "40px";

    var buttonColor = "0000ff";
    if ( item.background_color != undefined )
        buttonColor = item.background_color;

    var left_image_path = "";
    var right_image_path = "";

    var left_image_path, right_image_path;

    if ( MCBA.www_url !== undefined ) {
        left_image_path = MCBA.www_url + 'images/' + ( item.left_button_image ? item.left_button_image.trim() : '' );
        right_image_path = MCBA.www_url + 'images/' + ( item.right_button_image ? item.right_button_image.trim() : '' );
    } else {
        left_image_path = 'images/' + ( item.left_button_image ? item.left_button_image.trim() : '' );
        right_image_path = 'images/' + ( item.right_button_image ? item.right_button_image.trim() : '' );
    }

    console.log( "creating left button.  this calls the CustomButton constructor..." );
    var leftButton = new CustomButton( {
        'img': left_image_path,
        'width': button_width,
        'lineHeight': button_height,
        'background': buttonColor,
        'buttonText': self.item.left_button_text,
        'font_family': self.item.font,
        'left_button_icon': self.item.left_button_icon,
        'action': self.item.left_button_action,
        'font_size': self.item.font_size,
        'margin_left': "3.33333%",
        'id': self.item_left_button_text
    });
    
    if ( leftButton.element.style == undefined ) {
        console.log( "*** Warning: leftButton.element.style is undefined. ***" );
    } else {
        leftButton.element.style.float = 'left';
        leftButton.element.style.marginLeft = '3.33333%';
        this.leftButtonElement = leftButton.element; }

    console.log( "creating right button.  this calls the CustomButton constructor..." );
    let rightButton = new CustomButton( {
        'img': right_image_path,
        'width': button_width,
        'lineHeight': button_height,
        'background': buttonColor,
        'buttonText': self.item.right_button_text,
        'font_family': self.item.font,
        'font_size': self.item.font_size,
        'left_button_icon': self.item.right_button_icon,
        'action': self.item.right_button_action,
        'margin_right': "3.33333%"
    });
    
    if ( rightButton.element.style == undefined ) {
        console.log( "*** Warning: rightButton.element.style is undefined. ***" );
    } else {
        rightButton.element.style.float = 'right';
        rightButton.element.style.marginLeft = '3.33333%';
        this.rightButtonElement = rightButton.element; }

    this.element = document.createElement( 'div' );
    this.element.setAttribute( 'id', 'header' );
    this.element.style.position = 'relative';
    this.element.style.textAlign = 'center';
    this.element.style.marginTop = '0';
    this.element.style.marginBottom = '0';
    this.element.style.paddingTop = '5px';
    this.element.style.paddingBottom = '6px';
    this.element.style.backgroundRepeat = 'repeat-x';
    this.element.style.backgroundPosition = 'center bottom';
    this.element.style.zIndex = '100';
    this.element.style.overflow = 'auto';
    this.element.style.width = '100%';
    this.element.append( leftButton.element );
    this.element.append( rightButton.element );
    self.subject = BlockListSubject.getInstance();
    self.subject.subscribe( self.update );
    console.log( "defining the this.getSubject() function..." );

    this.getSubject = function () { return self.subject; }

    console.log( "done defining the ButtonRow class." );
}

