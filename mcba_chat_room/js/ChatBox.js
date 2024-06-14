/** ChatBox class */
class ChatBox {
    constructor( chatRouterArg ) {
        this.chatRouter = chatRouterArg;
        this.msgForm = document.getElementById( "messageForm" );
        this.msgInput = document.getElementById( "msg-input" ); // TODO: remove this property
        this.msgBtn = document.getElementById( "msg-btn" ); // TODO: remove this property
        this.msgScreen = document.getElementById( "messagesContainer" );
        const colorManager = new ChatColorManager();
        setTimeout( () => { colorManager.getChatMainColor( this, "setMainChatColor" ); }, 250 ); }

    setMainChatColor( _event, result ) { result.thisObject.MAIN_CHAT_COLOR = result.data[ 0 ][ 0 ]; }

    clearScreen() { this.msgScreen.innerHTML = ""; }

    clearConversation( conversation_id_arg ) {
        delete this.chatRouter.conversations[ conversation_id_arg ]; }

    _addMessage( messageText ) { this.msgScreen.innerHTML += messageText; }

    update( manager, _event ) {
        if ( !this.msgScreen ) { return; } // no screen? bye..
        if ( jQuery( "#staticcallbutton" ).length > 0 ) {
            if ( jQuery( "#staticcallbutton" ).css( "display" ) != "none" ) { return; }}
        let chat_id = manager.active_chat_id;
        this.clearScreen();
        if ( chat_id != 0 && chat_id != null && chat_id != undefined ) {
            if ( _event !== undefined ) {  // clear the unread next...
                jQuery( _event.target ).html( jQuery( _event.target ).html().split( '&' )[ 0 ] ); } 
        } else { return; }

        let messages = [];
        if ( this.chatRouter.conversations[ chat_id ] ) {
            messages = this.chatRouter.conversations[ chat_id ][ 0 ].messages; }

        let topHtml = '<div class="chatbot_receive_chat_row_container">';
        topHtml += '    <div class="chatbot_receive_chat_text">';
        topHtml += '        Welcome to our chat. Is there anything that I can help you with?';
        topHtml += '    </div>';
        topHtml += '    <div>&nbsp;&nbsp;</div>';
        topHtml += '    <div></div>';
        topHtml += '</div>';
        if ( !messageManager.isAdmin ) {
            this._addMessage( topHtml )
        }
        let email = messageManager.identity.getCookie( "email" );
        if ( email.length != 0 ) {
            // replace the "Log in or Sign up" text with the new user identifier
            jQuery( ".login_sign_in" ).html( "Logged in as: " + email + "&nbsp&nbsp <a id='log_out_link'>Log Out</a>" );
            setTimeout( function () {
                jQuery( "#log_out_link" ).off().on( 'click', function () {
                    logOut();
                }); // set the log out link
            }, 1000 );
        }
        messages = this.sort_with_keys( messages );
        for ( let message in messages ) {
            this._addMessage( manager.createMessageText( messages[ message ])); }

        manager.messageCounter.clearCount( chat_id, messageManager );
        jQuery( ".chatbot_send_chat_text" ).css( "background-color", this.MAIN_CHAT_COLOR );
        jQuery( ".messages_container" ).scrollTop( function () {
            return this.scrollHeight;
        });
        if ( manager.messageCount > 0 ) {
            jQuery( '.top-row' ).css( 'right', '1.5%' );
        }
        jQuery( '#sign_up_link' ).off().on( 'click', function () {
            signOn()
        }); // hook login sign in clicks 
        jQuery( '#login_link' ).off().on( 'click', function () {
            login()
        });
    }

    sort_with_keys( messages ) {
        if ( messages.length < 2 ) { return messages; } // need at least two of 
                                                        // anything to perform a sort :)
        return messages.sort( function ( a, b ) { return a.key - b.key }); }

    setCookie( cookie_name, cookie_value, expires_in_days ) {
        let the_date = new Date();
        the_date.setTime( the_date.getTime() + ( expires_in_days * 24 * 60 * 60 * 1000 ) );
        let expires = "expires=" + the_date.toUTCString();
        document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/"; }

    draw( formObject ) {
        console.log( "drawing chatbox... " );
        let div = jQuery( "#chat-box" ); // get the div and insert the html...
        div.html( formObject.originalHtml );
        // div.addClass( "chat-area" );    // we removed this earlier.  put it back.
        chatBox.msgScreen = document.getElementById( 'messagesContainer' );
        jQuery( ".chatbot_login_sign_in" ).html( "Logged in as: " + formObject.email + "&nbsp&nbsp <a id='log_out_link'>Log Out</a>" );
        setTimeout( function () {
            jQuery( "#log_out_link" ).off().on( 'click', function () { logOut(); }); }, 1000 );

        this.setCookie( "email", formObject.email, 1 );
        let send_button_selector = '.chatbot_send_airplane';
        let message_input_selector = '.input_area input_text';
        jQuery( send_button_selector ).off().on( 'click', sendMessage );
        jQuery( message_input_selector ).off( 'keyup' ).on( 'keyup', sendIfEnter );
        jQuery( ".unread_message_counter" ).css( "display", "none" ); }
}
