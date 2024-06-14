/*
 * class ChatBot  draws original chatbot
 */
class ChatBot {
    constructor( chatBoxDiv ) {
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

        // outer div container
        this.html = '<div class="container-fluid chatbot_sign_up_area" style="display: grid; background-color: #c0c0c0;" id="chat-box">';

        this.html += `
        <div class="top_row_grid_area">
            <div class="top-row">
                <div class="send_a_message_text">&nbsp;&nbsp; < &nbsp;Send a Message</div>
                <a class="call-icon-container">
                    <div class="call-icon"></div>
                    <div class="call-text">CALL</div>
                </a>
            </div>
        </div>
        `;
        this.html += `<div class=${ this.CHATBOT_LOGIN_SIGN_IN }><a id="login_link">Log in</a> &nbsp; or &nbsp;
                        <a id="sign_up_link">Sign up</a>
                        <div></div>
                        <div></div>
                    </div>`;

        this.html += `<div class="messages_container" id="messagesContainer">`;
        
        this.html += `<div class=${ this.CHATBOT_RECEIVE_CHAT_ROW_CONTAINER }>
            <div class=${ this.CHATBOT_RECEIVE_CHAT_TEXT }>
                Welcome to our chat. Is there anything that I can help you with?
            </div>
            <div>&nbsp;&nbsp;</div>
            <div></div>
            </div>`;

        this.html += `
        <div class=${ this.CHATBOT_SEND_CHAT_ROW_CONTAINER }>
            <div>&nbsp;&nbsp;108861</div>
            <div class=${ this.CHATBOT_SEND_CHAT_TEXT }>
                With this method, you would need to ensure any descendant element with a background 
                are either mimicking or inheriting the border radius. The real problem here is that 
                border radius needs to have overflow:hidden.
            </div>
            <div></div>
            <div></div>
        </div>`;

        this.html += `
        <div class=${ this.CHATBOT_RECEIVE_CHAT_ROW_CONTAINER }>
            <div class=${ this.CHATBOT_RECEIVE_CHAT_TEXT }>
                Purely "for science" I've made a demo that uses the inside of a border radius with a 
                box shadow (to keep it from affecting the size) on a transparent pseudo-element. This it not at all ideal. 
                I would recommend just using an image.
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
        this.html += '</div>'; // end container class
    }

    draw() {
        this.div = jQuery( this.div_id );      // get this div.
        this.div.removeClass( "chat-area" );   // otherwise we get a grid inside of a grid, not pretty...
        this.div.html( this.html );            // insert the html.
    }
}
