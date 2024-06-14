/*
 *  main chat controller ( entry point )
 */
let DataSourceFactory = ( function () {
    let instance;
    return {
        getInstance: function () {
            if ( instance == null ) {
                instance = new DataSource();
                // Hide the constructor so the returned object can't be new'd... 
                instance.constructor = null;
            }
            return instance;
        }
    };
})();

const main_chat_logger = LoggerFactory.createLogger( "MainChatLogger" );

Date.prototype.timeNow = function () {
    return (( this.getHours() < 10 ) ? "0" : "" ) + this.getHours() + ":" + (( this.getMinutes() < 10 ) ? "0" : "" ) + this.getMinutes() + ":" + (( this.getSeconds() < 10 ) ? "0" : "" ) + this.getSeconds();
}

main_chat_logger.logUpdate( "starting definitions... " );
const firebaseDatabasePath = "/messages";
let originalMsgHtml = "";
let email = "";
let name = "";
let isAdmin = window.location.href.includes( "mcba_messaging" );
const userName = document.getElementById( "user-name" );
const db = firebase.database();
const msgRef = db.ref( firebaseDatabasePath );
main_chat_logger.logUpdate( "creating new ConversationListManager... " );
let listManager = new ConversationListManager();
main_chat_logger.logUpdate( "creating new ChatRouter... " );
let chatRouter = new ChatRouter( listManager );
let chatBox = new Object();
let messageManager = new Object();
main_chat_logger.logUpdate( "creating new MessageSender... " );
let messageSender = new MessageSender();
main_chat_logger.logUpdate( "creating new MessageProcessor... " );
let messageProcessor = new MessageProcessor( chatRouter, db );
function initChatBot () {
    if ( isAdmin ) {
        chatbot = new ChatBot( "chat-box", "Hello Admin. You don't have any messages yet." );
        chatbot.draw();
    }
    chatBox = new ChatBox( chatRouter, db );
    messageManager = new MessageManager( msgRef );
    messageManager.setChatBox( chatBox );
}


main_chat_logger.logUpdate( "creating ChatConfiguration object... " ); // draws on construction. calls
let chatConfiguration = new ChatConfiguration( initChatBot );          // initChatBot() when done.
main_chat_logger.logUpdate( "chatConfiguration object creation finished. " );
let chatwindow = "";
let chat_id = "";
let chat_win = "";
let messageCount = 0;
let shownMessages = [];
let keys = [];
let firebase_chat_data = [];
let loggedOut = false;
let send_button_selector = '.chatbot_send_airplane';
let message_input_selector = '.chatbot_input_area .chatbot_input_text';
let message_container_id = 'messagesContainer'
let databaseSync = new DatabaseSync();


main_chat_logger.logUpdate( "starting definition of init() method... " );
function init ( restart ) {  // clicking the phone icon fires this method

    // we'll need this unsubscribe variable to log the user out

    let unsubscribe = firebase.auth().onAuthStateChanged( function ( user ) {
        if ( user ) {
            if ( loggedOut ) {
                console.log( "logged out!" );
                firebase.auth().signOut()
                unsubscribe();
                return;
            }

            if ( jQuery( '#staticcallbutton' ).length > 0 ) {  // when onAuthStateChanged() is called again,
                showChatBox( chatBox );                        // the chatbox will already be drawn.
                jQuery( '#sign_up_link' ).off().on( 'click', function () { signOn(); } );
                jQuery( '#login_link' ).off().on( 'click', function () { login(); } );

                email = messageManager.identity.getCookie( "email" );
                if ( email.length != 0 ) {
                    // replace the "Log in or Sign up" text with the new user identifier
                    jQuery( ".login_sign_in" ).html( "Logged in as: " + email + "&nbsp&nbsp <a id='log_out_link'>Log Out</a>" );
                    jQuery( "#log_out_link" ).off().on( 'click', function () { logOut(); } );
                }
            } else {
                jQuery( '#chat-box' ).css( 'display', 'grid' );
                jQuery( send_button_selector ).off().on( 'click', sendMessage );
                jQuery( message_input_selector ).off( 'keyup' ).on( 'keyup', sendIfEnter );
            }

            // user is signed in. get their name.

            if ( user.displayName == null ) {
                user.displayName = "Guest";
            } else {
                user.name = user.displayName;
            }
            // removed from the system on jan 13.  messages get updated through the DatabaseSync object now.
            // msgRef.on( 'child_added', updateMsgs );
        } else {

            if ( loggedOut ) {
                console.log( "user is null!  returning... " );
                return;
            } else {
                firebase.auth().signInAnonymously();
            }
        }
    } );
    if ( databaseSync.STARTED && restart ) {
        databaseSync.restart( messageManager.active_chat_id );  // restart with new id
    }
}

function signOn () {
    let signUp = new SignUp( "chat-box" );
    signUp.setValidationObject( new Validation( "chat_sign_up_username", "chat_sign_up_password", "chat_sign_up_confirm_password" ) );
    signUp.setRegistrationObject( new Registration( signUp, chatBox ) );
    signUp.draw();
}

function drawChangePassword ( emailArg ) {
    const changePassword = new ChangePasswordForm( emailArg );
    changePassword.setValidationObject( new Validation( "chat_sign_up_username", "chat_sign_up_password", "chat_sign_up_confirm_password" ) );
    changePassword.draw();
}

function login () {
    const loginForm = new Login( chatBox );
    loginForm.setValidationObject( new Validation( "chat_sign_up_username", "chat_sign_up_password" ) );
    loginForm.setDataSourceObject( DataSourceFactory.getInstance());
    loginForm.setPasswordManager( new PasswordManager( loginForm ));
    loginForm.draw();
}

function logOut () {
    messageManager.previous_active_chat_id = messageManager.identity.getCookie( "previous_active_chat_id" );
    messageManager.identity.delete_cookie( "previous_active_chat_id" );
    messageManager.identity.delete_cookie( "user_id" );
    messageManager.identity.delete_cookie( "email" );
    messageManager.identity.delete_cookie( "conversation_id" );
    messageManager.identity.delete_cookie( "first_name" );
    loggedOut = true;
    firebase.auth().signOut().then( function () {
        console.log( "logging out..." );
        chatBox.clearScreen();
        chatBox.clearConversation( messageManager.active_chat_id );
        chatBox.clearConversation( messageManager.previous_active_chat_id );
        let chatbot_login_sign_in = '<div class="chatbot_login_sign_in"><a id="login_link">Log in</a>';
        chatbot_login_sign_in += '&nbsp or &nbsp<a id="sign_up_link">Sign up</a><div>';
        chatbot_login_sign_in += '&nbsp;&nbsp;</div><div></div></div>';
        jQuery( ".chatbot_login_sign_in" ).html( chatbot_login_sign_in );
        messageManager.conversation_id = messageManager.previous_active_chat_id;
        messageManager.mcba_chat_system_id = messageManager.previous_active_chat_id;
        messageManager.setActiveChatId( messageManager.previous_active_chat_id );
        databaseSync.restart( messageManager.active_chat_id );
        setTimeout( function () {
            keys = [];
        }, 2000 );
        showPhone();
    }.bind( this ) ).catch( function ( error ) {
        console.error( error );
    } );
}

function sendIfEnter ( e ) {
    if ( e.which == 13 ) {
        e.preventDefault();
        messageSender.sendMessage( messageManager );
    }
}

function sendMessage ( e ) {
    e.preventDefault();
    messageSender.sendMessage( messageManager );
}

function updateMsgs ( data ) {
    messageManager.updateMsgs( data, chatRouter, db );
}
main_chat_logger.logUpdate( "finished mcba_chat_main.js file." );