/*
 * class KnownIdentityConstructor
 */
class KnownIdentityConstructor extends Identity {

    constructor( messageManager, temp_id ) {
        super();
        messageManager.setId( temp_id.getCookie( "user_id" ));
        messageManager.conversation_id         = temp_id.getCookie( "conversation_id" );
        messageManager.name                    = temp_id.getCookie( "first_name" );
        messageManager.email                   = temp_id.getCookie( "email" );
        messageManager.previous_active_chat_id = temp_id.getCookie( "previous_active_chat_id" );              

        // the mcba_chat_system_id is needed for the router to work
        messageManager.mcba_chat_system_id = messageManager.conversation_id; 
        console.log( "assigned conversation_id: " + messageManager.conversation_id + " making it active..." );
        messageManager.setActiveChatId( messageManager.conversation_id );
        databaseSync.setConversationId( messageManager.conversation_id );
        databaseSync.start(); }
}
