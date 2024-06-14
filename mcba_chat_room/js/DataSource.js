/*
 *	DataSource class
 */
 class DataSource {
    constructor( logger_arg ) { 
        this.logger = logger_arg || // or an object that has a logUpdate() method...
                      { logUpdate: function( textToLog ) { console.log( textToLog ); }}; }
        
    setLogger( loggerObject ) { if( !this.logger ) { this.logger = loggerObject; }}

    runQuery_dev( apiArgs ) {  // send data, redirect result.
        jQuery.post( this.url, { sql: apiArgs.query }).done( function( dataArg ) {
            try {
                apiArgs.data = JSON.parse( dataArg );
                if ( apiArgs.data.error.length > 0 ) {
                    apiArgs.thisObject.logUpdate( "*** ERROR: " + apiArgs.data.error + " *** " );
                }
            } catch( e ) {
                console.log( "*** ERROR: failed to parse JSON data from server. ***" );
                console.log( "*** ERROR: dataArg: " + dataArg + " ***" ); }
            jQuery( document ).trigger( /* event */ apiArgs.trigger, /* event arguments */ apiArgs );
        }); }
        
    runQuery( apiArgs ) {  // send data, redirect result.  re-wrote for WordPress in June 2022. 
       // this.logger.logUpdate( "running query: " + apiArgs.query );
        let data = {};
        data[ 'action' ] = "mcba_run_query";
        data[ 'sql'    ] = apiArgs.query;
        data[ 'test'   ] = apiArgs.query;
        jQuery.ajax({
            type: "POST",
            url: ADMIN_URL,
            dataType: "json",
            data: data,
            success: function ( response ) {
                    let event_object = apiArgs.event_object ? apiArgs.event_object : document;
                    apiArgs.data = response;
                    jQuery( event_object ).trigger( /* event */ apiArgs.trigger, /* event arguments */ apiArgs );
                },
            error: function ( _xhr, _status, error ) {
                console.log( "*** ERROR: failed to run query. ***" );
                console.log( "ERROR" );
                console.log( error[ 'message' ] );
                if ( typeof callback !== "undefined" ) {
                    callback( error ); }}
        });
    }     
}
