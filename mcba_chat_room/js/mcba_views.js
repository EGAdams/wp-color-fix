var cssFontSelect = document.createElement( "link" );
cssFontSelect.rel = "stylesheet";
cssFontSelect.type = "text/css";
cssFontSelect.href = "fontselect.css";

var baseColor = "#ffffff";
function milliseconds_since_epoch() { return Math.floor( Date.now()) }


function ActionSelectElement() {

    this.createElement = function () {
        var selectElement = document.createElement( "select" );

        var options = [];
        var chat = Object();
        chat.value = "mcba://chat";
        chat.text = "Ask the Expert";
        options.push( chat );

        var rewards = Object();
        rewards.value = "mcba://rewards";
        rewards.text = "Rewards";
        options.push( rewards );

        var coordinates = Object();
        coordinates.value = MCBA.config.options.google_map_address.value;
        coordinates.text = "Map Coordinates";
        options.push( coordinates );

        var phone = Object();
        phone.value = "tel:" + MCBA.config.options.phone.value;
        phone.text = "Phone Link";
        options.push( phone );

        var website = Object();
        website.value = MCBA.config.options.website.value;
        website.text = "Website Link";
        options.push( website );

        for ( let index = 0; index < options.length; index++ ) {
            const value = options[ index ].value;
            const text = options[ index ].text;
            var optionElement = document.createElement( "option" );
            optionElement.value = value;
            optionElement.text = text;
            selectElement.appendChild( optionElement );
        }
        return selectElement;
    }
}

function BasicFontSelectElement() {

    this.createElement = function () {
        var selectElement = document.createElement( "select" );

        var options = [ "none",
            "Arial",
            "Book Antiqua",
            "Charcoal",
            "Comic Sans MS",
            "Courier",
            "Courier New",
            "cursive",
            "fantasy",
            "Gadget",
            "Geneva",
            "Georgia",
            "Helvetica",
            "Impact",
            "Luicida Grande",
            "Lucida Console",
            "Lucida Sans Unicode",
            "Monaco",
            "monospace",
            "Palatino",
            "Palatino Linotype",
            "sans-serif",
            "serif",
            "Tahoma",
            "Times",
            "Times New Roman",
            "Trebuchet MS",
            "Verdana"
        ];

        for ( var index = 0; index < options.length; index++ ) {
            var element = options[ index ];
            var optionElement = document.createElement( "option" );
            optionElement.value = element;
            optionElement.text = element;
            selectElement.appendChild( optionElement );
        }

        return selectElement;
    };
};



function FontAwesomeSelectElement() {
    this.createElement = function ( initialCategoryArg ) {
        this.iconCategory = initialCategoryArg;
        var selectElement = document.createElement( "select" );
        var icons = MCBA.icons;
        var iconCategories = MCBA.iconCategories;
        if ( iconCategories[ this.iconCategory ] == undefined ) {
            console.log( "*** ERROR: iconCategories[ this.iconCategory ] = undefined ***" );
        }
        for ( var icon in icons ) {
            if ( iconCategories[ this.iconCategory ].icons.includes( icon )) {
                if ( icons.hasOwnProperty( icon )) {
                    for ( var i = 0; i < icons[ icon ].styles.length; i++ ) {
                        var style = icons[ icon ].styles[ i ];
                        var iconName = icon;
                        var optionElement = document.createElement( "option" );
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
        var optionElement = document.createElement( "option" );
        optionElement.innerHTML = "-- Select icon from category " + this.iconCategory + " --";
        selectElement.prepend( optionElement );
        selectElement.selectedIndex = 0;
        return selectElement;
    };

    this.setIconCategory = function ( categoryArg ) {
        this.iconCategory = categoryArg;
    }
};


function FontAwesomeCategorySelectElement() {
    this.createElement = function () {
        var selectElement = document.createElement( "select" );
        var iconCategories = MCBA.iconCategories;
        for ( var category in iconCategories ) {
            if ( iconCategories.hasOwnProperty( category )) {
                var optionElement = document.createElement( "option" );
                optionElement.value = category;
                optionElement.innerText = category;
                selectElement.appendChild( optionElement );
            }
        }
        return selectElement;
    }
};

function ImagePositionSelectElement() {

    this.createElement = function () {
        var selectElement = document.createElement( "select" );
        var options = [ "Left", "Right", "Center" ];
        for ( var index = 0; index < options.length; index++ ) {
            var element = options[ index ];
            var optionElement = document.createElement( "option" );
            optionElement.value = element;
            optionElement.text = element;
            selectElement.appendChild( optionElement );
        }
        return selectElement;
    }
}

/*
 *
 */
function SelectElementFactory( configArg ) {

    this.config = configArg

    if ( this.config.model.config.factory == undefined ) {
        var errorMessage = "*** ERROR: SelectElementFactory called with invalid configuration argument! ***"
        console.error( errorMessage );
        throw ( errorMessage );
    }

    this.createElement = function () {
        var constructor = window[ this.selectElementName ];
        if ( !constructor ) {
            console.error( "*** ERROR: " + this.selectElementName + " object can not be found or it could be that it just doesn't exist. ***" );
            return null;
        }

        var object = new constructor();
        return object.createElement( this.getSelectCategory());
    };

    this.capitalizeFirstLetter = function ( string ) { return string.charAt( 0 ).toUpperCase() + string.slice( 1 ); };
    this.selectElementName = this.capitalizeFirstLetter( this.config.model.config.factory.replace( /(\_\w)/g, function ( k ) { return k[ 1 ].toUpperCase(); }));

    this.getSelectCategory = function () {
        for ( var key in this.config.item.item ) {
            if ( this.config.item.item.hasOwnProperty( key )) {
                if ( key.includes( this.config.model.name )) {
                    if ( key.includes( "category" )) {
                        return this.config.data[ key ];
                    }
                }
            }
        }
        return null;
    };
}

function PageMenu( page ) {
    this.element = jQuery( document.createElement( 'div' ))
        .append(
            jQuery( document.createElement( 'div' ))
                .attr({
                    'id': 'mcba-page-options',
                })
                .css({
                    'padding-top': '15px',
                    'background-color': '#ffffff',
                    'height': jQuery( '#mcba_item_overview' ).height() / 3 + 'px',
                })
                .hover(
                    function () {},
                    function () {
                        jQuery( this ).data( 'sliding', true );
                        jQuery( this ).stop( true, true ).slideUp( 'medium',
                            function () {
                                jQuery( this ).data({
                                    'sliding': false,
                                    'open': false
                                });
                            })
                    }
                )
                .append(
                    jQuery( document.createElement( 'ul' ))

                        /* Delete Page */
                        .append(
                            jQuery( document.createElement( 'li' ))
                                .append(
                                    jQuery( document.createElement( 'table' ))
                                        .css({
                                            'width': '95%',
                                            'margin': 'auto',
                                        })
                                        .append(
                                            jQuery( document.createElement( 'tr' ))
                                                .append(
                                                    jQuery( document.createElement( 'td' ))
                                                        .click( function () {
                                                            var response = confirm( "Delete this page?" );
                                                            if ( response == true ) {
                                                                // Remove from mockup
                                                                MCBA.config.pages.splice( MCBA.currentPage, 1 );
                                                                MCBA.load( MCBA.config, 0 );
                                                            }

                                                        })
                                                        .hover(
                                                            function () {
                                                                jQuery( this ).css({
                                                                    'background-color': shade( '#FF0000', 60 )
                                                                });
                                                            },

                                                            function () {
                                                                jQuery( this ).css({
                                                                    'background-color': 'red'
                                                                });
                                                            }
                                                        )
                                                        .append( "Delete" )
                                                        .append(
                                                            jQuery( document.createElement( 'img' ))
                                                                .attr({
                                                                    'src': root_url + 'www/images/trash.png',
                                                                })
                                                        )
                                                        .append( "Page" )
                                                        .css({
                                                            'color': 'white',
                                                            'font-size': '14pt',
                                                            'text-align': 'center',
                                                            'background-color': 'red',
                                                            'cursor': 'pointer',
                                                            'width': '100%'
                                                        })
                                                )
                                        )
                                )
                        )

                        /* Page Name */
                        .append(
                            jQuery( document.createElement( 'li' ))
                                .append(
                                    jQuery( document.createElement( 'div' ))
                                        .append(
                                            jQuery( document.createElement( 'label' ))
                                                .attr({
                                                    'for': 'mcba-page-name',
                                                })
                                                .css({
                                                    'float': 'left',
                                                    'padding-right': '10px',
                                                })
                                                .text( "Page Name" )
                                        )
                                        .append(
                                            jQuery( document.createElement( 'input' ))
                                                .attr({
                                                    'id': 'mcba-page-name',
                                                    'type': 'text',
                                                    'class': 'large-text mcba_option',
                                                    'value': MCBA.config.pages[ MCBA.currentPage ].title,
                                                })
                                                .css({
                                                    'float': 'left',
                                                    'max-width': '50%',
                                                })
                                                .keyup( function ( event ) {
                                                    MCBA.config.pages[ MCBA.currentPage ].title = jQuery( event.currentTarget ).val();
                                                })
                                        )
                                )
                        )
                        .append(
                            jQuery( document.createElement( 'div' ))
                                .css({
                                    'clear': 'both',
                                })
                        )

                        .append(
                            jQuery( document.createElement( 'div' ))
                                .css({
                                    'clear': 'both',
                                })
                        )
                )
                .hide()
        )
        .append(
            jQuery( document.createElement( 'div' ))
                .attr({
                    'id': 'mcba-page-options-rollover',
                })
                .css({
                    'background-color': '#123456',
                    'height': '30px',
                    'color': '#ffffff',
                    'text-align': 'center',
                    'padding-top': '5px',
                })
                .hover(  // changed from hover!  TODO: change back?  This is annoying!
                    function () {
                        if ( !jQuery( '#mcba-page-options' ).data( 'open' )) {
                            jQuery( '#mcba-page-options' ).data( 'sliding', true );
                            jQuery( '#mcba-page-options' ).stop( true, true ).slideDown( 'medium', function () {
                                jQuery( '#mcba-page-options' ).data({
                                    'sliding': false,
                                    'open': true,
                                });
                            });
                        }
                    },
                    function () {}
                )
                .append( "Page Options" )
        )
}


//! <Block> 
/*
######
#     #  #        ####    ####   #    #
#     #  #       #    #  #    #  #   #
######   #       #    #  #       ####
#     #  #       #    #  #       #  #
#     #  #       #    #  #    #  #   #
######   ######   ####    ####   #    #
*/
function Block( /* PageItem || String */ data ) {

    var block = this;
    var from = "";
    var cssClass = 'mcba_block_action ';
    this.unknown = false;
    this.menu = null;
    this.deleteButton = null;

    this.createDeleteButton = function () {
        return jQuery( document.createElement( 'td' ))
            .css({
                'text-align': 'right',
            })
            .append(
                jQuery( document.createElement( 'div' ))
                    .css({
                        'display': 'inline',
                        'margin-right': '9px',
                        'width': '33%',
                        'background-color': 'transparent',
                    })
                    .hover(
                        function () {
                            jQuery( this ).css({
                                'background-color': shade( '#FF0000', 60 )
                            });
                        },

                        function () {
                            jQuery( this ).css({
                                'background-color': 'transparent'
                            });
                        }
                    )
                    .append(
                        jQuery( document.createElement( 'img' ))
                            .attr({
                                'src': root_url + 'www/images/X.png',
                            })
                            .css({
                                'height': '20px',
                                'margin-left': 'auto',
                                'margin-right': 'auto',
                                'cursor': 'pointer',
                            })
                            .click( function () {
                                block.item.remove();
                            })
                    )
            );
    }
    this.deleteButton = this.createDeleteButton();

    if ( typeof data === "string" ) {  /* create the widget toolbox in the right column */

        // From toolbox
        this.item = MCBA.getDefaultItem( data );
        from = 'from_toolbox';

    } else {  /* create a block that already exists */

        // From config
        this.item = data;
        if ( this.item.template[ 'has-options' ] != false ) {
            this.menu = new BlockMenu( this );
        }
        data.object[ "block" ] = this;
    }


    if ( this.item.template[ 'has-options' ] == false ) cssClass = 'mcba_block_no_action ';

    //! TODO: update item  // i think this is the right place...
    if ( this.item.object != null ) {
        if ( typeof this.item.object.update === "function" ) {
            //! this.item.object.update();
        }
    }

    /* Create the block div */
    this.element = jQuery( document.createElement( 'div' ))
        .attr({
            'id': 'item_' + block.item.type.toLowerCase(),
            'class': 'mcba_block ' + from,
        })
        .data({
            'block': block
        })
        .css({
            'background': block.item.template.color
        })
        .hover(
            /* Hover over */
            function () {
                if ( Object.keys( jQuery(this).data()).length > 0 )
                    highlightMockup( jQuery( this ).data( 'block' ).item.element, true );
                jQuery( this )
                    .css({
                        'cursor': 'move',
                        "border-color": "#000000"
                    });
            },

            /* Hover leave */
            function () {
                if ( Object.keys( jQuery(this).data()).length > 0 )
                    highlightMockup( jQuery( this ).data( 'block' ).item.element, false );
                jQuery( this )
                    .css({
                        'cursor': 'auto',
                        "border-color": "#E6E6E6"
                    });
            }
        )
        .append(
            jQuery( document.createElement( 'table' ))
                .css({
                    height: '100%',
                    width: '100%'
                })
                .click(
                    ( function () {
                        if ( block.menu )
                            return function () {
                                block.menu.open();
                            };
                    })()
                )
                .append(
                    jQuery( document.createElement( 'tr' ))
                        .append(
                            jQuery( document.createElement( 'td' ))
                                .append(
                                    jQuery( document.createElement( 'div' ))
                                        .attr({
                                            'class': cssClass + from,
                                        })
                                )
                                .append(
                                    jQuery( document.createElement( 'h4' ))
                                        .attr({
                                            'class': 'mcba_block_title ',
                                        })
                                        .text( block.item.type )
                                )
                        )
                        .append(
                            ( block.deleteButton ? block.deleteButton : "" )
                        )
                )
        );

    if ( this.menu ) {
        jQuery( this.element )
            .append(
                this.menu.element
            );
    }

    this.hover = function ( inEvent, outEvent ) {
        this.element.hover( inEvent, outEvent );
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
#     #  #        ####    ####   #    #
#     #  #       #    #  #    #  #   #
######   #       #    #  #       ####
#     #  #       #    #  #       #  #
#     #  #       #    #  #    #  #   #
######   ######   ####    ####   #    #
*/
//! </Block>










//! <BlockList>
/*

######                                   #
#     #  #        ####    ####   #    #  #          #     ####    #####
#     #  #       #    #  #    #  #   #   #          #    #          #
######   #       #    #  #       ####    #          #     ####      #
#     #  #       #    #  #       #  #    #          #         #     #
#     #  #       #    #  #    #  #   #   #          #    #    #     #
######   ######   ####    ####   #    #  #######    #     ####      #

*/
function BlockList( pageitems ) {

    var self = this;
    this.count = 0;
    this.length = this.count;
    this.blocks = [];
    this.sortStart = -1;

    this.element = jQuery( document.createElement( 'ul' ))
        .attr({
            'id': 'BlockList',
        })
        .css({
            'margin': '0px',
        })
        //.sortable({
        //     'revert': true,
        //     'helper': 'clone',
        //     'placeholder': "ui-state-highlight",
        //     'sort': function (event, ui) {},
        //     'start': function (event, ui) {
        //         self.sortStart = ui.item.index();
        //     },
        //     'stop': function (event, ui) {
        //         self.sortStart = -1;
        //     },
        //     'update': function (event, ui) {
        //         // Move item 
        //         var newPos = ui.item.index();
        //         var pageItems = MCBA.config.pages[MCBA.currentPage].items;

        //         if (self.sortStart > -1) {
        //             while (self.sortStart < 0) {
        //                 self.sortStart += pageItems.length;
        //             }
        //             while (newPos < 0) {
        //                 newPos += pageItems.length;
        //             }
        //             if (newPos >= pageItems.length) {
        //                 var k = newPos - pageItems.length;
        //                 while ((k--) + 1) {
        //                     pageItems.push(undefined);
        //                 }
        //             }
        //             pageItems.splice(newPos, 0, pageItems.splice(self.sortStart, 1)[0]); // move to new position
        //             MCBA.load();
        //         }

        //     },
        // })
        ; // <------------------------ dont delete me please ---------------------------<<

    this.addBlock = function ( block ) {
        this.blocks.push( block );
        if ( block instanceof Block ) {
            block = block.element;
        }

        this.element
            .append(
                jQuery( document.createElement( 'li' ))
                    .append( block )
            );
        this.count++;
        this.length = this.count;
    };

    for ( var i = 0; i < pageitems.length; i++ ) {
        var pageItem = pageitems[ i ];
        var block = new Block( pageItem );

        /*
         *  put children into page item!  
         *  we will need this pointer so that
         *  the menu item input values can be
         *  changed to reflect current settings.
         */
        if ( block.menu != undefined ) {
            pageitems[ i ].children = block.menu.children;
        }

        jQuery( block.element ).attr( 'id', jQuery( block.element ).attr( 'id' ) + i );
        this.addBlock( block );
    }


    this.hideAllMenus = function () {
        for ( var i = 0; i < this.blocks.length; i++ ) {
            if ( this.blocks[ i ].menu != null )
                this.blocks[ i ].menu.hide();
        }
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

######                                  #
#     #  #        ####    ####   #    # #           #     ####    #####
#     #  #       #    #  #    #  #   #  #           #    #          #
######   #       #    #  #       ####   #           #     ####      #
#     #  #       #    #  #       #  #   #           #         #     #
#     #  #       #    #  #    #  #   #  #           #    #    #     #
######   ######   ####    ####   #    # #######     #     ####      #
*/
//! </ BlockList>










//!<BlockMenu>
/*
######                                  #     #
#     #  #        ####    ####   #    # ##   ##  ######  #    #  #    #
#     #  #       #    #  #    #  #   #  # # # #  #       ##   #  #    #
######   #       #    #  #       ####   #  #  #  #####   # #  #  #    #
#     #  #       #    #  #       #  #   #     #  #       #  # #  #    #
#     #  #       #    #  #    #  #   #  #     #  #       #   ##  #    #
######   ######   ####    ####   #    # #     #  ######  #    #   ####
*/
function BlockMenu( block ) {

    var self = this;
    this.isOpen = false;
    this.block = block;
    this.children = [];
    this.element = jQuery( document.createElement( 'div' ))
        .attr({
            'id': 'edit_menu',
            'class': 'mcba_item_menu',
        })
        .data( 'block', block )
        .data( 'menu', self )
        .append(
            /* Editor Window */
            jQuery( document.createElement( 'table' ))
                .css({
                    'width': '95%',
                    'margin': '15px auto',
                })
        );

    var table = this.element.find( 'table' );
    if ( this.block.unknown === true ) {
        return;
    }

    /* Build each item */
    for ( var i = 0; i < self.block.item.template.items.length; i++ ) {

        var model = self.block.item.template.items[ i ];

        if ( model.name == "left_button_icon_category" && self.block.item.item.left_button_icon_category.length == 0 ) {
            var errorMessage = "*** ERROR: left button icon category is blank! ***";
            console.error( errorMessage ); }

        var constructor = getMatchingItem( model.type );
        var newItem = new constructor({
            'item': self.block.item,
            'model': model,
            'data': self.block.item.item,
        });

        this.children.push( newItem );

        table.append(
            jQuery( document.createElement( 'tr' ))
                .append(
                    jQuery( document.createElement( 'td' ))
                        .append(
                            newItem.element
                        )
                )
        );
    };
    table.append(
        jQuery( document.createElement( 'tr' ))
            .append(
                jQuery( document.createElement( 'td' ))
                    .append(
                        jQuery( document.createElement( 'div' ))
                            .attr({
                                'class': 'mcba_action_links ',
                            })
                            .append(
                                jQuery( document.createElement( 'a' ))
                                    .attr({
                                        'href': '#',
                                        'class': 'widget-control-remove ',
                                    })
                                    .append( 'Delete' )
                                    .click( function () {
                                        block.item.remove();
                                    })
                            )
                            .append( " | " )
                            .append(
                                jQuery( document.createElement( 'a' ))
                                    .attr({
                                        'href': '#',
                                        'class': 'widget-control-close ',
                                    })
                                    .append( 'Close' )
                                    .click( function () {
                                        block.menu.hide();
                                    })
                            )
                    )
            )
    );

    this.hide = function ( time ) {
        if ( typeof time !== 'undefined' ) {
            jQuery( self.element ).hide( parseInt( time ));
        } else {
            jQuery( self.element ).hide( 0 );
        }
        var menu = jQuery( this ).data( 'menu' );
        jQuery( self.element ).parent().removeClass( 'open' );
        this.isOpen = false;
    }

    this.initialize = function () {
        for ( let index = 0; index < self.children.length; index++ ) {
            const menu_item = self.children[ index ];
            if ( typeof menu_item.initialize === "function" ) {
                menu_item.initialize();
            }

        }
    }

    this.open = function () {
        jQuery( "[id^=edit_menu]" ).each( function () {
            var menu = jQuery( this ).data( 'menu' );
            if ( menu === self && menu.isOpen === false ) {
                jQuery( menu.element ).show({
                    'duration': 300,
                });
                self.initialize();
                jQuery( menu.element ).parent().addClass( 'open' );
                menu.isOpen = true;
                return;
            }
            menu.hide( 300 );
        });

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

######                                  #     #
#     #  #        ####    ####   #    # ##   ##  ######  #    #  #    #
#     #  #       #    #  #    #  #   #  # # # #  #       ##   #  #    #
######   #       #    #  #       ####   #  #  #  #####   # #  #  #    #
#     #  #       #    #  #       #  #   #     #  #       #  # #  #    #
#     #  #       #    #  #    #  #   #  #     #  #       #   ##  #    #
######   ######   ####    ####   #    # #     #  ######  #    #   ####
*/
//! </ BlockMenu>










function OptionItem( key ) {
    var option = MCBA.getOption( key );
    this.row = jQuery( document.createElement( 'tr' ))
        .append(
            jQuery( document.createElement( 'td' ))
                .append( option[ 'text' ] )
        );

    switch ( option[ 'type' ] ) {
        case "color":
            const thisColor = '#color_' + key;
            /* Make clickable color block */
            jQuery( document.createElement( 'td' ))
                .append( jQuery( document.createElement( 'div' ))
                    .attr({
                        'id': 'color_' + key,
                        'name': option.value,
                        'value': option.value
                    })
                    .css({
                        'border-width': '1px',
                        'border-style': 'solid',
                        'cursor': 'pointer',
                        'width': '30px',
                        'height': '30px',
                        'background': option.value,
                    })
                    .on( 'change', {}, function ( arg, tid, color ) {
                        setOption( tid, color );
                    })
                    .addClass( 'mcba_color_picker' )
                )
                .click( function () {
                    var newOption = {
                        'text': option.text,
                        'type': option.type,
                        'value': jQuery( '#color_' + key ).attr( 'name' )
                    };
                })
                .hover(
                    function () {
                        jQuery( this ).parent().css({
                            'background': '#02b2e3'
                        });
                    },
                    function () {
                        jQuery( this ).parent().css({
                            'background': ''
                        });
                    })
                .appendTo( this.row );
            break;

        case "text":
            /* Make Text box and save button */
            jQuery( document.createElement( 'td' ))
                .append(
                    jQuery( document.createElement( 'input' ))
                        .attr({
                            'id': 'text_' + key,
                            'type': 'text',
                            'class': 'large-text mcba_option',
                            'value': option[ 'value' ],
                        })
                        .change( function () {
                            // This will be called when the text box looses focus
                            setOption( key, jQuery( this ).val());
                        })
                )
                .appendTo( this.row );
            break;

        case "file":
            /* Make text with file and open dialog button */
            jQuery( document.createElement( 'td' ))
                .append(
                    jQuery( document.createElement( 'input' ))
                        .attr({
                            'id': 'file_' + key,
                            'type': 'image',
                            'src': www_url + option.value,
                        })
                        .css({
                            'max-width': '50%',
                            'max-height': '100px'
                        })
                        .click( function () {
                            // OPEN THE FILE PICKER
                            //openFilepicker(key, option);
                        })
                        .hover(
                            function () {
                                jQuery( this ).parent().parent().css({
                                    'background': '#02b2e3'
                                });
                            },
                            function () {
                                jQuery( this ).parent().parent().css({
                                    'background': ''
                                });
                            }
                        )
                )
                .appendTo( this.row );

            jQuery( document.createElement( 'td' ))
                .append(
                    jQuery( document.createElement( 'input' ))
                        .attr({
                            'id': 'file_' + key + '_default',
                            'type': 'button',
                            'value': 'Default',
                            'class': 'button-primary',
                        })
                        .click( function () {
                            setOption( key, "" );
                            jQuery( '#file_' + key )
                                .attr( 'src', www_url + MCBA.getOption( key ).value );

                            jQuery( '#file_' + key + '_default' )
                                .prop( 'disabled', true );
                        })
                        .prop( 'disabled', option[ 'default' ] )
                        .hover(
                            function () {
                                jQuery( this ).parent().parent().css({
                                    'background': '#02b2e3'
                                });
                            },
                            function () {
                                jQuery( this ).parent().parent().css({
                                    'background': ''
                                });
                            }
                        )
                )
                .appendTo( this.row );
            break;
    }
}

function TextItem_old( item ) {
    var self = this;
    this.data = item.data;
    this.model = item.model;
    this.item = item.item;
    this.id = 'textitem' + Date.now();

    var codeWithNewId = window.mcba_editor;
    var newId = this.id + 'a';

    /*
     * so we can pull it out later.  text items
     * could be used for something else besides
     * a button.  when the change event is fired,
     * we pull this item from the page items
     * array to find out what type it is.
     */
    item.item.id = newId;

    codeWithNewId = codeWithNewId.replaceAll( 'mcba_this_current_id', newId );
    this.element = document.createElement( 'div' );
    var editorContainer = document.createElement( 'div' );
    editorContainer.id = "editor_container_" + this.id;
    codeWithNewIdHtml = jQuery.parseHTML( codeWithNewId );
    editorContainer.append( codeWithNewIdHtml[ 0 ] );
    this.element.append( editorContainer );

    function textChangeEvent( event ) {
        var value = jQuery( event.currentTarget ).val();
        self.data[ self.model.name ] = value;
        self.item.refresh();
    }

    setTimeout( function () {
        var newId = self.id + 'a_ifr';
        jQuery( '#' + self.id + 'a_ifr' ).contents().find( "body" ).html( self.data[ self.model.name ] );
        var dataId = '[data-id="' + self.id + 'a"]';
        var textWindow = jQuery( '[data-id="' + self.id + 'a"]' );

        textWindow.innerText = MCBA.config.options.singlebutton.text;
        // var editor_container = document.getElementById(editorContainer.id);
        // editorContainer.addEventListener("change", textChangeEvent);
        //jQuery('#' + self.id + 'a_ifr').contents().find("body").addEventListener("change", textChangeEvent);

    }, 3000 );

    this.element = jQuery( document.createElement( 'div' ))
        .attr({
            'id': 'textitem',
        })
        /* Create the hidden faked input box */
        .append(
            jQuery( document.createElement( 'textarea' ))
                .attr({
                    'data-info': this.id + 'ab',
                })
                .text( self.data[ self.model.name ] )
                .css({
                    'width': '100%' //,'display': 'none'
                })
                .change( function ( event ) {
                    // Update the mockup and config
                    var value = jQuery( event.currentTarget ).val();
                    self.data[ self.model.name ] = value;
                    self.item.refresh();

                })
        )
        .append(
            jQuery( document.createElement( 'div' ))
                .attr({
                    'id': this.id,
                })

                .append( codeWithNewId )
        ).ready(
            function () {
                setTimeout( function () {
                    jQuery( '#' + self.id + 'a_ifr' ).contents().find( "body" ).html( self.data[ self.model.name ] );
                }, 100 );
            }
        );

}

String.prototype.replaceAll = function ( search, replacement ) {
    var target = this;
    return target.replace( new RegExp( search, 'g' ), replacement );
};

function HTMLItem( item ) {
    var self = this;
    this.data = item.data;
    this.model = item.model;
    this.item = item.item;

    var id = 'textitem';
    this.element = jQuery( document.createElement( 'div' ))
        .attr({
            'id': id,
        })

        /* Create the label */
        .append(
            jQuery( document.createElement( 'label' ))
                .attr({
                    'for': id,
                })
                .css({
                    'margin-right': '6px',
                    'float': 'left',
                })
                .append( self.model.display )
        )

        /* Create the input box */
        .append(
            jQuery( document.createElement( 'textarea' ))
                .text( self.data[ self.model.name ] )
                .css({
                    'width': '100%'
                })
                .keyup( function ( event ) {
                    var caretPosition = jQuery( event.currentTarget ).prop( "selectionStart" );
                    // Update the mockup and config
                    var value = jQuery( event.currentTarget ).val();
                    self.data[ self.model.name ] = value;
                    self.item.refresh();

                    // Fixes IE cursor jumping issue. IE will reset the entire 
                    // textarea when value changes, losing the caret position.
                    jQuery( event.currentTarget ).prop({
                        'selectionStart': caretPosition, // restore caret position
                        'selectionEnd': caretPosition
                    });
                })
        );
}

//!<NumberItem>
function NumberItem( item ) {
    var self = this;
    this.data = item.data;
    this.model = item.model;
    this.item = item.item;

    var id = 'numberitem';
    var value = this.data[ self.model.name ] ? this.data[ self.model.name ] : self.model.default;

    this.adjustmentControl = document.createElement( 'input' );
    this.adjustmentControl.setAttribute( "type", "number" );
    this.adjustmentControl.setAttribute( "min", 1 );
    this.adjustmentControl.setAttribute( "max", 100 );
    this.adjustmentControl.setAttribute( "value", ( typeof value !== 'undefined' ? value : '' ));
    this.adjustmentControl.onchange = function () {
        self.data[ self.model.name ] = jQuery( this ).val();
        var subject = self.item.object.getSubject();
        subject.fire( self.item.object, self.data );
    }

    this.element = jQuery( document.createElement( 'div' )).attr({ 'id': id, })
        .append( jQuery( document.createElement( 'label' )).attr({ 'for': id, }).css({ 'margin-right': '6px', 'float': 'left', })
            .append( self.model.display )
        )
        .append( this.adjustmentControl )
        .append( self.model.unit ? self.model.unit : "" );

    item.item.object.setElementValue = function ( newValue ) {
        self.adjustmentControl.value = newValue;
        self.adjustmentControl.onchange();
    }
}
//!</ NumberItem>


/*
 *  BlockListSubject
 */
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
            if ( this.observers.length == 0 ) {
                console.error( "*** ERROR: fire called in subject with no observers! ***" );
            }
            let scope = thisObj || window;
            this.observers.forEach( function ( observer ) {
                observer.call( scope, data );

            });
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
})();










//!<PercentageItem>
/*
######
#     #  ######  #####    ####   ######  #    #   #####    ##     ####   ######
#     #  #       #    #  #    #  #       ##   #     #     #  #   #    #  #
######   #####   #    #  #       #####   # #  #     #    #    #  #       #####
#        #       #####   #       #       #  # #     #    ######  #  ###  #
#        #       #   #   #    #  #       #   ##     #    #    #  #    #  #
#        ######  #    #   ####   ######  #    #     #    #    #   ####   ######

  ###
   #      #####  ######  #    #
   #        #    #       ##  ##
   #        #    #####   # ## #
   #        #    #       #    #
   #        #    #       #    #
  ###       #    ######  #    #
  */
function PercentageItem( item ) {
    var self = this;
    this.data = item.data;
    this.model = item.model;
    this.item = item.item;
    var min = this.model.min;
    if ( min == undefined ) min = 1;
    var max = this.model.max;
    if ( max == undefined ) max = 100;

    var id = 'percentageitem';
    var value = this.data[ self.model.name ] ? this.data[ self.model.name ] : self.model.default;
    if ( this.data[ self.model.name ] == "" ) {
        this.data[ self.model.name ] = self.model.default;
    }

    this.initialize = function () {
        document.getElementById( "percentageitem" ).value = self.data[ self.model.name ];
    }

    this.element = jQuery( document.createElement( 'div' ))
        .attr({
            'id': id,
        })
        .append(
            jQuery( document.createElement( 'label' ))
                .attr({
                    'for': id,
                })
                .css({
                    'margin-right': '6px',
                    'float': 'left',
                })
                .append( self.model.display )
        )
        .append(
            jQuery( document.createElement( 'input' ))
                .attr({
                    'type': 'number',
                    'min': min,
                    'max': max,
                    'value': ( typeof value !== 'undefined' ? value : '' ),
                })
                .data( "name", this.data[ this.model.name ] )
                .css({
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'margin-right': '3px',
                    'float': 'left',
                    'width': '60px',
                })
                .change(
                    function () {
                        self.data[ self.model.name ] = jQuery( this ).val();
                        var subject = self.item.object.getSubject();
                        subject.fire( self.item.object, self );
                    }
                )
        )
        .append(
            jQuery( document.createElement( 'label' ))
                .attr({
                    'for': id,
                })
                .css({
                    'margin-right': '6px',
                    'float': 'left',
                })
        )
        .append(
            self.model.unit ? self.model.unit : ""
        );

    this.update = function ( newValue ) {
        this.element[ 0 ].children[ 1 ].value = newValue;
    }

    this.setElementValue = function ( newValue ) {
        self.element[ 0 ].children[ 1 ].value = newValue;
        jQuery( self.element[ 0 ].children[ 1 ] ).trigger( "change" );
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
#     #  ######  #####    ####   ######  #    #   #####    ##     ####   ######
#     #  #       #    #  #    #  #       ##   #     #     #  #   #    #  #
######   #####   #    #  #       #####   # #  #     #    #    #  #       #####
#        #       #####   #       #       #  # #     #    ######  #  ###  #
#        #       #   #   #    #  #       #   ##     #    #    #  #    #  #
#        ######  #    #   ####   ######  #    #     #    #    #   ####   ######

  ###
   #      #####  ######  #    #
   #        #    #       ##  ##
   #        #    #####   # ## #
   #        #    #       #    #
   #        #    #       #    #
  ###       #    ######  #    #
  */
//! </PercentageItem>











//! ////////////// ArrayItem ///////////////
function ArrayItem( item ) {
    var self = this;
    this.item = item.item;
    this.model = item.model;
    this.data = item.data;
    var id = 'arrayitem';

    //! //////// Main item div /////////
    this.element = jQuery( document.createElement( 'div' )).attr({ 'id': id, }).css({ 'padding': '3px', })
        .append( jQuery( document.createElement( 'div' ))
            .append( jQuery( document.createElement( 'label' )).attr({ 'for': id, }).css({ 'line-height': '3', 'margin-right': '6px', 'float': 'left', }).text( self.model.display ))
            .append( jQuery( document.createElement( 'input' )).attr({ 'type': 'image', 'src': root_url + 'www/images/add.png', })  //! Add button 
                .click( function () {
                    console.log( "adding new child..." );
                    self.item.addNewChild( self.model.name );
                    self.fireEvent();
                })) );

    this.list = jQuery( document.createElement( 'ul' ));
    this.list.appendTo( this.element );

    //! // Initialize - Build each sub-item ///
    if ( this.data[ this.model.name ] == undefined ) return;
    for ( var arrayItemIndex = 0; arrayItemIndex < this.data[ this.model.name ].length; arrayItemIndex++ ) {
        var data = this.data[ this.model.name ][ arrayItemIndex ];

        //! Build each data object per item ///
        for ( var x = 0; x < this.model.items.length; x++ ) {
            var subModel = this.model.items[ x ];
            var constructor = getMatchingItem( subModel.type );
            var itemArgument = {
                item: self.data[ self.model.name ][ arrayItemIndex ],
                object: self.item.object
            }
            var subItem = new constructor({
                'data': data,
                'model': subModel,
                'item': itemArgument,
            });

            this.item.object.setItemPointer( this.model.name, arrayItemIndex, subItem );

            if ( subItem.element.css )
                subItem.element.css({ 'background-color': shade( baseColor, -10 ), 'padding': '5px', });

            if ( subItem.element.find )
                subItem.element.find( 'label' ).after(

                    //! Delete button //
                    jQuery( document.createElement( 'input' )).attr({ 'type': 'image', 'src': root_url + 'www/images/delete.png', }).css({ 'margin-right': '6px', 'float': 'right', }).data( 'pos', arrayItemIndex )
                        .click( function () {
                            self.item.item[ self.model.name ].splice( jQuery( this ).parent().parent().index() / 2, 1 );
                            MCBA.load();
                        })
                );

            this.list.append( jQuery( document.createElement( 'li' )).append( subItem.element ));
        }
    }

    this.fireEvent = function () {
        var subject = this.item.object.getSubject();
        subject.fire( this.item.object, this );
    }
}
//! </ ArrayItem>


//! <FileItem>
function FileItem( item ) {
    if ( typeof MCBA.www_url == "undefined" ) {
        var www_url = "file:///C:/Projects/mcbaObjects/jasmineIntro/";
    } else {
        var www_url = MCBA.www_url;
    }
    var self = this;
    this.item = item.item;
    this.model = item.model;
    this.data = item.data;
    this.display = item.display;
    var imageFileName = ( ( this.data[ this.model.name ] == "" || this.data[ this.model.name ] == undefined ) ? "upload.png" : this.data[ this.model.name ] );
    var id = 'fileitem';

    //! the image adjustment
    this.element = jQuery( document.createElement( 'div' )).attr({ 'id': id, })
        .append( jQuery( document.createElement( 'label' )).attr({ 'for': id, }).css({ 'margin-right': '6px', 'float': 'left', }).append( this.model.display ))
        .append( jQuery( document.createElement( 'div' ))
            .append( jQuery( document.createElement( 'input' )).attr({ 'type': 'text', 'src': www_url + 'images/' + imageFileName, 'value': imageFileName, }).css({ 'width': '100%', })
                .keyup( function ( event ) {
                    var caretPosition = jQuery( event.currentTarget ).prop( "selectionStart" );
                    //! Update the mockup and config <------------- use the pub sub system here! ------------------<<
                    var value = jQuery( event.currentTarget ).val();
                    self.data[ self.model.name ] = value;
                    self.refreshMenuItem( value );
                    self.fireEvent();

                    // Fixes IE cursor jumping issue. IE will reset the entire textarea when value changes, losing the caret position.
                    jQuery( event.currentTarget ).prop({ 'selectionStart': caretPosition, 'selectionEnd': caretPosition }); // restore caret position
                }))
            .append( jQuery( document.createElement( 'p' )).text( "Must be located in: " + www_url + 'images/' ))
            .append( jQuery( document.createElement( 'img' )).attr({ 'src': www_url + 'images/' + imageFileName, }).css({ 'max-width': '90%', })
                .click( function () {
                    self.pickFile();
                }))
        );

    var removeButton = document.createElement( "button" );
    removeButton.width = "30px";
    removeButton.height = "60px";
    removeButton.innerHTML = "Remove Image";
    removeButton.onclick = function () {
        self.data[ self.model.name ] = "";
        self.refreshMenuItem( "" );
        self.fireEvent();
    }


    if ( self.item.object.__proto__.constructor.name !== "Slider" ) {
        this.element.append( removeButton );
    }

    this.pickFile = function () {
        if ( typeof wp == "undefined" ) {
            self.refreshMenuItem( "call.jpg" );
            self.fireEvent();
            return;
        }
        var send_attachment_bkp = wp.media.editor.send.attachment;
        var button = jQuery( this );
        wp.media.editor.send.attachment = function ( props, attachment ) {
            var data = {
                action: 'mcba_set_image',
                attachment_id: attachment.id,
            };

            jQuery.post( ajax_url, data, function ( response ) {
                self.refreshMenuItem( response );
                self.fireEvent();
            });

            wp.media.editor.send.attachment = send_attachment_bkp;
        }
        wp.media.editor.open( button );
        return false;
    }

    this.refreshMenuItem = function ( /* String */ new_filename ) {
        self.data[ self.model.name ] = new_filename.replaceAll( "\n", "" );
        if ( self.item.item.type == "Header" )
            MCBA.config.options.logo.value = new_filename.trim();
        self.element[ 0 ].children[ 1 ].value = new_filename.trim();
        var jQueryfileElement = jQuery( self.element[ 0 ] );
        if ( self.element[ 0 ].children[ 2 ].children[ 2 ] != undefined ) {
            self.element[ 0 ].children[ 2 ].children[ 2 ].src = www_url + "images/" + new_filename.trim();
        } else if ( jQueryfileElement.find( "img" )[ 0 ] != undefined ) {
            jQueryfileElement.find( "img" )[ 0 ].src = www_url + "images/" + new_filename.trim();
        } else {
            console.error( "*** ERROR: could not find image element! ***" );
        }

    }

    self.fireEvent = function () {
        var subject = self.item.object.getSubject();
        self.data[ "www_url" ] = www_url;
        subject.fire( self.item.object, self );
    }
}
//! </ FileItem>



//! <TextItem>
function TextItem( item ) {
    var self = this;
    this.item = item.item;
    this.model = item.model;
    this.data = item.data;
    this.element = document.createElement( "div" );
    var textLabelDiv = document.createElement( "div" );
    var textLabel = document.createElement( "label" );
    textLabel.innerHTML = this.model.display;
    textLabelDiv.append( textLabel );
    this.element.append( textLabelDiv );
    self.textElement = document.createElement( "input" );
    self.textElement.onchange = function () {
        self.data[ self.model.name ] = jQuery( this ).val();
        var subject = self.item.object.getSubject();
        subject.fire( self.item.object, self );
    };

    self.textElement.onblur = function () {
        self.data[ self.model.name ] = jQuery( this ).val();
        var subject = self.item.object.getSubject();
        subject.fire( self.item.object, self );
    };

    if ( self.item.item[ self.model.name ] != undefined ) {
        self.textElement.value = self.item.item[ self.model.name ];
    } else {
        self.textElement.value = "Menu Text";
    }

    self.textElement.style.marginRight = "6px";
    self.textElement.style.float = "left";
    self.textElement.style.width = "200px";
    self.textElement.style.height = "50px";
    this.element.append( self.textElement );

    this.setElementValue = function ( newValue ) {
        self.element.children[ 1 ].value = newValue;
        jQuery( self.element.children[ 1 ] ).trigger( "change" );
    }

    this.item.object.getElementPointer = function () {
        return self.textElement;
    }

    this.getElementValue = function () {
        return self.element.children[ 1 ].value;
    }
}
//! </ TextItem>


function ActionItem( item ) {
    var self = this;
    this.item = item;


    self[ "model" ] = Object();
    self[ "model" ].name = "action";

    // set pointer to mockup element
    action_pointer = item.item.element[ 0 ].children[ 0 ];

    // set id
    /*
     * if this item has an id 
     * for the font picker, use it
     */
    if ( item.item.children != null ) {
        if ( item.item.children[ 6 ].id != undefined ) {
            self[ "id" ] = item.item.children[ 6 ].id;
        }
    } else {
        self[ "id" ] = "action_" + milliseconds_since_epoch();
    }

    // create element
    /*
     * create div and input element.  assign id.
     */
    this.element = document.createElement( "div" );
    var selectElement = document.createElement( "select" );

    selectElement.id = self[ "id" ];

    var options = [];
    var chat = Object();
    chat.value = "mcba://chat";
    chat.text = "Ask the Expert";
    options.push( chat );

    var rewards = Object();
    rewards.value = "mcba://rewards";
    rewards.text = "Rewards";
    options.push( rewards );

    var coordinates = Object();
    coordinates.value = MCBA.config.options.google_map_address.value;
    coordinates.text = "Map Coordinates";
    options.push( coordinates );

    var phone = Object();
    phone.value = "tel:" + MCBA.config.options.phone.value;
    phone.text = "Phone Link";
    options.push( phone );

    var website = Object();
    website.value = MCBA.config.options.website.value;
    website.text = "Website Link";
    options.push( website );

    for ( let index = 0; index < options.length; index++ ) {
        const value = options[ index ].value;
        const text = options[ index ].text;
        var optionElement = document.createElement( "option" );
        optionElement.value = value;
        optionElement.text = text;
        selectElement.appendChild( optionElement );
    }

    // set onchange
    selectElement.onchange = function () {
        var actionValue = document.getElementById( self[ "id" ] ).value;
        self.item.item.item[ "action" ] = actionValue;
    };

    this.initialize = function () {}

    // create and append the font label div
    var actionLabelDiv = document.createElement( "div" );
    var actionLabel = document.createElement( "label" );
    actionLabel.innerHTML = "Action: ";
    actionLabelDiv.append( actionLabel );
    this.element.append( actionLabelDiv );
    this.element.append( selectElement );

    // set initial value
    if ( self.item.item.item[ "action" ] != undefined ) {
        selectElement.value = self.item.item.item[ "action" ];
    }
}










//! <ColorItem>
/*
 #####                                    ###
#     #   ####   #        ####   #####     #      #####  ######  #    #
#        #    #  #       #    #  #    #    #        #    #       ##  ##
#        #    #  #       #    #  #    #    #        #    #####   # ## #
#        #    #  #       #    #  #####     #        #    #       #    #
#     #  #    #  #       #    #  #   #     #        #    #       #    #
 #####    ####   ######   ####   #    #   ###       #    ######  #    #
 */
function ColorItem( item ) {
    var self = this;
    this.item = item.item;
    this.model = item.model;
    this.data = item.data;
    var id = 'coloritem';
    this.element = document.createElement( "div" );

    // create the color label div
    var colorLabelDiv = document.createElement( "div" );
    var colorLabel = document.createElement( "label" );
    colorLabel.innerHTML = item.model.display;
    colorLabelDiv.append( colorLabel );
    this.element.append( colorLabelDiv );

    // create the color picker element
    var colorPickerElement = document.createElement( "input" );
    colorPickerElement.type = "color";
    var element = colorPickerElement;
    colorPickerElement.onchange = function () {
        self.data[ self.model.name ] = jQuery( this ).val();
        var subject = self.item.object.getSubject();
        subject.fire( self.item.object, self );
    };

    if ( self.data[ self.model.name ] != undefined ) {
        element.value = ( ( this.data[ this.model.name ] == "" ) ? "#ffffff" : this.data[ this.model.name ] );
    }

    colorPickerElement.style.marginRight = "6px";
    colorPickerElement.style.float = "left";
    colorPickerElement.style.width = "200px";
    colorPickerElement.style.height = "50px";
    this.element.append( colorPickerElement );

    this.setElementValue = function ( newValue ) {
        self.element.children[ 1 ].value = newValue;
        jQuery( self.element.children[ 1 ] ).trigger( "change" );
    }

    this.getElementValue = function () {
        return self.element.children[ 1 ].value;
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

 #####                                    ###
#     #   ####   #        ####   #####     #      #####  ######  #    #
#        #    #  #       #    #  #    #    #        #    #       ##  ##
#        #    #  #       #    #  #    #    #        #    #####   # ## #
#        #    #  #       #    #  #####     #        #    #       #    #
#     #  #    #  #       #    #  #   #     #        #    #       #    #
 #####    ####   ######   ####   #    #   ###       #    ######  #    #
 */
//! </ ColorItem>











//! <FontItem>
/*
#######                           ###
#         ####   #    #   #####    #      #####  ######  #    #
#        #    #  ##   #     #      #        #    #       ##  ##
#####    #    #  # #  #     #      #        #    #####   # ## #
#        #    #  #  # #     #      #        #    #       #    #
#        #    #  #   ##     #      #        #    #       #    #
#         ####   #    #     #     ###       #    ######  #    #
*/

function FontItem( item ) {
    var self = this;
    this.data = item.data;
    this.model = item.model;
    this.item = item.item;

    // set pointer to mockup element
    button_text_pointer = item.item.element[ 0 ].children[ 0 ];

    if ( self.data[ self.model.name ] != undefined ) {
        button_text_pointer.fontFamily = self.data[ self.model.name ];
    }

    // create element
    /*
     * create div and input element.  assign id.
     */
    this.element = document.createElement( "div" );
    var selectElement = document.createElement( "select" );

    selectElement.id = self[ "id" ];

    var options = [ "none",
        "Arial",
        "Book Antiqua",
        "Charcoal",
        "Comic Sans MS",
        "Courier",
        "Courier New",
        "cursive",
        "fantasy",
        "Gadget",
        "Geneva",
        "Georgia",
        "Helvetica",
        "Impact",
        "Luicida Grande",
        "Lucida Console",
        "Lucida Sans Unicode",
        "Monaco",
        "monospace",
        "Palatino",
        "Palatino Linotype",
        "sans-serif",
        "serif",
        "Tahoma",
        "Times",
        "Times New Roman",
        "Trebuchet MS",
        "Verdana"
    ];

    for ( var index = 0; index < options.length; index++ ) {
        var element = options[ index ];
        var optionElement = document.createElement( "option" );
        optionElement.value = element;
        optionElement.text = element;
        selectElement.appendChild( optionElement );
    }

    // set onchange
    selectElement.onchange = function () {
        self.data[ self.model.name ] = jQuery( this ).val();
        var subject = self.item.object.getSubject();
        subject.fire( self.item.object, self );
    };

    /*
     * create and append the font label div
     */
    var fontLabelDiv = document.createElement( "div" );
    var fontLabel = document.createElement( "label" );
    fontLabel.innerHTML = "Font: ";
    fontLabelDiv.append( fontLabel );
    this.element.append( fontLabelDiv );
    this.element.append( selectElement );

    // set initial value
    if ( self.data[ self.model.name ] != undefined ) {
        selectElement.value = self.data[ self.model.name ]
    }

    // get the singletone while we can!
    this.subject = BlockListSubject.getInstance();
    this.getSubject = function () {
        return self.subject;
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

#######                           ###
#         ####   #    #   #####    #      #####  ######  #    #
#        #    #  ##   #     #      #        #    #       ##  ##
#####    #    #  # #  #     #      #        #    #####   # ## #
#        #    #  #  # #     #      #        #    #       #    #
#        #    #  #   ##     #      #        #    #       #    #
#         ####   #    #     #     ###       #    ######  #    #
*/
//! </FontItem>










function SelectItem( item ) {
    var self = this;
    this.item = item.item;
    this.model = item.model;
    this.data = item.data;
    this.element = jQuery( document.createElement( 'div' ));
    var label = document.createElement( "label" );
    label.style.marginRight = "6px";
    label.style.float = "left";
    label.append( self.model.display );
    this.element.append( label );
    var factory = new SelectElementFactory( item );
    this.selectElement = factory.createElement();
    this.selectElement.onchange = function () {
        self.data[ self.model.name ] = jQuery( this ).val();
        var subject = self.item.object.getSubject();
        subject.fire( self.item.object, self );
    };
    this.element.append( this.selectElement );

    this.setElementValue = function ( newValue ) {
        self.selectElement.value = newValue;
        jQuery( self.selectElement ).trigger( "change" );
    };

    //! Set selected item 
    if ( typeof this.model.default !== 'undefined' && !this.data[ this.model.name ] ) {
        this.element.find( 'select' ).val( this.model.default );
    } else if ( typeof this.data[ this.model.name ] !== 'undefined' ) {
        this.element.find( 'select' ).val( this.data[ this.model.name ] );
    }
}


/**
 *  a wrapper for each item on a single page. 
 *  parses the JSON object and binds it to its 
 *  respective template item then builds the 
 *  element.
 */
function PageItem( item ) {
    var self = this;
    this.item = item;
    this.type = item.type.capitalize();
    this.template = MCBA.template[ this.type.toLowerCase() ];
    this.object = null;
    this.element = null;
    this.children = null;

    this.remove = function () {
        for ( var i = 0; i < MCBA.pageItems.length; i++ ) {
            if ( MCBA.pageItems[ i ] === this ) {
                MCBA.currentPagePtr.items.splice( i, 1 );
                MCBA.pageItems.splice( i, 1 );
                MCBA.load();
            }
        }
    };

    this.refresh = function () {
        if( !window[ this.type ]) {
            var thisItemObject = new( Function( 'return new ' + this.item.type ))( this.item );
            var ItemConstructor = thisItemObject.constructor;
            console.log( "item object: " + this.type + " created with Function().")
        } else {
            var ItemConstructor = window[ this.type ];
        }
        if ( typeof ItemConstructor === 'function' ) {
            // Create the function defined in the templates mcba.js
            this.object = new ItemConstructor( this.item );


            if ( typeof this.object.run === 'function' ) {
                this.object.run();
            }

            if ( typeof this.object.element !== 'undefined' ) {
                if ( this.element !== null ) {
                    this.element.replaceWith( this.object.element );
                }
                this.element = this.object.element;
                jQuery( this.object.element ).addClass( 'mcba_item mcba_type_' + this.type );
            }
        }

    };

    this.addNewChild = function ( key ) {
        var tmp;
        for ( var i = 0; i < this.template.items.length; i++ ) {
            if ( this.template.items[ i ].name === key ) // "name", not "item_name" EG 2020
                tmp = this.template.items[ i ];
        }

        var newItem = buildTemplateItem( tmp );
        this.item[ key ].push( newItem );
        // MCBA.load();
    }
}


/**
 * Factory for creating the proper item. Just pass in the data as you would for any item.
 * @param data
 * Type: PlainObject
 * @returns
 */
function getMatchingItem( model ) {
    var type;
    if ( typeof model === 'string' )
        type = model;
    else
        type = model.block.item.template.items[ model.position ].type;

    switch ( type ) {
        case "array":
            return ArrayItem;

        case "text":
            return TextItem;

        case "html":
            return HTMLItem;

        case "file":
            return FileItem;

        case "number":
            return NumberItem;

        case "select":
            return SelectItem;

        case "color":
            return ColorItem;

        case "page":
            return PageItem;

        case "percentage":
            return PercentageItem;

        case "font":
            return FontItem;

        case "action":
            return ActionItem;
    }
}

function shade( color, amt ) {

    var usePound = false;

    if ( color[ 0 ] == "#" ) {
        color = color.slice( 1 );
        usePound = true;
    }

    var num = parseInt( color, 16 );
    var r = ( num >> 16 ) + amt;

    if ( r > 255 ) r = 255;
    else if ( r < 0 ) r = 0;

    var b = ( ( num >> 8 ) & 0x00FF ) + amt;

    if ( b > 255 ) b = 255;
    else if ( b < 0 ) b = 0;

    var g = ( num & 0x0000FF ) + amt;

    if ( g > 255 ) g = 255;
    else if ( g < 0 ) g = 0;

    return ( usePound ? "#" : "" ) + ( g | ( b << 8 ) | ( r << 16 )).toString( 16 );

}

String.prototype.capitalize = function ( lower ) {
    return ( lower ? this.toLowerCase() : this ).replace( /(?:^|\s)\S/g, function ( a ) {
        return a.toUpperCase();
    });
};


