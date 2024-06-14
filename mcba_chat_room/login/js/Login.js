/*
 * class Login
 *
 * uses the Validation object which must be set after construction
 * 
 */
class Login {
    constructor( chatBoxArg ) {
        this.chatBox = chatBoxArg;
        this.validationObject = new Object();
        this.registrationObject = new Object();
        this.passwordManager = new Object();

        this.LOGIN_HEADER = "login_header";
        this.LOGIN_USERNAME = "chat_sign_up_username";
        this.LOGIN_PASSWORD = "chat_sign_up_password";
        this.LOGIN_BUTTON = "login_button";
        this.LOGIN_CANCEL = "login_cancel_button";
        this.FORGOT_PASSWORD = "chat_sign_up_footer";

        // outer div
        this.div_id = "#chat-box";
        this.html = '<div class="container-fluid" style="display: grid; background-color: #FCFCFC;" id="chat-box">';
        this.html += ' <div class="container-fluid chat_sign_up_area" style="display: grid; background-color: #FCFCFC;">';

        this.html += '<div class="sign_up_login_container">';
        this.html += '  <div class="chat_sign_up_header"><span class="login_cancel_button"><</span>&nbsp;Login</div>';
        this.html += '</div>';

        this.html += '  <div class="' + this.LOGIN_USERNAME + '" id="' + this.LOGIN_USERNAME + '">';
        this.html += '      <input placeholder="Email" class="chat_sign_up_input_text">';
        this.html += '  </div>';
        this.html += '  <div class="chat_sign_up_password" id="' + this.LOGIN_PASSWORD + '">';
        this.html += '      <input placeholder="Password" class="chat_sign_up_input_text">';
        this.html += '  </div>';
        this.html += '  <div class="chat_sign_up_button"><a id="' + this.LOGIN_BUTTON;
        this.html += '" class="mcba_button">Login</a></div>';
        this.html += '<div class="' + this.FORGOT_PASSWORD;
        this.html += '" id="' + this.FORGOT_PASSWORD + '"><a href="">Forgot Password?</a></div>';

        this.html += '</div>'; // end container class
    }

    draw() {
        this.div = jQuery( this.div_id ); // get this div and insert the html...
        this.originalHtml = this.div.html(); // remember what it was...
        this.div.removeClass( "chat-area" ); // otherwise one too many divs
        this.div.html( this.html ); // insert the html ( the string built above)

        jQuery( '#' + this.LOGIN_BUTTON ).one( 'click', function () {
            this.continueLogin();
        }.bind( this ) );
        
        
        jQuery( '#' + this.FORGOT_PASSWORD ).one( 'click', function ( evt ) {
            evt.preventDefault();
            this.beginPasswordRecovery();
        }.bind( this ) );

        jQuery( document ).ready(function() {
            jQuery( '.' + this.LOGIN_CANCEL ).one( 'click', function () {
                this.cancelLogin();
            }.bind( this ) );
        }.bind( this ));
        let colorManager = new ChatColorManager();
        colorManager.getChatMainColor( this, "setMainChatColors" );
    }

    setMainChatColors( _event, result ) {
        jQuery( ".chat_sign_up_area" ).css( "background-color", result.data[ 0 ][ 0 ] );
        jQuery( ".mcba_button" ).css( "background-color", result.data[ 0 ][ 0 ] );
    }

    continueLogin() {
        if ( typeof this.validationObject.isEmail != "function" ) {
            alert( "missing isEmail() method." );
            return;
        }
        this.email = jQuery( '.' + this.LOGIN_USERNAME ).find( 'input' ).val();

        if ( !this.validationObject.isEmail( this.email ) ) {
            return;
        } // return if invalid email.
        if ( typeof this.validationObject.isPassword != "function" ) {
            alert( "missing isPassword() method." );
            return;
        }
        this.password = jQuery( '.' + this.LOGIN_PASSWORD ).find( 'input' ).val();
        if ( !this.validationObject.isPassword( this.password ) ) {
            return;
        } // return if invalid password.

        let userConversationInfoQuery = "select user_table.*, conversation_table.conversation_id ";
        userConversationInfoQuery += " from wp_mcba_users user_table, wp_mcba_chat_conversations conversation_table ";
        userConversationInfoQuery += " where conversation_table.mcba_chat_system_id='" + this.email + "' and ";
        userConversationInfoQuery += " user_table.email='" + this.email + "'";

        let nextFunction = "gotUserInfo";
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let args = {
            query: userConversationInfoQuery,
            trigger: nextFunction,
            thisObject: this
        }
        this.dataSource.runQuery( args );
    }

    gotUserInfo( event, result ) {
        let sha = new SecureHashAlgorithm();
        console.log( "got email from database." );
        console.log( "Event: " + event.type );
        if ( result.data.includes( "ERROR:" ) ) {
            let error = "*** ERROR:  problem getting user " + result.thisObject.email + " from the database.";
            console.error( error );
        } else if ( result.data.length == 0 ) {
            alert( "Could not find user " + result.thisObject.email + " in database.  Please make sure that this person is in the conversation table." )
            return;
        } else { // got user info from database. now check password.  if correct, login.
            if ( sha.SHA512( result.thisObject.password ) == result.data[ 0 ][ 6 ] ) {
                result.thisObject.chatBox.draw( result.thisObject );
                let conversation_id = result.data[ 0 ].conversation_id;
                let user_id = result.data[ 0 ].ID;
                messageManager.conversation_id = conversation_id;
                messageManager.identity.object_id = user_id;
                messageManager.identity.email = result.thisObject.email;

                // the mcba_chat_system_id is needed for the router to work
                messageManager.mcba_chat_system_id = conversation_id;
                console.log( "assigned conversation_id: " + conversation_id + " making it active..." );
                messageManager.setActiveChatId( conversation_id );
                result.thisObject.chatBox.setCookie( "first_name", result.thisObject.email );
                result.thisObject.chatBox.setCookie( "conversation_id", conversation_id );
                result.thisObject.chatBox.setCookie( "previous_active_chat_id", messageManager.previous_active_chat_id );
                result.thisObject.chatBox.setCookie( "user_id", user_id );
                keys = []; // otherwise it will think that we have all of the messages already!
                console.log( "calling init with restart = 'true'..." );
                init( /* restart = */ true ); // fill chat box with logged in user's messages // sets conversation id
            } else {
                alert( "Wrong password." );
            }
        }
    }

    beginPasswordRecovery() {
        console.log( "starting password recovery process..." );
        let username = jQuery( '.' + this.LOGIN_USERNAME ).find( 'input' ).val();
        this.passwordManager.startPasswordRecoveryProcess( username );
    }

    cancelLogin() {
        loggedOut = true;
        firebase.auth().signOut().then( function () {
            console.log( "canceling login..." );
            keys = [];
            this.div.html( this.originalHtml );
            // this.div.addClass( "chat-area" ); // was removed in this.draw() function.  put it back.
            showPhone();
        }.bind( this ) ).catch( function ( error ) {
            console.error( error );
        } );
    }

    setValidationObject( validationObjectArg ) {
        this.validationObject = validationObjectArg;
    }
    setDataSourceObject( dataSourceArg ) {
        this.dataSource = dataSourceArg;
    }
    setPasswordManager( passwordManagerArg ) {
        this.passwordManager = passwordManagerArg;
    }
}