/*
 * class ChangePasswordForm  //  uses the Validation object which must be set after construction
 */
class ChangePasswordForm {
    constructor( emailArg ) {
        this.validationObject = new Object();
        this.users_email = emailArg;
        this.passwordChanger = new PasswordChanger( this );
        this.CHAT_SIGN_UP_HEADER = "chat_sign_up_header";
        this.CHAT_SIGN_UP_USERNAME = "chat_sign_up_username";
        this.CHAT_SIGN_UP_PASSWORD = "chat_sign_up_password";
        this.CHAT_SIGN_UP_CONFIRM_PASSWORD = "chat_sign_up_confirm_password";
        this.CHAT_SIGN_UP_BUTTON = "chat_sign_up_button";
        this.CHAT_SIGN_UP_INPUT_TEXT = "chat_sign_up_input_text";
        this.MCBA_BUTTON = "mcba_button";
        this.CHAT_SIGN_UP_CANCEL = "chat_sign_up_cancel_button";
        this.CHAT_SIGN_UP_FOOTER = "chat_sign_up_footer";
        this.div_id = "#" + "chat-box";
        this.html = '<div class="container-fluid chat_sign_up_area" style="display: grid; background-color: #FCFCFC;" id="chat-box">';
        this.html += '<div class="sign_up_login_container"><div class="' + this.CHAT_SIGN_UP_HEADER + '">Change Password</div></div>';
        this.html += '  <div class="' + this.CHAT_SIGN_UP_USERNAME + '" id="' + this.CHAT_SIGN_UP_USERNAME + '">';
        this.html += '      <input placeholder="E-mail Address" class="chat_sign_up_input_text">';
        this.html += '  </div>';
        this.html += '  <div class="' + this.CHAT_SIGN_UP_PASSWORD + '" id="' + this.CHAT_SIGN_UP_PASSWORD + '">';
        this.html += '      <input placeholder="Password" class="chat_sign_up_input_text">';
        this.html += '  </div>';
        this.html += '  <div class="' + this.CHAT_SIGN_UP_CONFIRM_PASSWORD + '" id="' + this.CHAT_SIGN_UP_CONFIRM_PASSWORD + '">';
        this.html += '      <input placeholder="Confirm Password" class="chat_sign_up_input_text">';
        this.html += '  </div>';
        this.html += '  <div class="' + this.CHAT_SIGN_UP_BUTTON + '"><a id="' + this.CHAT_SIGN_UP_BUTTON_DIV + '" ';
        this.html += '  class="' + this.MCBA_BUTTON + '">Continue</a></div>';
        this.html += '  <div class="' + this.CHAT_SIGN_UP_FOOTER + '"></div>';
        this.html += '</div>';
    } // end container class

    draw() {
        this.div = jQuery( this.div_id ); // get this div.
        this.originalHtml = jQuery( '#chat-box' ).html() // remember for database sync to populate after login.
        // chatBoxBuilder.build();                              
        this.div.removeClass( "chat-area" ); // otherwise we get a grid inside of a grid, not pretty...
        this.div.html( this.html ).css( "display", "grid" ); // insert the html, show it, and hook the click events.
        jQuery( '.' + this.CHAT_SIGN_UP_USERNAME ).find( 'input' ).val( this.users_email );
        jQuery( '#' + this.CHAT_SIGN_UP_BUTTON_DIV ).off().on( 'click', function () {
            this.continueChangePassword();
        }.bind( this ) );
        jQuery( '#' + this.CHAT_SIGN_UP_CANCEL ).off().on( 'click', function () {
            this.cancelChangePassword();
        }.bind( this ) );
        // since the identity wasn't set in the message manager...
        messageManager.identity = new AnonymousIdentity(); // asynchronous call to get the identity. this is a hack.
        setTimeout(() => {
            jQuery( '.staticcallbutton' ).css( "display", "none" );
            let colorManager = new ChatColorManager();
            colorManager.getChatMainColor( this, "setMainChatColors" );
        }, 250 );    
    }

    setMainChatColors( _event, result ) {
        jQuery( ".chat_sign_up_area" ).css( "background-color", result.data[ 0 ][ 0 ] );
        jQuery( ".mcba_button"       ).css( "background-color", result.data[ 0 ][ 0 ] );
    }
    
    
    

    continueChangePassword() {
        if ( typeof this.validationObject.isEmail != "function" ) { // has isEmail() method?
            alert( "missing isEmail() method.  the validation object may not be defined in ChangePasswordForm.js" );
            return;
        }

        this.email = jQuery( '.' + this.CHAT_SIGN_UP_USERNAME ).find( 'input' ).val();
        if ( !this.validationObject.isEmail( this.email ) ) {
            alert( "*** ERROR: Invalid E-mail address. ***" );
            return;
        }

        if ( typeof this.validationObject.isPassword != "function" ) { // has isPassword() method?
            alert( "missing isPassword() method.  the validation object may not be defined in ChangePasswordForm.js" );
            return;
        }

        this.password = jQuery( '.' + this.CHAT_SIGN_UP_PASSWORD ).find( 'input' ).val();
        if ( !this.validationObject.isPassword( this.password ) ) {
            alert( "*** ERROR: Passwords must contain at least 8 characters. ***" );
            return;
        }

        this.passwordChanger.changePassword( this.password );
    }

    cancelChangePassword() {
        loggedOut = true;
        firebase.auth().signOut().then( function () {
            console.log( "signing out..." );
            keys = [];
            this.div.html( this.originalHtml );
            showPhone();
        }.bind( this ) ).catch( function ( error ) {
            console.error( error );
        } );
    }

    setValidationObject( validationObjectArg ) {
        this.validationObject = validationObjectArg;
    }
    setRegistrationObject( registrationObjectArg ) {
        this.registrationObject = registrationObjectArg;
    }
}