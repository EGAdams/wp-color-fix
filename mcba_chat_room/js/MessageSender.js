/** @class MessageSender */
class MessageSender {
    constructor() { this.logUpdate = function( text_to_log ) { console.log( text_to_log); }}

    sendMessage( messageManager ) {
        this.logUpdate( "sending message..." );    // bail if 0 or null
        if ( messageManager.active_chat_id == 0 || !messageManager.active_chat_id ) {
            alert( "active chat has not been set!  There are no guests to talk to.  Exiting process..." );
            jQuery( '#messageForm' ).find( 'input' ).val( '' );
            return;  }                                                

        const text = jQuery( '#messageForm' ).find( 'input' ).val();
        if ( !text.trim() ) return alert( 'Please type a message.' ); // no msg submitted
        let now = new Date();
        if ( messageManager.active_chat_id ) {
            let activeguest = Object();
            if ( messageManager.isAdmin ) {
                activeguest = chatBox.chatRouter.activeGuest;
            } else {
                activeguest = messageManager.activeGuest;
                activeguest.chat_id = messageManager.conversation_id;
                activeguest.conversation_id = messageManager.conversation_id; }
            if ( !activeguest ) { console.error( "*** ERROR: no active guest!, exiting... *** " ); return; }
            if ( !activeguest.name ) { activeguest.name = "Guest"; }
            if ( !activeguest.email ) {
                console.log( "*** WARNING: active guest  email is empty!  setting email to chat_id... *** " );
                activeguest.email = activeguest.chat_id; }

            let fromEmail = "";
            if ( messageManager.isAdmin ) {
                fromEmail = messageManager.identity.usersEmail;
            } else {
                if ( messageManager.identity.email ) {
                    fromEmail = messageManager.identity.email;
                } else {
                    messageManager.identity.email = messageManager.ip;
                }}
            let fromName = "";
            if ( messageManager.isAdmin ) {
                fromName = messageManager.identity.name;
            } else {
                if ( messageManager.name ) {
                    fromName = messageManager.identity.name;
                } else {
                    messageManager.identity.name = "Guest";
                    this.logUpdate( "*** ERROR: can not set name!  not sure about this error... ***" );
                }}
            this.msg = {
                from_email: fromEmail,
                from_name: fromName,
                date: now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(),
                email: activeguest.email,
                name: activeguest.name,
                text: text,
                sender: messageManager.identity.object_id,
                chat_id: activeguest.chat_id,
                chat_win: activeguest.chat_id,
                conversation_id: activeguest.conversation_id,
                isAdmin: messageManager.isAdmin,
                readstatus: 0,
                source_machine: "browser",
                mcba_id: activeguest.mcba_id,
                recipient_token: activeguest.sender_token,
                sender_token: messageManager.identity.object_id }
        } else {
            console.error( "*** ERROR: no active chat id!  Not sending message. *** " );
            return;
        }
        if ( !this.msg.sender || !this.msg.sender_token ) {
            let error = "*** ERROR: message does not have enough sender information! ***";
            this.logUpdate( error );
            return;
        }
        jQuery( '#messageForm' ).find( 'input' ).val( '' ); // clear input
        this.msg[ "action" ] = "chat_message_input";        // a clone of chatMessageInput.php  the wordpress action...
        this.msg[ "message" ] = this.msg.text;
        this.msg[ "ID" ] = this.msg.mcba_id;
        this.msg[ "senderId" ] = this.msg.sender;                // to rid nasty error message
        this.msg[ "sender_photo_url" ] = "default.jpg";
        this.msg[ "recipient" ] = this.msg.recipient_token;
        if( !this.msg[ "conversation_id" ] ) this.msg[ "conversation_id" ] = this.msg.chat_id;
        this._sendToMysql();
        let dataArg = new DataArg( this.msg );
        let tempMessage = new Message( dataArg );
        messageManager.chatBox._addMessage( tempMessage.getSendText( this.msg.chat_id ));
        jQuery( ".chatbot_send_chat_text" ).css( "background-color", chatBox.MAIN_CHAT_COLOR );
        jQuery( ".messages_container"  ).scrollTop( function() { return messageManager.scrollHeight; });  
    }

    _sendToMysql() {
        let callback = new VerifySentMessage( this.msg );
        jQuery.ajax({
            type: "POST",
            url: ADMIN_URL,
            dataType: "json",
            data: this.msg,
            success: function ( response ) {
                if ( typeof callback !== "undefined" ) { callback.verifySentMessage( response ); }},
            error: function ( _xhr, _status, error ) {
                console.log( error[ 'message' ] );
                if ( typeof callback !== "undefined" ) { callback( error ); }}}); }
}
