/*
 *	SecurityObject class
 *
 *  constructs itself with a random key and a time stamp.
 * 
 */
class SecurityObject {

    constructor( key_length ) { 
        console.log( "constructing security object..." ); 
        this.key_value = this.generateRandomKey( key_length );
        this.issue_date = Date.now();
    }

    toStringifiedJson() { return JSON.stringify( this ); }

    generateRandomKey( length ) {
        let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for ( let i = 0; i < length; i++ ) {
            result += randomChars.charAt( Math.floor( Math.random() * randomChars.length ));
        }
        return result;
    }
}
