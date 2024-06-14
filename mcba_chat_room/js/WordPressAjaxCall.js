/*
 *  class WordPressAjaxCall
 */
class WordPressAjaxCall {
    constructor() {}

    runAjax( apiArgs ) {
        jQuery.ajax( {
            type: "POST",
            url: ADMIN_URL,
            dataType: "json",
            data: apiArgs,
            success: function ( response ) {
                if ( typeof callback !== "undefined" ) {
                    callback( response );
                } else {
                    apiArgs[ 'data' ] = response;
                    jQuery( document ).trigger( /* event */ apiArgs.trigger, /* event arguments */ apiArgs );
                }
            },
            error: function ( _xhr, _status, error ) {
                console.log( "*** ERROR: failed to make ajax call. ***" );
                console.log( "XHR Status: " + _status );
                console.log( "XHR Response: " + _xhr.responseText );
                console.log( "Error Message: " + error.message );
                console.log( "Error Stack Trace: " + error.stack );
                if ( typeof callback !== "undefined" ) {
                    callback( error );
                }
            }
        } );
    }
} // end class WordPressAjaxCall

