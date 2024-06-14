/*
 *
 * class Validation
 * 
 * methods:
 * isEmail()
 * isPassword()
 * 
 */

class Validation {
    constructor( usernameElementArg, passwordElementArg, confirmPasswordArg ) {
        console.log( "constructing Validation object..." );
        this.USERNAME         = usernameElementArg;
        this.PASSWORD         = passwordElementArg;
        this.CONFIRM_PASSWORD = confirmPasswordArg;
    }

    isEmail() {
        var email = jQuery( '#' + this.USERNAME ).find( "input" ).val();
        if ( !email || email.length == 0 ) {
            alert( "*** ERROR: Invalid E-mail address. ***" );
            return false;
        }     
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( re.test( String( email ).toLowerCase())) {
            return true;
        } else {
            alert( "*** ERROR: Invalid E-mail address. ***" );
            return false;
        }
    }

    isPassword() {
        var password = jQuery( '#' + this.PASSWORD ).find( "input" ).val();
        if ( !password || password.length == 0 ) {
            alert( "*** ERROR: Invalid Password. ***" );
            return false;
        }   

            // Regex: At least 8 characters with at least 2 numerical

        let pattern = /^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){0,}).{8,}$/; 
        if ( pattern.test( password )) {
            if ( jQuery( '#' + this.CONFIRM_PASSWORD ).length > 0 ) {
                var confirmPassword = jQuery( '#' + this.CONFIRM_PASSWORD ).find( "input" ).val();
                if ( confirmPassword == password ) {
                    return true;
                } else {
                    alert( "*** ERROR: Password and Confirm Password fields must match. ***" );
                    return false;
                }
            } else {
                return true;
            }
        } else {
            alert( "*** ERROR: Passwords must contain at least 8 characters. ***" );
            return false;
        }
    }
}

// 343@sdk.ljk works.
// batman55 is good for a password
