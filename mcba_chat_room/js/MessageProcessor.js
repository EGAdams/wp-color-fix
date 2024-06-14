/** @class MessageProcessor */
class MessageProcessor {
    constructor( chatRouterArg, dbArg ) {
        this.chatRouter = chatRouterArg;
        this.dbRef = dbArg; 
        this.logout_selector = ".send_a_message"; } // this is in router.js inside a method.  had to define here...

    processMessage( message, messageManager ) { // make sure that the message is for this conversation and process...
        if ( !messageManager.chatBox.chatRouter.route( message, messageManager )) { return; } // bail if not...
        messageManager.messageCounter.updateCount( message, messageManager );
        if ( messageManager.isAdmin ) {
            jQuery( '.conversation_list' ).find( 'li' ).off().click( function ( e ) {
                jQuery( '.conversation_list' ).find( 'li' ).removeClass( 'selected_conversation_list' );
                e.target.classList.add( 'selected_conversation_list' );
                // messageManager.active_chat_id = 0;  // otherwise we end up with a wrong conversation id
                // maybe not... 012524                          
                // we are still ending up with a wrong conversation id
                // im wondering why the chat router conversattions are 
                // being compared to the id below.  the only thing
                // that i can think of is that something was duplicated
                // and i was trying to fix it somehow.  investigating...
                messageManager.chatBox.clearScreen(); 
                messageManager.setCurrentEvent( e ); // the call below becomes asynchronous!  remember e.
                messageManager.setActiveChatId( $( e.target ).data( 'conversationId' )); // not coming back.
                // commented out the set method below 012524.  not sure what it is for, but since the id 
                // is set to "0" above, anything with a "0" will be the active chat id.  this is wrong.

                // *** Moved below to _set on 012524
                // for ( let i = 0; i < Object.keys( chatRouter.conversations ).length; i++ ) {
                //     if ( Object.keys( chatRouter.conversations )[ i ].includes( messageManager.active_chat_id ) ) {
                //         // messageManager.setActiveChatId( Object.keys( chatRouter.conversations )[ i ] );
                //     }
                // }
                // messageManager.chatBox.update( messageManager, e );
                // let send_message_selector = ".chatbot_send_airplane";
                // jQuery( ".login_sign_in" ).html( '' ); // admin does not ever need to log or sign in.
                // jQuery( this.logout_selector ).off().on( 'click', logOut );
                // jQuery( send_message_selector ).off().on( 'click', sendMessage );
                // jQuery( "#messageForm input" ).off( 'keyup' ).on( 'keyup', sendIfEnter );
            }.bind( this ));
            messageManager.chatBox.update( messageManager );
            jQuery( ".login_sign_in" ).html( '' ); // admin does not ever need to log or sign in.
        } else { messageManager.chatBox.update( messageManager ); }}
}
