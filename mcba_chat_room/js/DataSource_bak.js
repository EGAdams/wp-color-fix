/*
 *	DataSource class
 */
 class DataSource {
    constructor() {  // establish communication address
        this.url = "https://mycustombusinessapp.com/wp-content/plugins/MCBA-Wordpress/runQuery.php"; } 

    runQuery( apiArgs ) {  // send data, redirect result.
        jQuery.post( this.url, { sql: apiArgs.query }).done( function( dataArg) {
            try {
                apiArgs.data = JSON.parse( dataArg );
            } catch( e ) {
                console.log( "*** ERROR: failed to parse JSON data from server. ***" );
                console.log( "*** ERROR: dataArg: " + dataArg + " ***" );
            }
            jQuery( document ).trigger( /* event */ apiArgs.trigger, /* event arguments */ apiArgs );
        }); }
}
