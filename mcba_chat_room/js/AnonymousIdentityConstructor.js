/*
 * class AnonymousIdentityConstructor
 *
 * constructUserWithIpAddress()
 * insertNewUser()
 * insertedNewUser()
 * verifyNewUser()
 * createConversationId()
 * getConversationIdAfterInsert()
 * gotConversationIdAfterInsert()
 * 
 */

class AnonymousIdentityConstructor {
    constructor( identityArg ) {
        this.identity = identityArg;
        this.dataSource = DataSourceFactory.getInstance();
        console.log( "getting user with ip address..." );
        this.constructUserIdWithIpAddress();
    }

    constructUserIdWithIpAddress() {
        var url = "https://api.ipify.org/?format=json";
        jQuery.getJSON( url, function ( dataArg ) {
            console.log( "got my ip, it is: " + dataArg.ip );
            messageManager.ip = dataArg.ip;
            this.insertNewUser( messageManager.ip );
        }.bind( this )).done( "done. got ip.");
    }

    insertNewUser( ip_address ) {
        var nextFunction = 'insertedNewUser';
        console.log( "insertNewUser called with ip: " + ip_address + ".  next function is " + nextFunction );
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        var values = "'Guest', " +  // first_name
        "'', " +                    // last_name
        "'', " +                    // rewards
        "'browser'," +              // device
        "'" + ip_address + "', '" + // email
        "', " +                     // password
        "'" + ip_address + "', '" + // uid
        "0', " +                    // isAdmin
        "''";                       // pushid  
        var args = {
            query: 'insert into wp_mcba_users (first_name, last_name, rewards, device, email, password, uid, isAdmin, pushid) values (' + values + ')',
            trigger: nextFunction,
            thisObject: this
        }
        console.log( "making api call...");
        this.dataSource.runQuery( args );
    }
    
    insertedNewUser( event, results ) {
        messageManager.log( 'Event: '  + event.type );
        console.log( "inside inserted new user.  verify user made it into the database..." );
        // results.thisObject.verifyNewUser( event, results );
        var nextFunction = "verifyNewUser";
        jQuery( document ).one( nextFunction, results.thisObject[ nextFunction ] );
        var args = {
            query: "select * from wp_mcba_users where uid='" + messageManager.ip + "'",
            trigger: nextFunction,
            thisObject: results.thisObject
        }
        results.thisObject.dataSource.runQuery( args );
    }

    verifyNewUser( event, results ) {
        var self = results.thisObject;
        if ( typeof( results.data ) == "object" ) {
            if ( results.data[ 0 ]) {
                console.log ( "data array exists." );
                if ( results.data[ 0 ].length == 0 ) {
                    throw( "*** ERROR: looks like an empty array. failed to verifyNewUser. ***" );
                } else {
                    console.log( "the data array has data.  lets grab the ID..." );
                    console.log( "remembering id: " + results.data[ 0 ].ID + "." );
                    self.identity.setId( results.data[ 0 ].ID );
                    self.identity.setCookie( "user_id", results.data[ 0 ].ID );
                    self.identity.name = results.data[ 0 ].first_name;     // set 1st name
                    self.identity.email = messageManager[ 'ip' ]; 
                    console.log( "establishing conversation id..." );
                    results.thisObject.createConversationId( results );
                }
            }
        } else {
            throw( "*** ERROR: unknown result.data type! ***" );
        }
    }

    createConversationId( results ) {
        var nextFunction = "getConversationIdAfterInsert";
        jQuery( document ).one( nextFunction, results.thisObject[ nextFunction ] );
        var values = "'" + results.thisObject.identity.object_id + "', '" +
        'expert@'      + "', '" +
        '0'            + "', '" +  
        '0'            + "', '" +  
        messageManager.ip;   

        console.log( "values: " + values );  
        var sql = "insert into wp_mcba_chat_conversations " + 
        "(user, admin, admin_unread_messages, user_unread_messages, mcba_chat_system_id) " +
        " values (" + values + "')";

        console.log( "creating new conversation for id: " + results.thisObject.identity.object_id + "..." );
        var args = {
            query:      sql,
            trigger:    nextFunction,
            thisObject: this
        }
        results.thisObject.status = "inserting row into conversation table...";
        messageManager.log( results.thisObject.status );
        this.dataSource.runQuery( args );
    }

    getConversationIdAfterInsert( event, results ) {
        if ( !results.thisObject ) { 
            console.log( "*** Warning: get conversation id called without a valid this object.  exiting method... ***" ); 
            return; }
        var nextFunction = "gotConversationIdAfterInsert";
        jQuery( document ).one( nextFunction, results.thisObject[ nextFunction ] );
        var args = {
            query:   "select * from wp_mcba_chat_conversations where user='" + results.thisObject.identity.object_id + "'",
            trigger: nextFunction,
            thisObject: results.thisObject
        }
        results.thisObject.dataSource.runQuery( args );
    }

    gotConversationIdAfterInsert( event, result ) {
        console.log( "got conversation id after insert called... " );
        console.log( "Event: " + event.type );
        if ( result.data.includes( "ERROR:" )) {
            var error = "*** ERROR: could not find conversation id that I just inserted! ***";
            console.error( error );
            return;
        } else {
            var conversation_id = result.data[ 0 ].conversation_id;
            messageManager.conversation_id     = conversation_id;

                // the mcba_chat_system_id is needed for the router to work

            messageManager.mcba_chat_system_id = conversation_id;  
            console.log( "assigned conversation_id: " + conversation_id + " making it active..." );
            messageManager.setActiveChatId( conversation_id );
            result.thisObject.identity.setCookie( "first_name", "Guest" );
            result.thisObject.identity.setCookie( "conversation_id", conversation_id );
            databaseSync.setConversationId( conversation_id );
            messageManager.setId( result.thisObject.identity.object_id );
            result.thisObject.identity.setId( result.thisObject.identity.object_id );
            result.thisObject.identity.logUpdate( "Anonymous Identity constructed.  starting database sync..." );
            databaseSync.start();
        }       
    }
}
