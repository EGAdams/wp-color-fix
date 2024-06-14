// .../plugins/.../www/...  updated 052824
// define the function that loads scripts into memory
console.log( "loading init.js from inside plugins directory 040724..." );

function loadScript(src) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.setAttribute('src', src);
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.getElementsByTagName('head')[0].appendChild(script);
    }); }
 function loadStyle( src, callback ) {
    if ( src.indexOf( "http" ) == -1 ) { src = this.rootDir + src;}
    var file = document.createElement( 'link' );
    var loaded;
    file.setAttribute( 'href', src );
    file.setAttribute( 'rel', 'stylesheet' );
    file.setAttribute( 'type', 'text/css' );
    if ( callback ) {
        file.onreadystatechange = file.onload = function () {
            if ( !loaded ) { callback();}
            loaded = true;
        };
    }
    document.getElementsByTagName( 'head' )[ 0 ].appendChild( file );
}
console.log( "declaring function waitForVariable..." );
function waitForVariable() {
    return new Promise((resolve, reject) => {
        const checkInterval = 1000; // Interval in milliseconds to check for the variable
        const maxAttempts = 10; // Maximum number of attempts to check the variable
        let attempts = 0;

        const checkVariable = () => {
            if (typeof config_data !== 'undefined') {
                resolve( config_data ); // Resolve the promise when the variable is defined
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    console.log( "waiting for config_data to be defined..." )
                    setTimeout(checkVariable, checkInterval); // Check again after a delay
                } else {
                    reject(new Error('Variable was not defined within the expected time.'));
                }
            }
        };
        checkVariable();
    }); }
    
    // define the path for app_config.json so we can download it first!
    // let app_config_path = website_address + "/wp-content/plugins/MCBA-Wordpress/www/";
    
    // Load logger scripts into memory
    console.log( "loading logger scripts into memory..." );
    logger_library_path = "https://mycustombusinessapp.com/wp-content/plugins/MCBA-Wordpress/logger/";
    var website_address  = config_data.options.website.value;
    let pattern = /\/:([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+)/;
    let matches = website_address.match( pattern );
    if ( matches && matches[ 1 ]) {
        console.log("https://" + matches[ 1 ]);
        website_address = "https://" + matches[ 1 ];
    } else {
        console.log( "*** ERROR: Invalid company website.  Please have admin configure it.***" );
    }
    let widget_path = website_address + "/wp-content/plugins/MCBA-Wordpress/www/js/widgets/";
    var initLogger      = null; // logger factory doesn't exist yet, otherwise we would create it here.
    Promise.all([
        loadStyle(  widget_path         + "jquery-ui.css"            ),
        loadScript( widget_path         + "jquery-ui.min.js"         ),
        loadScript( widget_path         + "jquery.min.js"            ),
        loadScript( widget_path         + "Anchor.js"                ),
        loadScript( widget_path         + "CustomButton.js"          ),  // not loading below
        loadScript( logger_library_path + "LogObjectFactory.js"      ),
        loadScript( logger_library_path + "LoggerFactory.js"         ),
        loadScript( logger_library_path + "MonitorLedClassObject.js" ),
        loadScript( logger_library_path + "MonitorLed.js"            ),
        loadScript( logger_library_path + "MonitoredObject.js"       ),
        loadScript( logger_library_path + "SourceData.js"            ),
        loadScript( logger_library_path + "FetchRunner.js"           ),
        loadScript( logger_library_path + "Model.js"                 ),
    ]).then(() => {
    initLogger = LoggerFactory.createLogger( "InitSupervisor" );
    initLogger.logUpdate( "logger objects loaded. init logger created.  Initializing... " );
    waitForVariable().then((variableValue) => {
        console.log('Variable is now defined:', variableValue);
        startInitializing();
    }).catch((error) => {
        console.error(error);
    });
}).catch( error => { 
    console.error( "Script loading failed: ", error );
    // initLogger.logUpdate( "Script loading failed: ", error );
});

function startInitializing() {                                // start initializing...
    var website_address  = config_data.options.website.value;
    let pattern = /\/:([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+)/;
    let matches = website_address.match( pattern );
    if ( matches && matches[ 1 ]) {
        console.log("https://" + matches[ 1 ]);
        website_address = "https://" + matches[ 1 ];
    } else {
        console.log( "*** ERROR: Invalid company website.  Please have admin configure it.***" );
    }
    let widget_path = website_address + "/wp-content/plugins/MCBA-Wordpress/www/js/widgets/";
    let template_path = website_address + "/wp-content/plugins/MCBA-Wordpress/www/templates/" + config_data.template + "/";
    // load template.json and the widgets into memory... 
    Promise.all([
        loadScript( widget_path + "template.json"   ),
        loadScript( widget_path + "Anchor.js"       ),
        loadScript( widget_path + "CustomButton.js" ),
        loadScript( widget_path + "ButtonRow.js"    ),
        loadScript( widget_path + "SingleButton.js" )
    ]).then(() => {
        // initLogger = LoggerFactory.createLogger( "InitSupervisor" );
        // initLogger.logUpdate( "widgets loaded and logger created.  Initializing MCBA god object... " );
        initializeMCBA();
    }).catch( error => { 
        console.error( "Script loading failed: ", error );
        // initLogger.logUpdate( "Script loading failed: ", error );
    }); }

var indexFile = 'index.html';
var isMockup = false;
var BlockListSubject;

function defineBlockListSubject() {
    if ( typeof BlockListSubject == 'undefined' ) {
        /*
        *  BlockListSubject
        */
        BlockListSubject = ( function () {
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
    }
}
defineBlockListSubject();

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
            imgSRC = '../wp-content/plugins/MCBA-Wordpress/www/templates/' + config_data.template + '/images/' + item[ 'src' ];
        }
    }

    this.img = jQuery( document.createElement( 'img' ) )
        .attr( {
            'src': imgSRC,
        })
        .css( {
            'width': item[ 'percent' ] + '%',
            'height': item[ 'percent' ] + '%',
        });

    if ( typeof item[ 'position' ] !== 'undefined' ) {
        switch ( item[ 'position' ] ) {
            case 'Left':
                break;
            case 'Right':
                this.img.css( {
                    'margin-left': 'auto',
                });
                break;
            case 'Center':
                this.img.css( {
                    'margin-right': 'auto',
                    'margin-left': 'auto',
                });
                break;
            case 'Span':
                this.img.css( {
                    'margin-right': 'auto',
                    'margin-left': 'auto',
                    'width': '100%',
                });
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
        })
        .append( this.img );

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
            });
            this.img.css( {
                'margin-right': ''
            });
        } else if ( item.data.position == "Center" ) {
            this.img[ 0 ].style.marginLeft = "auto";
            this.img[ 0 ].style.marginRight = "auto";
        } else if ( item.data.position == "Left" ) {
            this.img.css( {
                'margin-left': ''
            });
            this.img.css( {
                'margin-right': 'auto'
            });

        }
        this.img[ 0 ].style.width = item.data.percent + "%";
    }

    self.subject = BlockListSubject.getInstance();
    self.subject.subscribe( self.update );

    this.getSubject = function () {
        return self.subject;
    }
}

/** @class GoogleMap */
function GoogleMap ( map_configuration ) {
    if ( !map_configuration ) { return; }
    console.log( "constructing GoogleMap in init.js from inside plugins... " );
    this.center_of_map = {
        lat: parseFloat( map_configuration.latitude ),
        lng: parseFloat( map_configuration.longitude ),
    };
    this.circle_radius = parseFloat( map_configuration.circle_radius );
    this.element = document.getElementById( "map" );
    if ( !this.element ) {
        this.element = document.createElement( "div" );
        this.element.setAttribute( "id", "map" );
        this.element.style.height = '71%';
        this.element.style.position = 'absolute';
        this.element.style.marginLeft = '4%';
        this.element.style.overflow = 'hidden';
        this.element.style.width = '91%';
        this.element.style.marginTop = '23%';
    }
    this.accept_button = document.createElement( "button" );
    this.accept_button.style.height = '45px';
    this.accept_button.style.width  = '145px';
    this.accept_button.style.position = 'absolute';
    this.accept_button.style.top = '753px';
    this.accept_button.style.left = '49px';
    this.accept_button.style.backgroundColor = "#f7f7f7";
    this.accept_button.addEventListener( "click", function() { 
        this.accept_button.style.color = 'white';
        this.accept_button.style.backgroundColor = "#4444ff"
        setTimeout( function() {
            this.accept_button.style.color = 'black';
            this.accept_button.style.backgroundColor = "#f7f7f7";
            Callback.askPermission();
        }.bind( this ), 1000 );
    }.bind( this ));
    this.accept_button.innerHTML = 'Accept';
    document.getElementById( "mcba_mockup" ).appendChild( this.accept_button );

    this.deny_button = document.createElement( "button" );
    this.deny_button.style.height = '45px';
    this.deny_button.style.width  = '145px';
    this.deny_button.style.position = 'absolute';
    this.deny_button.style.top = '753px';
    this.deny_button.style.left = '218px';
    this.deny_button.style.backgroundColor = "#f7f7f7";
    this.deny_button.addEventListener( "click", function() { 
        this.deny_button.style.color = 'white';
        this.deny_button.style.backgroundColor = "#4444ff"
        setTimeout( function() {
            this.deny_button.style.color = 'black';
            this.deny_button.style.backgroundColor = "#f7f7f7";
            Callback.showToast( "You will not receive any promotional notices." );
            MCBA.load( 0 );
        }.bind( this ), 1500 );
    }.bind( this ));
    this.deny_button.innerHTML = 'Deny';
    document.getElementById( "mcba_mockup" ).appendChild( this.deny_button );

    let proxi_explanation_text = `Due to being one of our valued customers, we will give you deals, offers, rewards, promotions and privileges that are not given to the general public while you are within the vicinity of our location giving you the unique time sensitive opportunity to take advantage of the preferred privileges of being a valued customer.`;
    this.proxi_explanation = document.createElement( "p" );
    this.proxi_explanation.style.height = '45px';
    this.proxi_explanation.style.width  = '337px';
    this.proxi_explanation.style.position = 'absolute';
    this.proxi_explanation.style.top = '20px';
    this.proxi_explanation.style.left = '37px';
    this.proxi_explanation.style.lineHeight = '12px';
    this.proxi_explanation.style.fontSize = '9px';
    this.proxi_explanation.innerHTML = proxi_explanation_text;
    document.getElementById( "mcba_mockup" ).appendChild( this.proxi_explanation );

    this.radius_div = document.createElement( "div" );
    this.radius_div.setAttribute( "id", "radius" );
    this.radius_div.innerHTML = map_configuration.circle_radius;
    this.element.appendChild( this.radius_div );
    this.map = new google.maps.Map( this.element, {
        zoom: 16,
        center: this.center_of_map,
        legend: "none",
        disableDefaultUI: true,
        scrollwheel: true,
    } );

    this.marker = new google.maps.Marker( {
        position: this.center_of_map,
        map: this.map,
        draggable: true,
        title: "Drag me to set your lat/lng.  Grab the circle to set your radius.",
    } );
    this.initializeEventListeners();
    setTimeout( () => { this.initializeCircle(); }, 500 );
}

GoogleMap.prototype.initializeEventListeners = function () {
    google.maps.event.addListener( this.marker, "dragend", function ( event ) {
        document.getElementById( "latbox" ).value = Number(
            this.getPosition().lat()
        ).toFixed( 6 );
        document.getElementById( "lngbox" ).value = Number(
            this.getPosition().lng()
        ).toFixed( 6 );
    } );
}

GoogleMap.prototype.initializeCircle = function () {
    this.circle = new google.maps.Circle( {
        map: this.map,
        radius: this.circle_radius,
        editable: true,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#00BFFF",
        fillOpacity: 0.35,
    } );
    this.circle.bindTo( "center", this.marker, "position" );
    google.maps.event.addListener(
        this.circle,
        "radius_changed",
        function () {
            console.log(
                "*** Radius changed.  might want to do something here... ***"
            );
            document.getElementById( "radius" ).value =
                this.circle.getRadius();
        }
    );
}

GoogleMap.prototype.update = function ( newData ) {
    if ( newData.type != this.constructor.name ) {
        return;
    }
}

GoogleMap.prototype.getSubject = function () {
    return this.subject;
}
/** end   @class GoogleMap   */

class Space {

    constructor( itemArg ) {
        if ( !itemArg ) { return; }
        this.item = itemArg;
        this.element = jQuery( document.createElement( 'div' ))
            .css( {
                'position': 'relative',
                'width': '100%',
            });

            this.setHeight();
            if ( typeof BlockListSubject == "undefined" ) defineBlockListSubject();
            this.subject = BlockListSubject.getInstance();
            this.subject.subscribe( this.update );
    }

    setHeight() {
        for ( var i = 0; i < this.item.height; i++ ) {
            this.element.append( document.createElement( 'br' ));
        }
    }

    update( newData ) {
        if ( newData.type != this.constructor.name )
            return;
        while ( this.element[ 0 ].lastElementChild ) {
            this.element[ 0 ].removeChild( this.element[ 0 ].lastElementChild );
        }
        if ( newData !== undefined )
            this.item.height = newData.height;
        this.setHeight();
    }

    getSubject() {
        return this.subject;
    };
}

/**
 * This is the connection that binds native devices to this file
 */
var Callback = ( typeof Device !== 'undefined' ? Device :
    // Set empty object
    {
        setTemplateRoot: function ( root ) { },
        onPageLoaded: function ( page ) { 
            console.log( "page loaded." );
            if ( MCBA.smartphone == true ) {
                console.log( "smartphone detected.  exiting onPageLoaded..." );
                return;
            }    
            var mcba_item_overview_length = 0;
            if ( document.getElementById( 'mcba_item_overview' ) != null ) {
                mcba_item_overview_length = document.getElementById( 'mcba_item_overview' ).innerHTML.length;
            } else {
                console.log( "*** WARNING: mcba_item_overview is null.  setting timeout for reload... ***" );
            }
            setTimeout( function() {
                console.log( "mcba_item_overview_length: " + mcba_item_overview_length );
                if ( mcba_item_overview_length < 100 ) {
                    console.log( "*** WARNING: looks like the page did not load.  reloading... ***" );
                    updateItemOverview();}
                let mcba_item_container = document.getElementById( "mcba_item_container" );
                if ( mcba_item_container.innerHTML.length == 0 ) { // when it fails, it's zero
                    let base_address = getBaseAddress( MCBA.config.admin_url );
                    MCBA.loadScript( base_address + "/wp-content/plugins/MCBA-Wordpress/www/js/widgets/jquery-ui.min.js",
                    buildToolBoxWidgets );
                }
            }, 1000 );
         },
        onScriptLoaded: function ( src ) { },
        showToast: function ( msg ) { },
        onMcbaReady: function () {
            console.log( "onMcbaReady, MCBA.load() wuz called here..." ); 
            MCBA.load()
        },
        exit: function () { },
        setTemplateColors: function ( type, color, iColor ) { },
    }
);
Callback.setTemplateRoot( config_data[ 'template' ] ); // MARK:  not sure about this so I left it in.

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

function Navigation() {

    this.element = jQuery( document.createElement( 'div' ))
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
                var keepCountForIOS = 0;
                for ( index in MCBA.config.pages ) {
                    newIndex = keepCountForIOS++;
                    elem.append(
                        jQuery( document.createElement( 'li' ))
                            .css( {
                                'cursor': 'pointer',
                            } )
                            .append(
                                jQuery( document.createElement( 'a' ))
                                    .attr( {
                                        'rel': 'external',
                                    } )
                                    .data( 'page', newIndex )
                                    .click( function () {
                                        var liindex = jQuery( '.navigation li' ).index( jQuery( this ).parent());
                                        var parsedPage = parseInt( jQuery( this ).data( 'page' ));
                                        //alert(parsedPage:"+parsedPage+" liindex:"+liindex);
                                        if ( isNaN( parsedPage )) parsedPage = liindex;
                                        MCBA.load( parsedPage );
                                    } )
                                    .append(
                                        jQuery( document.createElement( 'div' ))
                                            .attr( {
                                                'width': '100%',
                                                'height': '100%'
                                            } )
                                            .append( MCBA.config.pages[ index ].title.replace( /_/g, ' ' ).toUpperCase())
                                    )

                            )
                    );
                }
                return elem;
            } )( jQuery( document.createElement( 'ul' )) )


        );
}

function PageItem( item ) { // a wrapper for each item on a single page.  parses the JSON object 
    var self = this;        // and binds it to its respective template item then builds the element.
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
            console.log( "item object: " + this.type + " created with Function() inside init.js." )
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
        } else {
            console.log( "*** WARNING: constructor: " + this.item.type + " is not a constructor. ***" );
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


var MCBA = {};
function initializeMCBA() {
    /**
     * The main working class that handles all API functions
     */
    MCBA = {
        images_dir: '',
        types: [],       
        page_history: [],
        header: null,
        footer: null,
        navigation: null,
        pageItems: [],
        config: config_data,
        currentPage: 0,
        currentPagePtr: null,
        content: null,
        template: null,
        smartphone: false,

        updateSameTypes: function ( type ) {
            for ( const item in MCBA.pageItems ) {
                if ( MCBA.pageItems.hasOwnProperty( item )) {
                    const pageItem = MCBA.pageItems[ item ];
                    if ( pageItem.type == type ) {
                        pageItem.refresh();
                    }
                }
            }
        },

        /** MARK: MCBA Load
         * Load and render a page based on the existing MCBA.config 
         * arga: String | Object | Number - (String) 'back' will move back a page | 
         * (Object) a JSON formed Object that will replace MCBA.config | 
         * (Number) The page to jump to
         * manualPage (If arga is Object): Number - The page to jump to
         */
        load: function ( arga, manualPage ) {
            // initLogger.logUpdate( "calling load from plugins directory..." );
            this.pageItems = [];
            // this.images_dir = isMockup ? 'images/' : this.rootDir + 'images/';
            this.images_dir = isMockup ? 'images/' : this.www_url + 'images/';

            if ( typeof arga === 'string' ) {
                if ( arga === 'back' ) {
                    this.currentPage = this.page_history.pop();
                    if ( typeof this.currentPage === 'undefined' ) {
                        Callback.exit();
                    }
                }
            } else {
                if ( typeof this.currentPage !== 'undefined' && this.currentPage !== null ) {
                    this.page_history.push( this.currentPage );
                }
            }

            if ( typeof arga === 'object' ) {
                this.config = arga;
                if ( typeof manualPage !== 'undefined' ) {
                    this.currentPage = manualPage;
                } else {
                    this.currentPage = 0;
                }
            } else if ( typeof arga === 'number' ) {
                this.currentPage = arga;
            }

            this.currentPagePtr = MCBA.config.pages[ MCBA.currentPage ];
            if (MCBA.smartphone) {
                document.body.insertAdjacentHTML('beforeend', '<div id="mcba_mockup"></div>');
            }
            
            mcba_content_element = document.getElementById('mcba-content')
            if ( mcba_content_element ) {
                mcba_content_element.innerHTML = ''; // clear mockup page
            }
            
            // set the remaining children to html('')
            var html_count = 6;
            while (document.querySelector('#mcba_mockup div:nth-child(' + html_count + ')')) {
                document.querySelector('#mcba_mockup div:nth-child(' + html_count + ')').innerHTML = '';
                console.log('removing child: ' + html_count);
                html_count++;
            }
            
            // initLogger.logUpdate( "Done clearing mockup page." );
            var options = MCBA.config[ 'options' ];
            var footerItems = MCBA.config[ 'footer-items' ];
            var page = MCBA.config.pages[ Number( MCBA.currentPage ) ];
            var _pageName = page[ 'title' ].replace( /_/g, ' ' ).capitalize();


            var color_light = shade( options[ 'base_color' ].value, 20  );
            var color_dark  = shade( options[ 'base_color' ].value, -20 );

            // initLogger.logUpdate( "Creating new Navigation()..." );
            this.navigation = new Navigation();
            var contentElem = jQuery( document.createElement( 'div' ))
                .attr({
                    'id': 'index',
                    'data-role': 'index',
                    'data-theme': 'a'
                })

                /** Add Navigation **/
                .append( this.navigation.element ).appendTo( jQuery( '#mcba_mockup' ));
            //.appendTo(jQuery( "body" ));


            /******* Create Content *******/
            // initLogger.logUpdate( "Creating content..." );
            this.content =
                jQuery( document.createElement( 'div' ))
                    .attr( {
                        'data-role': 'content',
                        'id': 'mcba-content',
                    } )
                    .css( {
                        'background-color': page.background ?
                            page.background
                            :
                            MCBA.config.options.page_color.value,
                    } );

            jQuery( document.createElement( 'div' ))
                .attr( {
                    'id': 'page-content',
                } )
                .append( this.content )
                .appendTo( contentElem );
            contentElem.append( jQuery( document.createElement( 'div' )).attr( { 'class': 'clear' } ));


            if ( typeof page.items === 'undefined' ) {
                page.items = [];
            }

            /* Create each widget */
            // initLogger.logUpdate( "creating widgets for " + page.items.length + " items..." );
            for ( var i = 0; i < page.items.length; i++ ) {
                MCBA.addToPage( page.items[ i ] );
            }

            // Text style
            jQuery( "p" ).css( { 'color': options[ 'textcolor' ].value } );

            jQuery( 'body' ).css( { 'background-color': this.config.options[ 'background_color' ].value } );

            // List style
            jQuery( 'li' ).css( { 'color': options[ 'textcolor' ].value } );

            // Menu style
            jQuery( 'li > a > div' ).css( { 'color': options[ 'menu_text' ].value } );
            jQuery( ".navigation ul li" ).css( { 'background-color': this.config.options.base_color.value } );
            jQuery( ".mcba_menu li" ).css( { 'background-color': this.config.options.base_color.value } );

            // initLogger.logUpdate( "Done creating widgets. calling onPageLoad..." );
            MCBA.onPageLoad();
            Callback.onPageLoaded( MCBA.currentPage );
        },



        /** 
         * url: String - The url of the register.php file on the MCBA server
         * mcbaId: Int - The MCBA client ID
         * mac: String - The mac id of the device
         * type: Int - The device type ( Android = 1, iOS = 2 )
         * id: String - The push id of the device that will be registered
         */
        registerPushId: function ( url, mcbaId, mac, type, id ) {
            url = unescape( url );

            console.log( "Registering: " + typeStr + " mcbaId==" + mcbaId + " ID==" + id + " url==" + escape( url ));
            //alert( "Registering: " + typeStr + " ID=="+ id);

            /* Register with the MCBA server */
            jQuery.post(
                url,
                {
                    'pushid': id,
                    'device': type,
                    'mcba_id': mcbaId,
                },
                function ( data, status ) {
                    console.log( "Client REGISTRATION - Data: " + data + "\nStatus: " + status );
                    console.log( "Registering: " + typeStr + " mcbaId==" + mcbaId + " ID==" + id + " url==" + url );
                    //alert( "Client REGISTRATION - Data: " + data + "\nStatus: " + status);
                } );

            /* Register with proxy server */
            jQuery.post(
                "http://mycustombusinessapp.com/MCBA-MasterServer/registerAccount.php", // temp fix to avoid 409 conflicts
                {
                    'mcba_register': 'settings',
                    'mcba_id': mcbaId,
                    'pushid': id,
                    'device': type,
                },
                function ( data, status ) {
                    console.log( "Master REGISTRATION - Data: " + data + "\nStatus: " + status );
                    console.log( "Registering Master: " + type + " mcbaId==" + mcbaId );
                    //alert( "Master REGISTRATION - Data: " + data + "\nStatus: " + status);
                } );
        },


        /**
         * Load a script async 
         * src: String - The path to the script file with the template being the root to the relative path
         * callback: function - Executed when script finishes loading
         */
        loadScript: function ( src, callback ) {
            var original_src = src;
            if ( src.indexOf( "http" ) == -1 ) {
                src = "../wp-content/plugins/MCBA-Wordpress/www/templates/" + config_data.template + "/" + src;
            }

            var script = document.createElement( 'script' );
            var loaded;
            script.setAttribute( 'src', src );
            // set timer variable to time of day in 00:00:00 format
            var timer = new Date().toLocaleTimeString().replace( /([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3" );
            if ( script.src.includes( "file://" )) {
                console.log( "smart phone environment.  setting source to local smart phone file system at " + timer + "..." );
                script.setAttribute( 'src', templateDir + original_src );
                MCBA.smartphone = true;
            }
            if ( callback ) {
                script.onreadystatechange = script.onload = function () {
                    if ( !loaded ) {
                        callback();
                    }
                    loaded = true;
                    var progress_element = document.getElementById( "supersized-loader" );
                    if ( progress_element )
                        progress_element.style.display = "none";
                };
            }
            if ( script.src.includes( "1.13.3" )) {
                setTimeout( function() {
                    // jQuery( "#mcba_item_container" ).append( script );
                    document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
                }, 1000 );
            } else {
                document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
            }

            // Callback.onScriptLoaded(src);
        },

        /**
     * Load a CSS style async 
     * src: String - The path to the script file with the template being the root to the relative path
     * callback: function - Executed when script finishes loading
     */
        loadStyle: function ( src, callback ) {

            if ( src.indexOf( "http" ) == -1 ) {
                src = this.rootDir + src;
            }

            var file = document.createElement( 'link' );
            var loaded;
            file.setAttribute( 'href', src );
            file.setAttribute( 'rel', 'stylesheet' );
            file.setAttribute( 'type', 'text/css' );
            if ( callback ) {
                file.onreadystatechange = file.onload = function () {
                    if ( !loaded ) {
                        callback();
                    }
                    loaded = true;
                };
            }
            document.getElementsByTagName( 'head' )[ 0 ].appendChild( file );
        },


        /**
     * Load a link async 
     * src: String - The path to the script file with the template being the root to the relative path
     * callback: function - Executed when script finishes loading
     */
        loadLink: function ( src, rel, callback ) {
            src = this.rootDir + src;
            var file = document.createElement( 'link' );
            var loaded;
            file.setAttribute( 'href', src );
            file.setAttribute( 'rel', rel );
            if ( callback ) {
                file.onreadystatechange = file.onload = function () {
                    if ( !loaded ) {
                        callback();
                    }
                    loaded = true;
                };
            }
            document.getElementsByTagName( 'head' )[ 0 ].appendChild( file );
        },


        /**
         * Navigate back a page
         */
        back: function () {
            this.load( "back" )
        },


        /**
         * Manually set the current configuration object
         * config: Object - A JSON formed config script based on the app_config.json file
         */
        setConfig: function ( config ) {
            this.currentConfig = config;
        },


        /**
         * Creates an empty/default item on the page based on the template item's type
         * type: String - The item_name of the item defined in the template.json 
         */
        addDefaultItem: function ( type ) {
            var tmp = MCBA.template[ type.toLowerCase() ];
            tmp = buildTemplateItem( tmp );
            tmp[ 'type' ] = type;
            this.addToPage( tmp, true );
        },


        /**
         * Create a PageItem and display it on the page
         * item: Object - The JSON formed data, usually from the app_config.json script
         * save: Boolean - If true, push the passed item into the existing config (MCBA.config)
         */
        addToPage: function ( item, save ) {
            if ( save ) {
                // This object should be appended to the config
                MCBA.config.pages[ MCBA.currentPage ].items.push( item );
            }
            
            var pageItem = new PageItem( item );
            pageItem.refresh();

            if ( typeof pageItem.object.unique !== 'undefined' && pageItem.object.unique ) {
                for ( var i = 0; i < MCBA.pageItems.length; i++ ) {
                    if ( MCBA.pageItems[ i ].type === pageItem.type ) {
                        //Found duplicate of unique item, break
                        return;
                    }
                }
            }

            MCBA.pageItems.push( pageItem );

            if ( typeof pageItem.object.element !== 'undefined' ) {
                //Function has a DOM object
                hasContent = true;

                if ( pageItem.template && typeof pageItem.template.position !== 'undefined' ) {
                    switch ( pageItem.template.position ) {
                        case "before-content":
                            MCBA.content.before( pageItem.object.element );
                            break;
                        case "after-content":
                            MCBA.content.after( pageItem.object.element );
                            break;
                    }

                } else {
                    MCBA.content.append( pageItem.object.element );
                    MCBA.content.append( jQuery( document.createElement( 'div' )).attr( { 'class': 'clear' } ));
                    // MCBA.content.append( jQuery( document.createElement( 'br' )) );
                }

            }

        },



        /**
         * Get an option item from the MCBA.config
         * key: String - The option item_name as defined in app_config.json
         * returns JSON Object
         */
        getOption: function ( key ) {
            return MCBA.config.options[ key ];
        },


        /**
         * Builds a new empty item
         * @param templateItem
         * @returns new PageItem
         */
        getDefaultItem: function ( type ) {
            var tmpItem = buildTemplateItem( MCBA.template[ type ] );
            tmpItem[ 'type' ] = type;
            return new PageItem( tmpItem );
        },



        /**
         * Callback executed any time an MCBA page is loaded and displayed
         */
        onPageLoad: function () { },

        /**
         * Callback executed when a promoblast is received
         * message: String - The message from the promoblast
         */
        onPromoblast: function ( message ) {
            parent._alert = new parent.Function( "alert(arguments[0]);" );
            parent._alert( 'Test!' );
            //alert(message);
        },

        setCurrentOptions: function ( item ) {
            console.log( "setting current options for item: " + item.toString );
            item.update();

            console.log( "returning item: " + item.toString );
            return item;
        },

        print: function ( textToLog ) {
            var loc = window.location.pathname;
            console.log( loc + ":  " + textToLog );
        }
    };

    if ( typeof templateDir == "undefined" ) {
        MCBA.rootDir = "../wp-content/plugins/MCBA-Wordpress/www/templates/" + config_data.template + "/";
    } else {
        MCBA.rootDir = templateDir;
    }

    /* Import the template file */
    MCBA.loadScript( 'template.json', function () {
        // $initLogger = LoggerFactory.createLogger( "InitSupervisor" );
        /* Save all the types from the template as a variable */
        // initLogger.logUpdate( "template.json loaded.  populating MCBA.types... " );
        MCBA.template = template;
        var type_count = 0;
        for ( key in MCBA.template ) {
            // initLogger.logUpdate( "found key: " + key )
            MCBA.types.push( key );
            type_count++
        }
        // initLogger.logUpdate( "found " + type_count + " types." );

        MCBA.icons          = {}; // getIconData();
        MCBA.iconCategories = {}; // getIconCategoryData();

        // initLogger.logUpdate( "loading mcba.js ..." );
        MCBA.loadScript( "js/mcba.js", function () {
            // initLogger.logUpdate( "mcba.js loaded.  calling Callback.onMcbaReady... " );
            Callback.onMcbaReady();
        } );
    } )
}
function buildTemplateItem( templateItem ) {
    /* Build an empty value for each key in the template */
    // console.log('templateItem:'+JSON.stringify(templateItem))
    var data = {};
    if ( templateItem[ 'has-options' ] != false ) {
        for ( var i = 0; i < templateItem.items.length; i++ ) {  // change item_name to name below EG 2020
            if ( templateItem.items[ i ].type === "array" ) {

                // recurse through the array 

                data[ templateItem.items[ i ].name ] = [];
                data[ templateItem.items[ i ].name ].push( buildTemplateItem( { "items": templateItem.items[ i ].items } ));
            } else {
                data[ templateItem.items[ i ].name ] = templateItem.items[ i ].default;
            }
        }
    }
    return data;
}

function extract( array, key, value ) {
    for ( var i = 0; i < array.length; i++ ) {
        if ( array[ i ][ key ] == value ) {
            array[ i ][ 'extracted_index' ] = i;
            return array[ i ];
        }
    }
}

function shade( col, amt ) {
    var usePound = false;
    if ( col[ 0 ] == "#" ) {
        col = col.slice( 1 );
        usePound = true;}
    var num = parseInt( col, 16 );
    var r = ( num >> 16 ) + amt;

    if ( r > 255 ) r = 255;
    else if ( r < 0 ) r = 0;

    var b = ( ( num >> 8 ) & 0x00FF ) + amt;

    if ( b > 255 ) b = 255;
    else if ( b < 0 ) b = 0;

    var g = ( num & 0x0000FF ) + amt;

    if ( g > 255 ) g = 255;
    else if ( g < 0 ) g = 0;

    return ( usePound ? "#" : "" ) + ( g | ( b << 8 ) | ( r << 16 )).toString( 16 );}

String.prototype.capitalize = function ( lower ) {
    return ( lower ? this.toLowerCase() : this ).replace( /(?:^|\s)\S/g, function ( a ) { return a.toUpperCase(); } );};

function refreshFromBackEnd( newJSON ) {
    app_config = newJSON;
    MCBA.load( newJSON, 0 );}

function getTemplateColors( type ) {
    Callback.setTemplateColors( type, MCBA.getOption( type ), parseInt( MCBA.getOption( type ).replace( "#", "0x" )) );}
