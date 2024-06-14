/** @class MessageCounter */
class MessageCounter {
    constructor() { this.unreadMessageCounts = {}; }
    updateCount( message, messageManager ) {
        if ( message.readstatus == 0 && message.chat_id != messageManager.active_chat_id ) {  // if message is unread
            if ( this.unreadMessageCounts[ message.chat_id ]) {      // and chat id is already in the unread message counts,
                this.unreadMessageCounts[ message.chat_id ].count++; // increment the unread message count for this conversation
            } else {
                this.unreadMessageCounts[ message.chat_id ] = {};                   // otherwise make a new unread message count
                this.unreadMessageCounts[ message.chat_id ][ "count" ] = 1;        // and set the unread message count to 1
            }    
            const $listElement = jQuery( 'li:contains(' + message.email + ')' );
            $listElement.html( message.email + '&nbsp;&nbsp;<span style="background-color: red; color: white;">'
                + this.unreadMessageCounts[ message.chat_id ].count + '</span>' );            // update red unread message count 
            $listElement.children().css( 'border-radius', '50%' ).css( 'padding', '0% 1% 0% 1%' ); // make it a circle
        } else if ( message.readstatus == '0' && !messageManager.isAdmin // if message is unread and user is not admin
                    && message.data.sender_id != messageManager.identity.object_id ) {        // and user is not this user
            if ( this.unreadMessageCounts[ message.chat_id ]) {      // and chat id is already in the unread message counts,
                this.unreadMessageCounts[ message.chat_id ].count++; // increment the unread message count for this conversation
            } else {
                this.unreadMessageCounts[ message.chat_id ] = {};                   // otherwise make a new unread message count
                this.unreadMessageCounts[ message.chat_id ][ "count" ] = 1;        // and set the unread message count to 1
            }    
            console.log( "updating phone icon..." );
            jQuery( '.unread_message_counter' ).html( this.unreadMessageCounts[ message.chat_id ].count );
            if ( jQuery( '#staticcallbutton' ).css( 'display' ) != 'none' ) {
                jQuery( ".unread_message_counter" ).css( "display", "block" );
            }}}

    clearCount( conversation_id, messageManager ) {
        if ( this.unreadMessageCounts[ conversation_id ] ) {
            this.unreadMessageCounts[ conversation_id ].count = 0; }
        let resetReadCountQuery = `
        UPDATE wp_mcba_chat_conversations, wp_mcba_chat_messages
        SET wp_mcba_chat_conversations.${ messageManager.isAdmin ? "admin_unread_messages" : "user_unread_messages" } = 0,
        wp_mcba_chat_messages.readstatus = 1 
        WHERE wp_mcba_chat_conversations.conversation_id='${ conversation_id }' 
        AND wp_mcba_chat_messages.sender_id <>'${ messageManager.identity.object_id }' 
        AND wp_mcba_chat_messages.conversation_id='${ conversation_id }'`;
        resetReadCountQuery = resetReadCountQuery.replace( /\s+/g, " " );
        jQuery( document ).one( "checkQueryResult", this[ "checkQueryResult" ]);
        let args = { query: resetReadCountQuery, trigger: "checkQueryResult", thisObject: this };
        messageManager.dataSource.runQuery( args ); }

    checkQueryResult( _event, results ) {
       if ( results.data && results.data.length != 0 ) {
           console.log( results.data.error ? "*** ERROR: " + results.data.error + " ***" : "*** ERROR:  should be no data here ***" ); }}
}
