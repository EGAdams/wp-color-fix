 /** @class ChatBot */
class ChatBot {
    constructor( chatBoxDiv, greeting ) {   
        this.CHATBOT_HEADER                     = "chatbot_header";
        this.CHATBOT_LOGIN_SIGN_IN              = "chatbot_login_sign_in";
        this.CHATBOT_RECEIVE_CHAT_TEXT          = "chatbot_receive_chat_text";
        this.CHATBOT_SEND_CHAT_TEXT             = "chatbot_send_chat_text";
        this.CHATBOT_RECEIVE_CHAT_ROW_CONTAINER = "chatbot_receive_chat_row_container";
        this.CHATBOT_SEND_CHAT_ROW_CONTAINER    = "chatbot_send_chat_row_container";
        this.CHATBOT_INPUT_AREA                 = "chatbot_input_area";
        this.CHATBOT_BOTTOM_ROW                 = "chatbot_bottom_row"; 
        this.CHATBOT_SEND_AIRPLANE              = "chatbot_send_airplane";
        this.CHATBOT_INPUT_TEXT                 = "chatbot_input_text";
        this.div_id = "#" + chatBoxDiv;

        this.html = '<div class="container-fluid chatbot_sign_up_area" style="display: grid;" id="chat-box">'; // outer div container
        this.html += `
        <div class="top_row_grid_area">
            <div class="top-row">
                <div class="send_a_message_text"> 
                    <span class="close-left-arrow">&nbsp;&nbsp;<&nbsp; </span> 
                    Send a Message 
                </div>
                <a class="call-icon-container">
                    <div class="call-icon"></div>
                    <div class="call-text">CALL</div>
                </a>
            </div>
        </div> `;

        if ( !isAdmin ) {
            this.html += `<div class=${ this.CHATBOT_LOGIN_SIGN_IN }><a id="login_link">Log in</a> &nbsp; or &nbsp;
                            <a id="sign_up_link">Sign up</a>
                            <div></div>
                            <div></div>
                        </div>`; }

        this.html += `<div class="messages_container" id="messagesContainer">`;
        
        this.html += `<div class=${ this.CHATBOT_RECEIVE_CHAT_ROW_CONTAINER }>
            <div class=${ this.CHATBOT_RECEIVE_CHAT_TEXT }>
                ${ greeting }
            </div>
            <div>&nbsp;&nbsp;</div>
            <div></div>
            </div>`;
        this.html += `</div>`; // end messages_container

        this.html += `<div class="bottom_row_grid_area">
            <div class="${ this.CHATBOT_BOTTOM_ROW }">
                <div class="${ this.CHATBOT_INPUT_AREA }" id="messageForm"><input type="text" placeholder="Enter a message" 
                 class="${ this.CHATBOT_INPUT_TEXT }"></div>
                <div class="airplane-container">
                    <div class="${ this.CHATBOT_SEND_AIRPLANE }"></div>
                </div>
            </div>
        </div>`;
        this.html += '</div>'; } // end container class

    draw() {
        this.div = jQuery( this.div_id );      // get this div.
        this.div.removeClass( "chat-area" );   // otherwise we get a grid inside of a grid, not pretty...
        this.div.html( this.html );            // insert the html, then hook the click events.
        let colorManager = new ChatColorManager();
        colorManager.getChatMainColor( this, "setMainChatColors" ); }

    setMainChatColors( _event, result ) {
        if( result.data.error ) { throw Error( result.data.error ); }
        let phone = result.data[ 2 ][ 0 ];  // get the phone tel.  yes, this violates srp... it was too easy.
        console.log( "setting main chat colors now!" );
        jQuery( ".airplane-container"                         ).css(  "background-color", result.data[ 0 ][ 0 ]);
        jQuery( ".top_row_grid_area"                          ).css(  "background-color", result.data[ 0 ][ 0 ]);
        jQuery( ".chatbot_send_chat_text"                     ).css(  "background-color", result.data[ 0 ][ 0 ]);
        jQuery( "." + result.thisObject.CHATBOT_SEND_AIRPLANE ).css(  "background-color", result.data[ 0 ][ 0 ]);
        jQuery( ".call-icon-container"                        ).prop( "href"            , "tel:" + phone       ); }
}
