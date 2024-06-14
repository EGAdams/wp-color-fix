/*
 *
 * class AdminIdentityConstructor
 * 
 * populates identity information for the administrator
 * 
 */


class AdminIdentityConstructor {

    constructor( identity ) {
            
            // set the active guest as the mcba administrator
            // TODO: rename getAdminInfo.php

        let url = MCBA_URL + "getAdminAddress.php"; 
        jQuery.post( url ).done( function ( dataArg ) {
            console.log( "admin data loaded.  building identity..." );
            let data                = JSON.parse( dataArg );
            identity.usersEmail        = data[ 5 ];
            identity.sender_token      = data[ 7 ];
            identity.conversation_id   = "";
            identity.mcba_id           = data[ 'mcba_id' ];
            identity.object_id         = data[ 0 ];
            identity.first_name        = data[ 1 ];
            identity.last_name         = data[ 2 ];
            identity.name              = data[ 1 ]
            console.log( "done constructing Admin." );
            setInterval( function() {
                databaseSync.populateAdminDash();
            }, 5000 );
            databaseSync.populateAdminDash();
        });  
    }
}
