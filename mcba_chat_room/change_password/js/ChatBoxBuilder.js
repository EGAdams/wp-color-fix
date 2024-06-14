/*
 *	ChatBoxBuilder class
 */
class ChatBoxBuilder {
    constructor( targetObjectArg ) { this.targetObject = targetObjectArg; }

    build() {
        this.targetObject.originalHtml =
           `<div class="top_row_grid_area">
                <div class="top-row">
                    <div class="send_a_message"></div>
                    <div class="the_call_icon"></div>
                </div>
            </div>
            <div class="messages_grid_area">
                <div class="messages_container" id="messagesContainer">
                    <div class="login_sign_in">
                        <a id="login_link">Log in</a>
                        &nbsp; or &nbsp;<a id="sign_up_link">Sign up</a><div>&nbsp;&nbsp;</div><div></div></div>
                        <div class="receive_chat_row_container">    
                            <div class="receive_chat_image">        
                            <div class="receive_chat_text">            
                                Welcome to our chat. Is there anything that I can help you with?
                            </div>            
                        </div>            
                        <div>&nbsp;&nbsp;</div><div></div></div></div>
                    </div>
                <div class="bottom_row_grid_area">
                    <div class="bottom-row">
                        <div class="input_area" id="messageForm">
                        <input type="text" placeholder="Enter a message" class="input_text"></div>
                <div class="chatbot_send_airplane"></div>
            </div>
        </div>`; }
}
