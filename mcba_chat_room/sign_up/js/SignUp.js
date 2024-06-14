/*
 * class SignUp  //  uses the Validation object which must be set after construction
 */
class SignUp {
    constructor( chatBoxDiv ) {

        this.validationObject = new Object();
        this.registrationObject = new Object();

        // html elements
        this.CHAT_SIGN_UP_HEADER = "chat_sign_up_header";
        this.CHAT_SIGN_UP_USERNAME = "chat_sign_up_username";
        this.CHAT_SIGN_UP_PASSWORD = "chat_sign_up_password";
        this.CHAT_SIGN_UP_CONFIRM_PASSWORD = "chat_sign_up_confirm_password";
        this.CHAT_SIGN_UP_BUTTON = "chat_sign_up_button";
        this.CHAT_SIGN_UP_INPUT_TEXT = "chat_sign_up_input_text";
        this.MCBA_BUTTON = "mcba_button";
        this.CHAT_SIGN_UP_CANCEL = "chat_sign_up_cancel_button";
        this.CHAT_SIGN_UP_FOOTER = "chat_sign_up_footer";

        this.div_id = "#" + chatBoxDiv;

        // outer div container
        this.html = '<div class="container-fluid chat_sign_up_area" style="display: grid; background-color: #FCFCFC;" id="chat-box">';

        // header
        this.html += `<div class="sign_up_login_container">
                          <div class="${ this.CHAT_SIGN_UP_HEADER }">
                              <span class="${ this.CHAT_SIGN_UP_CANCEL }"><</span>&nbsp;Sign Up
                          </div>
                      </div>`;

        // username
        this.html += '  <div class="' + this.CHAT_SIGN_UP_USERNAME + '" id="' + this.CHAT_SIGN_UP_USERNAME + '">';
        this.html += '      <input placeholder="E-mail Address" class="chat_sign_up_input_text">';
        this.html += '  </div>';

        // password
        this.html += '  <div class="' + this.CHAT_SIGN_UP_PASSWORD + '" id="' + this.CHAT_SIGN_UP_PASSWORD + '">';
        this.html += '      <input placeholder="Password" class="chat_sign_up_input_text">';
        this.html += '  </div>';

        // confirm password
        this.html += '  <div class="' + this.CHAT_SIGN_UP_CONFIRM_PASSWORD + '" id="' + this.CHAT_SIGN_UP_CONFIRM_PASSWORD + '">';
        this.html += '      <input placeholder="Confirm Password" class="chat_sign_up_input_text">';
        this.html += '  </div>';

        // sign up button
        this.html += '  <div class="' + this.CHAT_SIGN_UP_BUTTON + '"><a id="' + this.CHAT_SIGN_UP_BUTTON_DIV + '" ';
        this.html += '  class="' + this.MCBA_BUTTON + '">Sign Up</a></div>';

        // cancel button
        // this.html += '  <div class="' + this.CHAT_SIGN_UP_CANCEL + '"><button id="' + this.CHAT_SIGN_UP_CANCEL + '" ';  
        // this.html += '  type="button">Cancel</button></div>';

        // footer
        this.html += '  <div class="' + this.CHAT_SIGN_UP_FOOTER + '"></div>';
        this.html += '</div>'; // end container class
    }

    draw() {
        this.div = jQuery( this.div_id ); // get this div.
        this.originalHtml = this.div.html(); // remember what it was in case of cancel.
        this.div.removeClass( "chat-area" ); // otherwise we get a grid inside of a grid, not pretty...
        this.div.html( this.html ); // insert the html, then hook the click events.
        jQuery( '#' + this.CHAT_SIGN_UP_BUTTON_DIV ).off().on( 'click', function () { this.continueSignUp(); }.bind( this ));    
        jQuery( document ).ready(function() {
            jQuery( '.' + this.CHAT_SIGN_UP_CANCEL ).off().on( 'click', function () { this.cancelSignUp();   }.bind( this ));
        }.bind( this ));


        let colorManager = new ChatColorManager();
        colorManager.getChatMainColor( this, "setMainChatColors" );
    }

    setMainChatColors( _event, result ) {
        jQuery( ".chat_sign_up_area" ).css( "background-color", result.data[ 0 ][ 0 ] );
        jQuery( ".mcba_button" ).css( "background-color", result.data[ 0 ][ 0 ] );
    }

    continueSignUp() {

        // make sure this object has a validation object with an isEmail() method.

        if ( !( typeof this.validationObject.isEmail == "function" ) ) {
            alert( "missing isEmail() method.  the validation object may not be defined in SignUp.js" );
            return;
        }

        // validate user name

        this.email = jQuery( '.' + this.CHAT_SIGN_UP_USERNAME ).find( 'input' ).val();
        if ( !this.validationObject.isEmail( this.email ) ) {
            alert( "*** ERROR: Invalid E-mail address. ***" );
            return;
        }


        // make sure this object has a validation object with an isPassword() method.

        if ( !( typeof this.validationObject.isPassword == "function" ) ) {
            alert( "missing isPassword() method.  the validation object may not be defined in SignUp.js" );
            return;
        }

        // validate password

        this.password = jQuery( '.' + this.CHAT_SIGN_UP_PASSWORD ).find( 'input' ).val();
        if ( !this.validationObject.isPassword( this.password ) ) {
            alert( "*** ERROR: Passwords must contain at least 8 characters. ***" );
            return;
        }

        // register new user

        if ( !( typeof this.registrationObject.register == "function" ) ) {
            alert( "*** ERROR: missing register() method.  the registration object may not be defined in SignUp.js ***" );
            return;
        }
        this.registrationObject.register();
    }

    cancelSignUp() {
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