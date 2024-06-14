/** @class AnonymousIdentity */
class AnonymousIdentity extends Identity {
    constructor() {
        super();
		this.logger = LoggerFactory.createLogger( "AnonymousIdentity" );
        this.logUpdate = function( text_to_log ) { this.logger.logUpdate( text_to_log ); }
        this.dataSource = DataSourceFactory.getInstance();
        this.constructUserIdWithIpAddress();
    } // kicks the whole thing off...

    constructUserIdWithIpAddress() {
        let url = "https://api.ipify.org/?format=json";
        jQuery.getJSON( url, function ( dataArg ) {
            console.log( "got my ip, it is: " + dataArg.ip );
            this.ip = dataArg.ip;
            this.insertNewUser( this.ip );
        }.bind( this ) ).done( console.log( "done. got ip." ) );
    }

    insertNewUser( ip_address ) {
        let nextFunction = 'insertedNewUser';
        console.log( "insertNewUser called with ip: " + ip_address + ".  next function is " + nextFunction );
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let random_string = Math.random().toString( 36 ).substring( 2, 7 ) + Math.random().toString( 36 ).substring( 2, 7 );
        let values = "'Guest', " + // first_name
            "'', " + // last_name
            "'', " + // rewards
            "'browser'," + // device
            "'" + ip_address + "', '" + // email
            "', " + // password
            "'" + ip_address + "', '" + // uid
            "0', " + // isAdmin
            "'" + random_string + "'"; // pushid  
        let args = {
            query: 'insert into wp_mcba_users (first_name, last_name, rewards, device, email, password, uid, isAdmin, pushid) values (' + values + ')',
            trigger: nextFunction,
            thisObject: this
        }
        console.log( "running query: " + args.query + "..." );
        this.dataSource.runQuery( args );
    }

    insertedNewUser( event, results ) {
        console.log( 'Event: ' + event.type );
        console.log( "inside inserted new user.  verify user made it into the database..." );
        let nextFunction = "verifyNewUser";
        jQuery( document ).one( nextFunction, results.thisObject[ nextFunction ] );
        let args = {
            query: "select * from wp_mcba_users where uid='" + results.thisObject.ip + "'",
            trigger: nextFunction,
            thisObject: results.thisObject
        }
        console.log( "running query: " + args.query + "..." );
        results.thisObject.dataSource.runQuery( args );
    }

    verifyNewUser( _event, results ) {
        let self = results.thisObject;
        if ( typeof ( results.data ) == "object" ) {
            if ( results.data[ 0 ] ) {
                console.log( "data array exists." );
                if ( results.data[ 0 ].length == 0 ) {
                    throw ( Error( "*** ERROR: looks like an empty array. failed to verifyNewUser. ***" ) );
                } else {
                    console.log( "the data array has data.  lets grab the ID..." );
                    console.log( "remembering id: " + results.data[ 0 ].ID + "." );
                    self.setId( results.data[ 0 ].ID );
                    self.setCookie( "user_id", self.object_id );
                    self.name = results.data[ 0 ].first_name; // set 1st name
                    self.email = self.ip;
                    results.thisObject.logUpdate( "establishing conversation id..." );
                    results.thisObject.createConversationId( results );
                }
            }
        } else {
            throw ( Error( "*** ERROR: unknown result.data type! ***" ) );
        }
    }

    createConversationId( results ) {
        let values = "'" + results.thisObject.object_id + "', '" +
            'expert@' + "', '" +
            '0' + "', '" +
            '0' + "', '" +
            this.ip;
        let sql = "insert into wp_mcba_chat_conversations " +
            "(user, admin, admin_unread_messages, user_unread_messages, mcba_chat_system_id) " +
            " values (" + values + "')";
        this.logUpdate( "creating new conversation for id: " + results.thisObject.object_id + "..." );
        let nextFunction = "getConversationIdAfterInsert";
        jQuery( document ).on( nextFunction, results.thisObject[ nextFunction ] );
        let args = {
            query: sql,
            trigger: nextFunction,
            thisObject: this
        }
        this.dataSource.runQuery( args );
    }

    getConversationIdAfterInsert( _event, results ) {
        if ( !results.thisObject ) {
            results.thisObject.logUpdate( "*** Warning: get conversation id called without a valid this object.  exiting method... ***" );
            return;
        }
        let nextFunction = "gotConversationIdAfterInsert";
        jQuery( document ).one( nextFunction, results.thisObject[ nextFunction ] );
        let args = {
            query: "select * from wp_mcba_chat_conversations where user='" + results.thisObject.object_id + "'",
            trigger: nextFunction,
            thisObject: results.thisObject
        }
        results.thisObject.dataSource.runQuery( args );
    }

    gotConversationIdAfterInsert( event, result ) {  // catch event here 
        result.thisObject.logUpdate( "got conversation id after insert called... " );
        result.thisObject.logUpdate( "Event: " + event.type );
        if ( result.data.includes( "ERROR:" ) ) {
            let error = "*** ERROR: could not find conversation id that I just inserted! ***";
            console.error( error );
        } else {
            let conversation_id = result.data[ 0 ].conversation_id;
            messageManager.conversation_id = conversation_id;
            messageManager.mcba_chat_system_id = conversation_id; // needed for router to work
            result.thisObject.logUpdate( "assigned conversation_id: " + conversation_id + " making it active..." );
            messageManager.setActiveChatId( conversation_id );
            result.thisObject.setCookie( "first_name", "Guest" );
            result.thisObject.setCookie( "conversation_id", conversation_id );
            databaseSync.setConversationId( conversation_id );
            messageManager.setId( result.thisObject.object_id );
            setTimeout( () => { result.thisObject.logUpdate( "Anonymous Identity has finished constructing.  starting database sync..." ); }, 1000 );
            result.thisObject.logUpdate( "Anonymous Identity has finished constructing.  starting database sync..." );
            messageManager.logUpdate( "finished initializing." );
            databaseSync.start();
        }
    }
}