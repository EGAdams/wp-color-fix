/*
 *	PasswordManager class
 */
 class PasswordManager {
    constructor( loginFormArg ) {
        console.log( "constructing PasswordManager..." );
        this.email = "not set.";
        this.url = MCBA_URL + "sendForgotPasswordEmail.php?email=";
        this.temporary_security_key = "";
        this.loginForm = loginFormArg;
    }

    startPasswordRecoveryProcess( emailArg ) {
        this.email = emailArg; 
        const securityObjectManager = new SecurityObjectManager( this );
        securityObjectManager.initializeTemporaryKey(); // calls back this object to send mail or report error.
    }

    securityObjectReady( securityObjectManager ) {
        if( securityObjectManager.status != "invalid key." && 
            securityObjectManager.temporary_security_key.length == MCBA_CHAT_SECURITY_TOKEN_LENGTH ) {
            console.log( "temporary key initialized to " + securityObjectManager.temporary_security_key + "." );
            console.log( "issue timestamp: " + securityObjectManager.securityObject.issue_date );
            this.temporary_security_key = securityObjectManager.temporary_security_key;
            this.sendForgotPasswordEmail();
        } else {
            const errorMessage = "*** ERROR: was not able to create a valid key. aborting password recovery process... ***";
            console.error( errorMessage );
            alert( errorMessage );
        }}
    
    sendForgotPasswordEmail() {
        this.loginForm.cancelLogin();
        alert( "A link with a security code has been sent to " + this.email + ".  Please open the email from us in your inbox and " + 
                "click on the included link.  You will be redirected here to change your password." );
        console.log( "final url: " + this.url + this.email + "&security_token=" + this.temporary_security_key );
        let apiArgs = {};
        apiArgs.trigger = "passwordRecoveryEmailSent";
        apiArgs.action = "send_forgot_password_email";
        apiArgs.website_url = MCBA_URL;
        apiArgs.security_token = this.temporary_security_key;
        apiArgs.email = this.email;
        let ajaxRunner = new WordPressAjaxCall();
        ajaxRunner.runAjax( apiArgs ); }
}
