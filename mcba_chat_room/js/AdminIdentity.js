/*
 *
 * class AdminIdentity
 * 
 * populates identity information for the administrator
 * 
 */


class AdminIdentity extends Identity {

    constructor() {
        super();
            // set the active guest as the mcba administrator
            // TODO: rename to getAdminInfo.php

        let nextFunction = "buildAdminIdentity";
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let args = {
            query: "select wp_mcba_users.*, wp_mcba.mcba_id from wp_mcba_users, wp_mcba " +
                    "where wp_mcba_users.isAdmin='1'and wp_mcba.id='1'",
            trigger: nextFunction,
            thisObject: this  }
        this.dataSource.runQuery( args ); }

        buildAdminIdentity( _event, results ) {
            console.log( "admin data loaded.  building this admin identity..." );
            let data                             = results.data[ 0 ];
            results.thisObject.usersEmail        = data[ 5 ];
            results.thisObject.sender_token      = data[ 7 ];
            results.thisObject.conversation_id   = "";
            results.thisObject.mcba_id           = data[ 'mcba_id' ];
            results.thisObject.object_id         = data[ 0 ];
            results.thisObject.first_name        = data[ 1 ];
            results.thisObject.last_name         = data[ 2 ];
            results.thisObject.name              = data[ 1 ];
            messageManager.setId( data[ 0 ]);
            console.log( "done constructing Admin." );
            setInterval( function() { databaseSync.populateAdminDash(); }, 5000 ); }
}
