/** @class ActiveChatId */
class ActiveChatId {
	constructor( messageManagerArg ) { 
		this.logger = LoggerFactory.createLogger( "ActiveChatId" );
		this.messageManager = messageManagerArg; }

    set( activeChatIdArg ) {
        this.verifiedChatId = activeChatIdArg; 
        this.verifyChatIdExecutor = new VerifyChatId( activeChatIdArg, this, "_set" ); 
        this.verifyChatIdExecutor.run(); }  // when you're done, call _set().
    
	_set( _event, result ) {
        if ( result.data.length == 0 ) { 
            result.thisObject.logger.logUpdate( " *** Warning: chat id not in database.  creating anon... *** " ); 
            result.thisObject.identity = new AnonymousIdentity(); // async 
            return; }
            
        setTimeout ( function () { result.thisObject.logger.logUpdate( "finished verifying chat id." ); }, 1000 );
        let logger         = result.thisObject.callingObject.logger;          
        let manager        = result.thisObject.callingObject.messageManager;  // easier
        let verifiedChatId = result.thisObject.callingObject.verifiedChatId;  // reading
        logger.logUpdate( "setting active chat id to: " + verifiedChatId );
        if ( manager.active_chat_id != "0" ) {  // we never want the conversation id to be zero.
            logger.logUpdate( "setting previous active chat id to: " + manager.active_chat_id );
            manager.previous_active_chat_id = manager.active_chat_id;
        } else {
            logger.logUpdate( "setting previous active chat id to: " + verifiedChatId + " ( active chat id was zero )" );
            manager.previous_active_chat_id = verifiedChatId; }
        if ( manager.isAdmin ) {
            logger.logUpdate( "set this guest as active" );
            manager.active_chat_id = manager.getKeyFromPartial( verifiedChatId, manager );
            if ( manager.chatBox.chatRouter.conversations[ manager.active_chat_id ] ) {
                manager.activeGuest = manager.chatBox.chatRouter.conversations[ manager.active_chat_id ][ 0 ];
            } else { console.log( "*** WARNING: trying to set an active id in an undefined conversation ***" );  return; }

            logger.logUpdate( "set admin and email for active guest.  we know the guest is not admin at this point!" );
            manager.activeGuest.isAdmin = "false";
            logger.logUpdate( "setting active guest" );
            manager.chatBox.chatRouter.activeGuest = manager.activeGuest;
            manager.chatBox.update( manager );                                    // ... then clear the unread
            jQuery( ".selected_conversation_list" ).html( jQuery( ".selected_conversation_list" ).html().split( '&' )[ 0 ] ); 
            manager.getConversationId( manager.activeGuest.email );
        } else {
            manager.active_chat_id = verifiedChatId;
            logger.logUpdate( "finished setting active chat id to: " + verifiedChatId );
            let nextFunction = "setGuestAsAdministrator";
            jQuery( document ).one( nextFunction, manager[ nextFunction ] );
            let args = {
                query: "select wp_mcba_users.*, wp_mcba.mcba_id from wp_mcba_users, wp_mcba " +
                       "where wp_mcba_users.isAdmin='1'and wp_mcba.id='1'",
                trigger: nextFunction,
                thisObject: manager  }
            setTimeout(() => { logger.logUpdate( "running query to select the admin so that we can set a guest, task finished." ); }, 1000 );
            manager.dataSource.runQuery( args ); }
            
            // move from MessageProcessor on 012524.  the MessageProcessor was trying to call verify
            // conversation id, which is an asynchronous call that ends up at here ( _set ) and not the next line
            // of the MessageManager's code.
            // since the active chat id was set to zero, the code was not being called
            // since we are calling it here, the active chat id is not zero, it is alive and
            // active in chatRouter.conversations causing setActiveChatId to be called every time
            // the messages are processed!
            // adding code to check if the conversation is active.  if it is, skip the set active chat id.
            var active_id_set_flag = false;
            for ( let i = 0; i < Object.keys( chatRouter.conversations ).length; i++ ) {
                if ( Object.keys( chatRouter.conversations )[ i ].includes( manager.active_chat_id )) {
                    var current_key = Object.keys( chatRouter.conversations )[ i ];
                    if ( current_key != manager.getActiveChatId() ) {
                        manager.setActiveChatId( current_key ); // this calls verify chat id, 
                                                                // which is asynchronous!
                        logger.logUpdate( "active chat id set to: " + manager.active_chat_id );
                        active_id_set_flag = true;
                    } // else do nothing.  this is called every time the database is polled.
                }
            }
            if ( !active_id_set_flag ) { logger.logUpdate( "*** ERROR: active chat id not found in conversations ***" ); return; }

            manager.chatBox.update( manager, manager.getCurrentEvent()); // set before async call
            let send_message_selector = ".chatbot_send_airplane";
            jQuery( ".login_sign_in" ).html( '' ); // admin does not ever need to log or sign in.
            jQuery( this.logout_selector ).off().on( 'click', logOut );
            jQuery( send_message_selector ).off().on( 'click', sendMessage );
            jQuery( "#messageForm input" ).off( 'keyup' ).on( 'keyup', sendIfEnter );
            logger.logUpdate( "finished setting active chat id to: " + manager.active_chat_id );
        }
}
