/* 
 *  Identity class 
 */

class Identity {

    constructor() {
        this.dataSource = DataSourceFactory.getInstance();
        this.isAdmin    = window.location.href.includes( "mcba_messaging" );
        this.isMonitor  = window.location.href.includes( "test.html"      );
        this.email      = this.getCookie( "email"   );
        this.object_id  = this.getCookie( "user_id" );
        this.status     = "constructing...";
        this.logUpdate  = function( text_to_log ) { console.log( text_to_log ); }
    }

    isKnown() { return this.object_id.length > 0; }

    setCookie( cookie_name, cookie_value, expires_in_days ) {
        let the_date = new Date();
        the_date.setTime( the_date.getTime() + ( expires_in_days * 24 * 60 * 60 * 1000 ) );
        let expires = "expires=" + the_date.toUTCString();
        document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/";
    }

    getCookie( cookie_name ) {
        let name = cookie_name + "=";
        let decodedCookie = decodeURIComponent( document.cookie );
        let ca = decodedCookie.split( ';' );
        for ( var i = 0; i < ca.length; i++ ) {
            var c = ca[ i ];
            while ( c.charAt( 0 ) == ' ' ) {
                c = c.substring( 1 );
            }
            if ( c.indexOf( name ) == 0 ) {
                return c.substring( name.length, c.length );
            }
        }
        return "";
    }

    delete_cookie( name ) { document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'; }

    getMcbaUserIdAfterInsert() {
        this.logUpdate( "starting getMcbaUserIdAfterInsert..." );
        let nextFunction = "gotMcbaUserIdAfterInsert";
        jQuery( document ).on( nextFunction, this[ nextFunction ] );
        let args = {
            query: "select * from wp_mcba_users where uid='" + messageManager.ip + "'",
            trigger: nextFunction,
            thisObject: this
        }
        this.dataSource.runQuery( args );
    }

    gotMcbaUserIdAfterInsert( _event, results ) {
        results.thisObject.object_id = results.data[ 0 ].ID;
        results.thisObject.status = "got mcba user id after update.";
        messageManager.log( results.thisObject.status );
        this.logUpdate( "got id: " + results.thisObject.object_id + "  start from here." );
        messageManager.log( "got id: " + results.thisObject.object_id + "  setting id in cookie..." );
        results.thisObject.name = results.data[ 0 ].first_name;             // set 1st name
        this.logUpdate( "calling create conversation id ..." );
        results.thisObject.createConversationId( results );
    }

    getConversationId( results ) {
        if ( !results.thisObject ) { 
            this.logUpdate( "*** Warning: get conversation id called without a valid this object.  exiting method... ***" ); 
            return; }
        if ( results.thisObject.status == "getting conversation id..." ) {
            this.logUpdate( "*** Warning: get conversation id called while already getting a conversation id.  exiting method... ***" ); 
            return;
        } else {
            results.thisObject.status = ( "getting conversation id..." );    
        }

        let nextFunction = "gotConversationId";
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let args = {
            query:   "select * from wp_mcba_chat_conversations where user='" + this.object_id + "'",
            trigger: nextFunction,
            thisObject: this
        }
        results.thisObject.dataSource.runQuery( args );
    }

    gotConversationId( event, result ) {
        this.logUpdate( "Event: " + event.type );
        if ( result.data.includes( "ERROR:" ) && result.thisObject.status == "last_try" ) {
            let error = "*** ERROR: could not find conversation id that I just inserted! ***";
            console.error( error );
        } else if ( result.data.includes( "ERROR:" ) && !result.query.includes( "insert into" )) {
            if( result.thisObject.status.includes( "inserting new user..." )) {
                let warning = "Warning: createConversation id is about to be called when the status is: " + result.thisObject.status + ". exiting... ***";
                this.logUpdate( warning );
                messageManager.log( warning );
                return;
            }
        } else if ( result.query.includes( "insert into" )) {
            result.thisObject.status = "last_try";
            result.thisObject.getConversationId( result );
        } else {
            let conversation_id = result.data[ 0 ].conversation_id;
            messageManager.conversation_id     = conversation_id;

            // the mcba_chat_system_id is needed for the router to work
            messageManager.mcba_chat_system_id = conversation_id;  

            this.logUpdate( "assigned conversation_id: " + conversation_id );
            result.thisObject.status = "assigned conversation id.";
            messageManager.setActiveChatId( conversation_id );

        }
    }

    getConversationId( results ) {
        if ( !results.thisObject ) { 
            this.logUpdate( "*** Warning: get conversation id called without a valid this object.  exiting method... ***" ); 
            return; }

        results.thisObject.status = "getting conversation id after insert...";    

        let nextFunction = "gotConversationIdAfterInsert";
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let args = {
            query:   "select * from wp_mcba_chat_conversations where user='" + results.thisObject.object_id + "'",
            trigger: nextFunction,
            thisObject: results.thisObject
        }
        results.thisObject.dataSource.runQuery( args );
    }

    getConversationIdAfterInsertFromVerify( results ) {
        if ( !results.thisObject ) { 
            this.logUpdate( "*** Warning: get conversation id called without a valid this object.  exiting method... ***" ); 
            return; }

        results.thisObject.status = "getting conversation id after insert from verify...";    

        let nextFunction = "gotConversationIdAfterInsert";
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let args = {
            query:   "select * from wp_mcba_chat_conversations where user='" + results.thisObject.object_id + "'",
            trigger: nextFunction,
            thisObject: results.thisObject
        }
        results.thisObject.dataSource.runQuery( args );
    }
    setId( newId ) { this.object_id = newId; /* this.setMonitorId( newId ); */ }
}
