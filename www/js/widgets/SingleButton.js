/** class SingleButton */
function Singlebutton( item ) {
    let self = this;
    self.item = item;
    self.propertyObjects = new Object();
    
    let mirror_global = true;
    this.width = 0;
    let factory = new PropertyObjectFactory( this );
    for ( let key in item ) {
        if ( item.hasOwnProperty( key )) { // use snake case for keys, camel case for live objects.
            self.propertyObjects[ key ] = factory.createPropertyObject( key.replace( /(\_\w)/g, function ( k ) {
                return k[ 1 ].toUpperCase();
            }));
        }
    }

    this.update = function ( triggeringObject ) {
        if ( this == self ) {
            let propertyObject = self.propertyObjects[ triggeringObject.model.name ];
            if ( propertyObject == null ) {
                console.error( "*** ERROR: \"" + factory.capitalizeFirstLetter( triggeringObject.model.name.replace( /(\_\w)/g, function ( k ) {
                        return k[ 1 ].toUpperCase();
                    })) +
                    "Property\" object can not be found or it could be that it just doesn't exist. ***" );
                return;
            }
            propertyObject.setValue( triggeringObject.data[ triggeringObject.model.name ] );
        }
    };

    this.updatePageItems = function ( key, value ) {
        MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ key ] = value;
        if ( mirror_global ) {
            for ( const item in MCBA.pageItems ) {
                if ( MCBA.pageItems.hasOwnProperty( item )) {
                    const pageItem = MCBA.pageItems[ item ];
                    if ( pageItem.type.toLocaleLowerCase() == this.constructor.name.toLocaleLowerCase()) { // if singlebutton
                        const element = MCBA.pageItems[ item ];
                        MCBA.config.options[ this.constructor.name.toLocaleLowerCase() ][ key ] = value;
                        element.element[ 0 ].firstChild.style[ key ] = value; //set element value here!
                        element.item[ key ] = value.replace( /\D/g, '' );
                        let children = pageItem.children;
                        for ( const child in children ) {
                            if ( children.hasOwnProperty( child )) {
                                const menu_element = children[ child ];
                                if ( menu_element.model.name == key ) {
                                    if ( key == "width" ) {
                                        menu_element.element[ 0 ].children[ 1 ].setAttribute( "value", value.replace( /\D/g, '' ));
                                        menu_element.element[ 0 ].children[ 1 ].value = value.replace( /\D/g, '' );
                                    } else if ( key == "background_color" ) {
                                        menu_element.element.children[ 1 ].setAttribute( "value", value );
                                        menu_element.element.children[ 1 ].value = value;
                                    } else if ( key == "text_color" ) {
                                        menu_element.element.children[ 1 ].setAttribute( "value", value );
                                        menu_element.element.children[ 1 ].value = value;
                                    } else if ( key == "lineHeight" ) {
                                        menu_element.element[ 0 ].children[ 1 ].setAttribute( "value", value.replace( /\D/g, '' ));
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

    this.getLeftButtonTextAdjustment = function () {
        return self.block.menu.children[ 2 ].getElementValue();}

    this.getTextColorAdjustment = function ( buttonText ) {
        return self.block.menu.children[ 4 ].getElementValue();}

    let logoURL = MCBA.getOption( 'logo' ).value;
    let pageColor = ( MCBA.config.pages[ MCBA.currentPage ].pageColor ? MCBA.config.pages[ MCBA.currentPage ].page_color : MCBA.config.options.page_color.value );

    let buttonColor = "000000";
    if ( mirror_global ) {
        buttonColor = MCBA.config.options.singlebutton.background_color;
    } else {
        if ( item.backgroundColor != undefined ) {
            if ( item.backgroundColor.length > 0 ) {
                buttonColor = item.backgroundColor;
            }
        }
    }

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

    let buttonText = MCBA.config.options.singlebutton.text;
    if ( item.button_text != undefined ) {
        if ( item.button_text.length != 0 ) {
            buttonText = item.button_text; }}

    let leftMargin = "6px";
    let rightMargin = "10px";

    if ( item.leftMargin != undefined ) {  leftMargin = item.leftMargin + "%";}
    if ( item.rightMargin != undefined ) { rightMargin = item.rightMargin + "%";}
    if ( item.font != undefined ) {        font = item.font;}
    let left_image_path = "";
    if ( MCBA.www_url != undefined ) {
        left_image_path = MCBA.www_url + 'images/' + item.left_button_image?.trim();
    } else { left_image_path = 'images/' + item.left_button_image?.trim();}
    let leftButton = new CustomButton({
            'img': left_image_path,
            'width': buttonWidth,
            'lineHeight': lineHeight,
            'background': buttonColor,
            'color': MCBA.config.options.singlebutton.text_color,
            'buttonText': buttonText,
            'font_family': item.font,
            'left_button_icon': item.button_icon,
            'font_size': item.font_size,
            'margin_left': "16%",
            'action': item.action });
    if ( leftButton.element.css == undefined ) {
        console.log( "*** Warning: leftButton.element.css is undefined. ***" );
    } else { leftButton.element.css({ 'margin-left': 'auto',
                                  'margin-right': 'auto',
                                  'background': buttonColor,
                                  'color': MCBA.config.options.singlebutton.text_color,}); }    

    this.leftButtonElement = leftButton.element[ 0 ];

    this.element = jQuery( document.createElement( 'div' ))
        .attr({
            id: 'header'
        })
        .css({
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
        }).append( leftButton );

    if (( left_image_path.search( ".png" ) > 0 ) || ( left_image_path.search( ".jpg" ) > 0 )) {
        // this.leftButtonElement.style.backgroundImage = 'url(' + left_image_path + ')';
        this.leftButtonElement.style[ "background-size" ] = "100% 100%";
        this.leftButtonElement.style.color = "rgb(255, 255, 255,0)";} // that last 0 sets opacity to invisible
    this.getSubject = function () { return this.subject;}
    this.subject = BlockListSubject.getInstance();
    this.subject.subscribe( self.update ); 
    this.element.append( this.leftButtonElement ); }
