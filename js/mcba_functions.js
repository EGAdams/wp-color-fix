var www_url = "";
var root_url = "";
var ajax_url = "";
var options;
var pageitems;
var MCBA;
//var jQueryjQuery;

var mcbaColorPickerOptions = {
    // a callback to fire whenever the color changes to a valid color
    change: function ( event, ui ) {
        var color = ui.color.toString();
        var tid;
        if ( this.id.indexOf( "welcome" ) == 0 ) {
            tid = this.id.replace( "color_", "" );
        } else {
            tid = this.name;
        }
        jQuery( event.target ).trigger( 'change', [ tid, color ] );
        //setOption(tid, color);
    }
};

function mcba_init( root, www, ajax ) {
    // For Wordpress Themes that do not realize that jQuery depreciated this function in jQuery 1.9.
    if ( !!!jQuery.fn.live ) {
        jQuery.fn.extend({
            live: function ( event, callback ) {
                if ( this.selector ) {
                    jQuery( document ).on( event, this.selector, callback );
                }
            }
        });
    }
    // livequery is a little different. Do not have time to make a workaround. 
    //People should really fix their themes and plugins to eliminate this deprecated method.
    if ( !!!jQuery.fn.livequery ) {
        jQuery.fn.extend({
            livequery: function() {
                //return jQuery.fn.live.apply(this, arguments); 
            },
            expire: function() {
                //return jQuery.fn.die.apply(this, arguments); 
            }
        });
    }

    www_url = www;
    root_url = root;
    if ( ajax ) ajax_url = ajax;
    /* Setup MCBA markup */

    jQuery(document).ready(function() {
        jQuery('#mcba_mockup').on('load', function() {
            var iframeJQuery = jQuery(this)[0].contentWindow.jQuery;
            MCBA = jQuery(this)[0].contentWindow.MCBA;
            buildToolBoxWidgets();
            MCBA.onPageLoad = onPageLoad;
            MCBA["www_url"] = www_url;
            MCBA.load();
    
            iframeJQuery('.mcba_color_picker').wpColorPicker(mcbaColorPickerOptions);
    
            // Assuming block.element is correctly defined somewhere in your code
            if (block && block.element && iframeJQuery(block.element).draggable) {
                iframeJQuery(block.element).draggable();
            } else {
                console.error("block.element.draggable is not a function or block.element is not defined.");
            }
        });
    });
    
    /* Init range slider plugin (visible in color picker dialog) */
    // jRange_init(jQuery, window, document);
    // jQuery('#alpha-slider').jRange({
    //     from: 0,
    //     to: 100,
    //     step: 1,
    //     scale: [0, 100],
    //     format: 'Opacity: %s\%',
    //     showLabels: true
    // });
    /* Init Accordion */

    // jQueryjQuery = jQuery(this)[0].contentWindow.jQuery;
    //MCBA = jQuery(this)[0].contentWindow.MCBA;
    // buildToolBoxWidgets(); moved to inside load script on feb 9.  when MCBA.template is null, widgets don't show
    MCBA.onPageLoad = onPageLoad;
    MCBA[ "www_url" ] = www_url;

    // surround next with try/catch
    try {
        MCBA.loadScript( 'template.json', function() { 
            /* Save all the types from the template as a variable */
            if ( MCBA.template == null ) {
                MCBA.template = template;
                if ( MCBA.types == null || MCBA.types == null ) {
                    console.log( "MCBA.types is null.  creating new array..." );    
                    MCBA.types = [];
                }
                for ( key in MCBA.template ) {
                    MCBA.types.push( key );
                }
                // MCBA.icons = getIconData(); 
                // MCBA.iconCategories = getIconCategoryData();
                console.log( "MCBA.template was null. returning..." );
                return;
                // console.log( "MCBA.template was null. calling buildToolBoxWidgets()..." );
                // buildToolBoxWidgets();
                // MCBA.loadScript( "js/mcba.js", function() { Callback.onMcbaReady(); });
            } else {
                initLogger.logUpdate( "MCBA.template is not null. calling buildToolBoxWidgets()..." );
                // now, set put the ready function...
                jQuery( document ).ready(function( jQuery ) {
                    buildToolBoxWidgets();
                    //jQuery( '.wp-color-picker' ).wpColorPicker();
                    jQuery( document ).ready( function( jQuery ) {
                        jQuery( '.mcba_color_picker' ).wpColorPicker( mcbaColorPickerOptions );
                    });
                });
            }
        });
    } catch {
        console.log( "*** ERROR: loading template.json  returning... ***" );
        return; 
    }

    /* Import the template file */
    MCBA.load();
    // jQuery( document ).ready( function( jQuery ) {
    //     jQuery( '.mcba_color_picker' ).wpColorPicker( mcbaColorPickerOptions );
    // });

    // insert mockup initialization here

    jQuery(document).ready(function($) {
        // Initialize accordion
        $(".accordion").accordion({
            heightStyle: 'fill'
        });

        // Initialize resizable
        try {
            $("#col_right").resizable({
                minHeight: 100,
                minWidth: 200,
                resize: function() {
                    $(".accordion").accordion("refresh");
                }
            });
        } catch (err) {
            console.log("*** ERROR: accordion NOT loading properly! Potential race condition. ***");
        }
    });
    
    /* Init dialog */
    /*    jQuery(function() {
            jQuery(".dialog").each(function() {
                jQuery(this)
                    .dialog({
                        autoOpen: false,
                        width: 'auto',
                        show: {
                            effect: "blind",
                            duration: 200
                        },
                        hide: {
                            effect: "explode",
                            duration: 200
                        }
                    })
                    .bind('dialogclose', function(event) {
                        jQuery('#colorpicker_text').unbind("change");
                        //jQuery("#uploader").plupload('getUploader').unbind('FileUploaded');
                    });
            });
        });
    */
}

function onDragStart( event, ui ) {
    var offsetXPos = parseInt( ui.offset.left );
    var offsetYPos = parseInt( ui.offset.top );
    jQuery( this )
        .css({
            'z-index': '1000'
        } )
        .data( "info", jQuery( this ).attr( 'name' ) );
}

function onDragStop( event, ui ) {
    if ( jQuery( this ).data( 'addItem' ) === true ) {
        MCBA.addDefaultItem( jQuery( this ).data( 'block' ).item.type );
        updateItemOverview();
        make_block_list_sortable();
    }
}

function onDragOver( event, ui ) {
    if ( jQuery( this ).attr( 'id' ) === "mcba_item_overview" ) {
        if ( ui.draggable.data( 'from' ) !== "toolbox" ) {} else {
            ui.draggable.data( 'addItem', true );
        }
    }
}

function onDragDrop( event, ui ) {
    updateItemOverview();
    make_block_list_sortable();
}

function onDragOut( event, ui ) {
    if ( jQuery( this ).attr( 'id' ) === "mcba_item_overview" ) {
        if ( ui.draggable.data( 'from' ) !== "toolbox" ) {} else {
            ui.draggable.data( 'addItem', false );
        }
    }
}

function onDrag( event, ui ) {
    //	console.log(ui.position.left + " " + ui.position.top);
}

function make_block_list_sortable() { 
    jQuery( document ).ready( function() {
        setTimeout( function() {
            if ( !jQuery( '#BlockList' ).sortable ) {
                console.error( "*** ERROR: trying to use jQuery sortable before it is defined! ***" );
                throw ( Error );
            }
            jQuery( '#BlockList' ).sortable({
                'revert': true,
                'helper': 'clone',
                'placeholder': "ui-state-highlight",
                'sort': function ( event, ui ) {},
                'start': function ( event, ui ) {
                    self.sortStart = ui.item.index();
                },
                'stop': function ( event, ui ) {
                    self.sortStart = -1;
                },
                'update': function ( event, ui ) {
                    // Move item 
                    var newPos = ui.item.index();
                    var pageItems = MCBA.config.pages[ MCBA.currentPage ].items;

                    if ( self.sortStart > -1 ) {
                        while ( self.sortStart < 0 ) {
                            self.sortStart += pageItems.length;
                        }
                        while ( newPos < 0 ) {
                            newPos += pageItems.length;
                        }
                        if ( newPos >= pageItems.length ) {
                            var k = newPos - pageItems.length;
                            while ( ( k-- ) + 1 ) {
                                pageItems.push( undefined );
                            }
                        }
                        pageItems.splice( newPos, 0, pageItems.splice( self.sortStart, 1 )[ 0 ] ); // move to new position
                        MCBA.load();
                    }
                },
            });

        }, 1000 )
    });
}

function onPageLoad() {
    updateItemOverview();
    make_block_list_sortable();
    jQuery( '#mcba_mockup' ).show();
}

function buildToolBoxWidgets() {
    /* Create the Widgets.  This is in the right column.  The "from toolbox" blocks" */
    pageBuildLogger = LoggerFactory.createLogger( "PageBuilderLogger" );
    pageBuildLogger.logUpdate( "PageBuilderLogger created." );
    jQuery( "#mcba_item_container" ).data( 'blocks', [] );
    for ( var type in MCBA.template ) {
        var block = new Block( type, true );
        if ( typeof ( block.element.draggable ) == undefined ) {
            console.err( "*** ERROR: block.element.draggable undefined! ***" );
            throw ( Error );
        }
        block.element.draggable({
            'containment': 'document',
            'helper': 'clone',
            'start': onDragStart,
            'stop': onDragStop,
            'drag': onDrag,
            'revert': 'invalid'
        });
        block.element.data( 'from', 'toolbox' );
        jQuery( "#mcba_item_container" ).data( 'blocks' ).push( block );
        jQuery( "#mcba_item_container" ).append( block.element );
        pageBuildLogger.logUpdate( "pushed " + block.item.type + " into container and appended to DOM." );
    }
    options = MCBA.config[ 'options' ];
    
    /* Populate the Options fields */
    for ( var key in MCBA.config[ 'options' ] ) {
        var option = MCBA.config[ 'options' ][ key ];
        var optionsTable;
        /* Build the entry */
        if ( option[ 'type' ] == 'color' ) {
            optionsTable = jQuery( "#options_colors" );
        } else if ( option[ 'type' ] == 'text' ) {
            optionsTable = jQuery( "#options_info" );
        } else if ( option[ 'type' ] == 'file' ) {
            optionsTable = jQuery( "#options_files" );
        }
        optionsTable.append( ( new OptionItem( key ) ).row );
    }
    jQuery( ".mcba_loading_overlay" ).css( 'display', 'none' );
    jQuery( '#mcba_item_overview' ).droppable({
        'over': onDragOver,
        'out': onDragOut,
        'drop': onDragDrop });

    jQuery( function() { jQuery( ".accordion" ).accordion({ heightStyle: 'fill' }); });

    jQuery( function() {
        try {
            jQuery( "#col_right" ).resizable({
                minHeight: 100,
                minWidth: 200,
                resize: function() {
                    jQuery( ".accordion" ).accordion( "refresh" );
                }
            });
        } catch ( err ) {
            console.log( "*** ERROR: accordion NOT loading properly! Potential race condition. ***" );}});
}

function inittinymce( editor ) { // TODO: inittinymce

    tinymce.activeEditor.on( 'focusout', function() {
        //updateItemOverview();
    });
    tinymce.activeEditor.on( 'change', function() {
        console.log( "triggering save..." );
        tinymce.triggerSave();
        var id = jQuery( tinymce.activeEditor.getBody() ).attr( "data-id" );
        var content = tinymce.activeEditor.getContent();
        var type = getTypeFromId( id );
        if ( type == "Singlebutton" ) {
            /*
             * TODO: pull color out of content and
             * set MCBA button text color property.
             */
            var regexp = /style="color: #(......)/
            var colorMatch = content.match( regexp );
            if ( colorMatch != null ) {
                var textColor = colorMatch[ 1 ];
                MCBA.config.options.button_options[ "text_color" ] = textColor;
            }
        }

        jQuery( '#' + id ).html( content );
        jQuery( "[data-info='" + id + "b']" ).html( content ).trigger( 'change' );
    });
}

function getTypeFromId( id ) {
    for ( const item in MCBA.pageItems ) {
        if ( MCBA.pageItems.hasOwnProperty( item ) ) {
            const pageItem = MCBA.pageItems[ item ];
            if ( pageItem.id == id ) {
                return pageItem.type;
            }
        }
    }
    return "unknown_type";
}

var previousPage = -1;
/**
 * Refresh the overview block with the current config info 
 */
function updateItemOverview() {
    var openMenu;
    var i = 0;
    jQuery( "[id^=edit_menu]" ).each( function() {
        if ( jQuery( this ).data( 'block' ) != undefined ) {
            if ( jQuery( this ).data( 'block' ).menu.isOpen ) {
                openMenu = i;
            }
        }
        i++;
    });
    var overview = jQuery( "#mcba_item_overview" );
    overview
        .html( "" )
        .append(
            new PageMenu( MCBA.currentPage ).element
        );
    if ( MCBA.pageItems.length < 1 ) {
        jQuery( "#mcba_item_overview" ).append( "<h1> No items yet! </br></br> Drag new items from the right</h1>" );
    } else {
        var blocklist = new BlockList( MCBA.pageItems );
        overview.data( 'blocklist', blocklist );
        overview.append( blocklist.element );
        blocklist.hideAllMenus();
        jQuery( '#select_current_page' ).val( MCBA.currentPage );

        if ( typeof openMenu !== 'undefined' && previousPage === MCBA.currentPage ) {
            if ( blocklist.blocks[ openMenu ] != undefined && blocklist.blocks[ openMenu ].menu != null ) {
                blocklist.blocks[ openMenu ].menu.open();
            }
        }
    }
    previousPage = MCBA.currentPage;
    let base_address = getBaseAddress( MCBA.config.admin_url );
    MCBA.loadScript( base_address + "/wp-content/plugins/MCBA-Wordpress/www/js/widgets/jquery-ui.min.js",
                     build_page_container );
}

function getBaseAddress(url) {
    try {
        // Create a new URL object
        let urlObj = new URL(url);

        // Construct the base address
        let baseAddress = `${urlObj.protocol}//${urlObj.hostname}`;

        // Return the base address
        return baseAddress;
    } catch (e) {
        console.error('Invalid URL:', e);
        return null;
    }
}

function build_page_container() {
    /* Build the page container */
    var pageContainer = jQuery( '#mcba_page_container' );
    pageContainer.html( "" );
    var pageList = jQuery( document.createElement( 'ul' ) )
        .css({
            'margin': "0px",
        })
        .sortable({
            'revert': true,
            'helper': 'clone',
            'placeholder': "ui-state-highlight",
            'sort': function (event, ui) {
                //     console.log("Sort");
            },
            'start': function (event, ui) {
                ui.item.data("sorting", true);
                self.sortStart = ui.item.index();
            },
            'stop': function (event, ui) {
                ui.item.data("sorting", false);
                self.sortStart = -1;
            },
            'update': function (event, ui) {
                // Move item 
                var newPos = ui.item.index();
                var arrary = MCBA.config.pages;
                if (self.sortStart > -1) {
                    while (self.sortStart < 0) {
                        self.sortStart += arrary.length;
                    }
                    while (newPos < 0) {
                        newPos += arrary.length;
                    }
                    if (newPos >= arrary.length) {
                        var k = newPos - arrary.length;
                        while ((k--) + 1) {
                            arrary.push(undefined);
                        }
                    }
                    arrary.splice(newPos, 0, arrary.splice(self.sortStart, 1)[0]);
                    MCBA.load();
                }
            },
        })
        .appendTo( pageContainer );
    for ( var i = 0; i < MCBA.config.pages.length; i++ ) {
        pageList
            .append(
                jQuery( document.createElement( 'li' ) )
                .css({
                    'cursor': 'move',
                } )
                .data( 'page', i )
                .click( function ( event ) {
                    var page = jQuery( this ).data( 'page' );
                    MCBA.load( page );
                } )
                .append(
                    jQuery( document.createElement( 'div' ) )
                    .css({
                        'display': 'block',
                        'height': '41px',
                        'float': 'left',
                        'position': 'relative',
                        'left': '-20px',
                    } )
                   .append(
                        ( function() {
                            if ( i === MCBA.currentPage ) {
                                // Make currentpage indicator arrow
                                return jQuery( document.createElement( 'img' ) )
                                    .attr({
                                        'src': root_url + "www/images/arrow-current-page.png",
                                    } )
                            } else {
                                return jQuery( document.createElement( "div" ) );
                            }
                        } )
                    )
                )
                .append(
                    jQuery( document.createElement( 'div' ) )
                    .css({
                        'padding-right': i === MCBA.currentPage ? '24px' : '',
                        'border-width': '2px',
                        'height': '35px',
                        'line-height': '2',
                        'background-color': MCBA.config.options.base_color.value,
                        'color': MCBA.config.options.menu_text.value,
                        'text-align': 'center',
                    } )
                    .append( MCBA.config.pages[ i ].title )
                )
            );
    }
    jQuery( ".wp-editor-area" ).each( function() {
        if ( jQuery( "#wp-" + this.id + "-wrap" ).length > 0 ) {
            if ( typeof ( tinyMCE ) != "undefined" ) tinyMCE.execCommand( "mceAddEditor", false, this.id );
        }
    });
    // jQuery('.mcba_color_picker').wpColorPicker(mcbaColorPickerOptions);
}

function highlightMockup( item, doHighlight ) {
    if ( doHighlight ) {
        // Add highlight
        jQuery( item ).append(
            jQuery( document.createElement( 'div' ) )
            .attr({
                'class': 'mcba_highlight_block ',
            } )
            .css({
                'height': '100%',
                'width': '100%',
                'position': 'absolute',
                'left': '0',
                'top': '0',
            } )
        );
    } else {
        jQuery( item ).find( ".mcba_highlight_block" ).remove();
    }
}
/**
 * Handle updates in the static fields (Color & Appearence and Company info)
 * @param textfield
 * @param index
 */
function onItemInfoChange( textfield, index ) {
    var field = jQuery( "#" + textfield.id );
    var button = jQuery( "#btn_item" + index );
    if ( field.attr( "value" ) == field.attr( "name" ) ) {
        // No change
        button.attr( "src", root_url + "images/delete.png" );
        button.attr( "onclick", "deleteItem(" + index + ")" );
    } else {
        // Changed
        button.attr( "src", root_url + "images/edit.png" );
        button.attr( "onclick", "updateItem(" + index + ")" );
    }
}

function deleteItem( item, page ) {
    //	jQuery(".mcba_loading_overlay").css('display','block');
    if ( typeof page === 'undefined' ) {
        page = MCBA.currentPage;
    }
    if ( typeof item === 'object' ) {
        item = item.position;
    }
    for ( var i = 0; i < MCBA.config.pages.length; i++ ) {
        // find the page
        if ( MCBA.config.pages[ i ].id == page ) {
            // find the item by index
            var deleted = MCBA.config.pages[ i ].items.splice( item, 1 );
            saveConfig();
            return;
        }
    }
}

function deleteDetail( page, item, detail ) {
    for ( var i = 0; i < MCBA.config.pages.length; i++ ) {
        if ( MCBA.config.pages[ i ].id == page ) {
            this.items[ item ].details.splice( detail, 1 );
            updateItemOverview();
            make_block_list_sortable();
            saveConfig();
            return;
        }
    }
}

function addPage( name ) {
    var newPage = {};
    newPage[ 'title' ] = name;
    newPage[ 'items' ] = [];
    MCBA.config.pages.push( newPage );
    MCBA.load( Number( MCBA.config.pages.length - 1 ) );
}
/**
 * Add a detail to an item
 * @param item The id of the item to add this detail
 * @param detailTitle The title of the new detail
 */
function addDetail( page, item, detail ) {
    for ( var i = 0; i < MCBA.config.pages.length; i++ ) {
        if ( MCBA.config.pages[ i ].id == page ) {
            if ( typeof this.items[ item ].details === 'undefined' ) {
                this.items[ item ][ 'details' ] = [];
            }
            this.items[ item ].details.push( detail );
            updateItemOverview();
            make_block_list_sortable();
            saveConfig();
            return;
        }
    }
}
/**
 * Add a new item to an existing page
 */
function addPageItem( page, block ) {
    var item = getDefaultItem( block.template );
    item[ 'type' ] = block.type;
    MCBA.config.pages[ page ].items.push( item );
    jQueryjQuery( jQuery( '#mcba_mockup' ).contents().find( 'body' ) ).data( 'mcba' ).load( MCBA.config, MCBA.currentPage );
    updateItemOverview();
    make_block_list_sortable();
}

function getNextId( array ) {
    var id = 0;
    array.forEach( function ( arrayItem ) {
        if ( arrayItem[ 'id' ] && arrayItem[ 'id' ] > id ) {
            id = arrayItem[ 'id' ];
        }
    });
    return ++id;
}

function editDetail( page, item, detail, fieldValueArray ) {
    for ( var i = 0; i < MCBA.config.pages.length; i++ ) {
        if ( MCBA.config.pages[ i ].id == page ) {
            fieldValueArray.forEach( function ( element ) {
                if ( !element[ 'field' ] || typeof element[ 'value' ] === "undefined" ) {
                    console.log( "Improperly formed fieldValueArray, must be like the following: [{field:'field1', value:'myvalue'},{field:'field2', value:'othervalue'}]" );
                    return -3;
                }
                MCBA.config.pages[ i ][ 'items' ][ item ].details[ detail ][ element[ 'field' ] ] = element[ 'value' ];
            });
            saveConfig();
            return;
        }
    }
}

function setOption( key, value ) {
    MCBA.config.options[ key ].value = value;
    MCBA.load();
}

function clearAll() {
    if ( confirm( "Clear all content?" ) == true ) {
        MCBA.config.pages = [ {
            'title': 'Home'
        } ];
        MCBA.load();
    }
}

function findPageIndex( page ) {
    // Find by id
    for ( var i = 0; i < MCBA.config[ 'pages' ].length; i++ ) {
        if ( MCBA.config[ 'pages' ][ i ][ 'id' ] == page ) {
            return i;
        }
    }
    return -1;
}

function hexToRgb( color ) {
    var usePound = false;
    if ( color[ 0 ] == "#" ) {
        color = color.slice( 1 );
        usePound = true;
    }
    var num = parseInt( color, 16 );
    var r = ( num >> 16 );
    var g = ( num & 0x0000FF );
    var b = ( ( num >> 8 ) & 0x00FF );
    //Clamp r
    if ( r > 255 ) r = 255;
    else if ( r < 0 ) r = 0;
    //Clamp g
    if ( g > 255 ) g = 255;
    else if ( g < 0 ) g = 0;
    //Clamp b
    if ( b > 255 ) b = 255;
    else if ( b < 0 ) b = 0;
    return [ r, g, b ];
}

//! <saveConfig>
/*
 #####                           #####
#     #    ##    #    #  ###### #     #   ####   #    #  ######     #     ####
#         #  #   #    #  #      #        #    #  ##   #  #          #    #    #
 #####   #    #  #    #  #####  #        #    #  # #  #  #####      #    #
      #  ######  #    #  #      #        #    #  #  # #  #          #    #  ###
#     #  #    #   #  #   #      #     #  #    #  #   ##  #          #    #    #
 #####   #    #    ##    ######  #####    ####   #    #  #          #     ####
 */

function saveConfig( launch, revert, callback ) { 
    jQuery( ".mcba_loading_overlay" ).css( 'display', 'block' );
    var data = {};
    data[ 'action' ] = "mcba_save";
    data[ 'config' ] = JSON.stringify( MCBA.config );
    data[ 'launch' ] = launch;
    if ( typeof revert !== 'undefined' && revert ) {
        data[ 'revert' ] = 1;
    }
    jQuery.ajax({
        type: "POST",
        url: ajax_url,
        dataType: "json",
        data: data,
        success: function ( response ) {
            jQuery( ".mcba_loading_overlay" ).css( 'display', 'none' );
            if ( typeof callback !== "undefined" ) {
                callback( response );
            } else {
                console.log( response );
            }
        },
        error: function ( xhr, status, error ) {
            jQuery( ".mcba_loading_overlay" ).css( 'display', 'none' );
            console.log( "ERROR" );
            console.log( error[ 'message' ] );
            if ( typeof callback !== "undefined" ) {
                callback( error );
            }
        }
    });
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
  ####     ##    #    #  ###### #     #   ####   #    #  ######     #     ####
 #        #  #   #    #  #      #        #    #  ##   #  #          #    #    #
  ####   #    #  #    #  #####  #        #    #  # #  #  #####      #    #
      #  ######  #    #  #      #        #    #  #  # #  #          #    #  ###
 #    #  #    #   #  #   #      #     #  #    #  #   ##  #          #    #    #
  ####   #    #    ##    ######  #####    ####   #    #  #          #     ####
  */
//! </saveConfig>


function setTemplate( template, callback ) {
    /* template must be set */
    if ( typeof template !== "string" ) {
        return -1;
    }
    jQuery( ".mcba_loading_overlay" ).css( 'display', 'block' );
    var data = {};
    data[ 'action' ] = "mcba_settemplate";
    data[ 'template' ] = template;
    jQuery.ajax({
        type: "POST",
        url: ajax_url,
        dataType: "json",
        data: data,
        success: function ( response ) {
            jQuery( ".mcba_loading_overlay" ).css( 'display', 'none' );
            if ( typeof callback !== "undefined" ) {
                callback( response );
            } else {
                console.log( response );
            }
        },
        error: function ( xhr, status, error ) {
            console.log( "ERROR" );
            console.log( error[ 'message' ] );
            if ( typeof callback !== "undefined" ) {
                callback( error );
            }
        }
    });
}


function confirmAndLaunch() {
    if ( window.confirm( 'Launch to all users?' ) ) {
        saveConfig( 1, 0, function ( response ) {
            //console.log(response);
            if ( response.error ) {
                alert( response.response );
            } else {
                alert( "Successfully launched!" );
            }
        });
    }
}

function confirmAndRevert() {
    if ( window.confirm( 'Revert to last saved configuration? You will lose any unsaved changes.' ) ) {
        saveConfig( 0, 1, function ( response ) {
            console.log( response );
            if ( response.error ) {
                alert( response.response );
            } else {
                if ( response.revert === false ) {
                    alert( response.response );
                } else {
                    alert( "Successfully reverted!" );
                }
            }
        });
    }
}