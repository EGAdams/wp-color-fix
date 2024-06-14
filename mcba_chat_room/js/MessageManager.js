/**  @class MessageManager */
class MessageManager {
    
    conversation_id_exists( temp_id ) {
        if( temp_id.getCookie( "conversation_id" ).length == 0 ) {
            return false;
        } else {
            return true;
        }
    }

    constructor() {
        this.logger = LoggerFactory.createLogger( "MessageManager" );
        this.logUpdate = function( text_to_log ) { this.logger.logUpdate( text_to_log ); }
        this.messageCounter = new MessageCounter( this );
        let thisObject = this;
        this.active_chat_id = 0;
        this.chatBox = new Object();
        this.isAdmin = window.location.href.includes( "mcba_messaging" );
        this.isMonitor = window.location.href.includes( "test.html" );
        this.terminal = new EasyBox( "message_manager_screen" );
        this.ID_LENGTH = 20;
        this.dataSource = DataSourceFactory.getInstance();
		this.activeChatId = new ActiveChatId( this );
        this.currentEvent = null; // need to hold the event object for when a user is clicked.
        
        setTimeout( function () {
            const temp_id = new Identity();
            if ( security_token.length > 0 ) {
                console.log( "found security token: " + security_token + ".  validating..." );
                const tokenProcessor = new SecurityTokenProcessor( security_token );
                tokenProcessor.processSecurityToken();
            } else if ( this.isAdmin ) {
                thisObject.identity = new AdminIdentity();
            } else if( temp_id.isKnown()) {  // create from thin air and check the cookie...
                console.log( "constructing known identity..." );
                // if the conversation_id_exists() is true, then we can set the identity to known
                if( this.conversation_id_exists( temp_id )) {
                    thisObject.identity = new KnownIdentityConstructor( this, temp_id );
                } else {
                    // If not, retrieve it using the user_id from the cookie
                    let user_id = temp_id.getCookie( "user_id" );
                    if ( user_id ) {
                        this.getConversationIdFromDatabase( user_id, temp_id );
                    } else {
                        console.error( "No user_id found in cookie. Cannot retrieve conversation ID." );
                    }
                }
            } else {
                thisObject.identity = new AnonymousIdentity(); // async
            }}.bind( this ), 1000 );
    }
    
    getActiveChatId() { return this.active_chat_id; }
    setCurrentEvent( currentEventArg ) { this.currentEvent = currentEventArg; }
    getCurrentEvent() { return this.currentEvent; }

    gotConversationIdFromDatabase( event, result ) {
        console.log( "Event: " + event.type );
        if (result && result.conversation_id) {
            this.conversation_id = result.conversation_id;
            this.setCookie("conversation_id", this.conversation_id);
            result.thisObject.identity = new KnownIdentityConstructor( this, temp_id );
        } else {
            console.log("Unable to retrieve conversation ID from the database.");
            console.log( "creating the anonymous guest..." );
            result.thisObject.identity = new AnonymousIdentity(); // async
        }
    }    

    getConversationIdFromDatabase( user_id, temp_id ) { 
        let nextFunction = "gotConversationIdFromDatabase";
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let query_arg = "SELECT conversation_id FROM wp_mcba_chat_conversations WHERE user = '" + user_id + "'";
        let args = {
            query: query_arg,
            trigger: nextFunction,
            thisObject: this }
        this.dataSource.runQuery( args ); }

    getSendMessageClass() { return this.sendMessageClass; }
    getSendMessageText() { return this.sendMessageText; }
    updatePacketTerminal( packet ) { this.terminal.write( packet.data.terminal_text ); }

    createMessageText( messageArg ) {
        let now = new Date();
        let dateText = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
        let message = "";
        let chat_id = messageArg.chat_id.substring( messageArg.chat_id.length, messageArg.chat_id.length - this.ID_LENGTH );
        if ( !this.isAdmin && ( messageArg.isAdmin == false || messageArg.isAdmin == 'false' )) {
            message = messageArg.getSendText( chat_id );                // guest sending message, right side
        } else if ( this.isAdmin && ( messageArg.isAdmin == true || messageArg.isAdmin == 'true' )) {
            message = messageArg.getSendText( chat_id );                // admin sending message, right side
        } else {
            message = messageArg.getReceiveText( chat_id );             // incoming message, left side
            messageArg.read = true;
        }
        return message; }

    updateMsgs( data, messagerouter, dbRef ) {
        if ( keys.includes( data.key )) { return; }
        this.logUpdate( "creating new message..." );
        let message = new Message( data );
        
        if ( message.sender_token && !message.recipient_token && ( message.source_machine == "Android" || message.source_machine == "iPhone" ) &&
            this.isAdmin ) {  // check for smart phone no chat id problem
            console.log( "getting conversation information..." );
            this.getConversationEmailForMessageUpdate( message, messagerouter, dbRef );
        } else { this.processMessage( message, this ); }}

    getConversationEmailForMessageUpdate( messageArg, messagerouterArg, dbRefArg ) {
        let nextFunction = "gotConversationEmail";
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let args = {
            query: "select * from wp_mcba_chat_conversations where conversation_id='" + messageArg.chat_id + "'",
            trigger: nextFunction,
            thisObject: {
                messageManager: this,
                messagerouter: messagerouterArg,
                message: messageArg,
                dbRef: dbRefArg  }}
        this.dataSource.runQuery( args ); }

    gotConversationEmail( event, result ) {
        console.log( "Event: " + event.type );
        let userid = result.data[ 0 ][ 'user' ];
        let chatid = result.thisObject.message.chat_id

        if ( result.thisObject.messageManager.is_email_address( userid )) {
            result.thisObject.message.chat_id = userid;
            result.thisObject.mcba_chat_system_id = userid; // the mcba_chat_system_id is needed for the router to work
            console.log( "assigned chat id: " + userid );
        } else {
            result.thisObject.message.chat_id = chatid;
            result.thisObject.mcba_chat_system_id = chatid;
            console.log( "assigned chat id: " + chatid ); }
        // now that we have the id for the conversation...
        result.thisObject.messageManager.processMessage( result.thisObject.message, result.thisObject.messageManager ); }

    is_email_address( text ) { return !!( text.includes( "@" )); }

    setActiveChatId( activeChatArg ) {
        this.logUpdate( "setting active chat id to: " + activeChatArg );
        if ( this.active_chat_id != "0" ) {  // we never want the conversation id to be zero.
            this.previous_active_chat_id = this.active_chat_id;
        } else {
            this.previous_active_chat_id = activeChatArg;
        }
        if ( this.isAdmin ) {

            // set this guest as active

            this.active_chat_id = this.getKeyFromPartial( activeChatArg );
            if ( window[ "chatRouter" ].conversations[ this.active_chat_id ] ) {
                this.activeGuest = window[ "chatRouter" ].conversations[ this.active_chat_id ][ 0 ]
            } else {
                console.log( "*** WARNING: trying to set an active id in an undefined conversation ***" );
                return;
            }

            // set admin and email for active guest.  we know the guest is not admin at this point!

            this.activeGuest.isAdmin = "false";

            // set chatrouters active guest

            chatBox.chatRouter.activeGuest = this.activeGuest;

            // populate the conversation id here

            this.getConversationId( this.activeGuest.email );
        } else { // this is just a regular old user it will only have the admin as it's guest
            this.active_chat_id = activeChatArg;
            let nextFunction = "setGuestAsAdministrator";
            jQuery( document ).off().one( nextFunction, this[ nextFunction ] );
            let args = {
                query: "select wp_mcba_users.*, wp_mcba.mcba_id from wp_mcba_users, wp_mcba " +
                       "where wp_mcba_users.isAdmin='1'and wp_mcba.id='1'",
                trigger: nextFunction,
                thisObject: this  }
            this.dataSource.runQuery( args );
        }
    }

    setGuestAsAdministrator( _event, result ) {
        if ( result.data.length == 0 ) {
            alert( "The chat system will not work without an administrator configured.  " +  
                   "Please contact the administrator to resolve this problem if this feature is needed." );
            throw Error( "*** ERROR: no admin found ***" ); }
        result.thisObject.logUpdate( "data loaded." );
        let data = result.data[ 0 ];
        let guest = {};
        guest.source_machine = data[ 4 ]; // TODO: we will need a translation for this
        guest.usersEmail = data[ 5 ];
        guest.sender_token = data[ 7 ];
        guest.chat_id = data[ 7 ];  // same as sender token
        guest.recipient_token = "";
        guest.conversation_id = "";
        guest.mcba_id = data[ 'mcba_id' ];
        guest.isAdmin = true;
        guest.recipient_token = "none";
        guest.name = data[ 1 ];
        result.thisObject.logUpdate( "setting newly built Admin guest to active... " );
        result.thisObject.activeGuest = new Guest( guest );
        result.thisObject.chatBox.chatRouter.activeGuest = result.thisObject.activeGuest;
        result.thisObject.logUpdate( "finished constructing Admin guest." );
    }

    getConversationId( email ) {
        if ( !email ) {
            if ( this.active_chat_id ) {
                let conversation_id = this.active_chat_id;
                this.activeGuest.conversation_id = conversation_id;
                console.log( "assigned conversation_id: " + conversation_id );
                this.status = "assigned conversation id.";
                return;
            } else { throw Error( "*** ERROR: can not set conversation id! ***" ); }}

        console.log( "getting conversation id..." );
        let nextFunction = "gotConversationId";
        // if this is admin, there will be a conversation_list_root_div
        let this_event_object = $( "#conversation_list_root_div" ).length > 0 ? "#conversation_list_root_div" : document;
        jQuery( this_event_object ).one( nextFunction, this[ nextFunction ] );
        let args = {
            event_object: this_event_object,
            query: "select * from wp_mcba_chat_conversations where user='" + email + "'",
            trigger: nextFunction,
            thisObject: this }
        this.dataSource.runQuery( args ); }

    gotConversationId( event, result ) {
        console.log( "Event: " + event.type );
        console.log( result.data )

        let conversation_id = result.data[ 0 ].conversation_id;
        messageManager.activeGuest.conversation_id = conversation_id;
        // the mcba_chat_system_id is needed for the router to work
        // messageManager.mcba_chat_system_id = conversation_id;  
        console.log( "assigned conversation_id: " + conversation_id );
        result.thisObject.status = "assigned conversation id."; }

    setId( newId ) { 
        this.object_id = newId; // this.setMonitorId( newId );
        const data = { object_id: newId };
        const event_name = "got-valid-runtime-id";
        let valid_runtime_id_event = new CustomEvent( event_name, { bubbles: true, detail: data });
        document.dispatchEvent( valid_runtime_id_event); }  // creates object row
    
    getKeyFromPartial( partial, manager ) {
        let keyFound = null;
        Object.keys( manager.chatBox.chatRouter.conversations ).forEach( function ( key ) {
            if ( key.includes( partial )) { keyFound = key; }});
        return keyFound; }

    setScreen( newScreenId ) { this.terminal.screen = document.getElementById( newScreenId ); }
    setChannel( channelArg ) { this.channel = channelArg; }
    setChatBox( chatBoxArg ) { this.chatBox = chatBoxArg; }
    setCurrentMessage( messageArg ) { this.currentMessage = messageArg; }
}
