/*
 * handles screen changes
 */
function showPhone() {
    jQuery( '#chat-box'              ).css( 'display', 'none'  );
    jQuery( '#staticcallbutton'      ).css( 'display', 'block' ).off().on( 'click', function() {
        loggedOut = false;
        init( false /* false indicates no restart */ );
    }); }

function showChatBox( chatBoxArg ) {
    let send_message_selector   = ".chatbot_send_airplane";
    let logout_selector         = ".send_a_message";
    jQuery( '#staticcallbutton'       ).css(           'display', 'none'        );
    jQuery( '.unread_message_counter' ).css(           'display', 'none'        );
    jQuery( '#chat-box'               ).css(           'display', 'grid'        );
    jQuery( logout_selector           ).off().on(      'click'  , logOut        );
    jQuery( send_message_selector     ).off().on(      'click'  , sendMessage   );
    jQuery( "#messageForm input" ).off( 'keyup' ).on(  'keyup'  ,  sendIfEnter  );
    setTimeout( function() {
        jQuery( '.top-row .close-left-arrow' ).off().on( 'click', function() {
            keys = [];
            showPhone();
            // msgScreen.innerHTML = originalMsgScreenHtml; 
        });
    }, 2000);
    chatBoxArg.msgScreen = document.getElementById( "messagesContainer" );
    if ( !isAdmin ) { chatBoxArg.update( messageManager ); }
    jQuery( ".airplane-container"     ).css( "background-color", chatBoxArg.MAIN_CHAT_COLOR );
    jQuery( ".top_row_grid_area"      ).css( "background-color", chatBoxArg.MAIN_CHAT_COLOR );
    jQuery( ".chatbot_send_chat_text" ).css( "background-color", chatBoxArg.MAIN_CHAT_COLOR );
    jQuery( ".chatbot_send_airplane"  ).css( "background-color", chatBoxArg.MAIN_CHAT_COLOR );
}

function logOut() {
    loggedOut = true;
    firebase.auth().signOut().then( function () {
        console.log( "signing out..." );
        keys = [];
        showPhone();
        msgScreen.innerHTML = ""; // originalMsgScreenHtml; 
    }).catch( function ( error ) {
        console.error( error );
    }); }
