/*
 *	SecurityObjectManager class
 */
class SecurityObjectManager {
    constructor( passwordManagerArg ) {
        this.passwordManager = passwordManagerArg;
        this.securityObject  = new SecurityObject( MCBA_CHAT_SECURITY_TOKEN_LENGTH );
        this.temporary_security_key = this.securityObject.key_value; } // remember key
        
    initializeTemporaryKey() {
        const dataSource = DataSourceFactory.getInstance();
        let nextFunction = 'temporaryKeyInserted';
        jQuery( document ).one( nextFunction, this[ nextFunction ]);
            let args = {
            query: "update wp_mcba_users set security_object='" + 
                   this.securityObject.toStringifiedJson() + 
                   "' where email='" + this.passwordManager.email + "'",
            trigger: nextFunction,
            thisObject: this }
        console.log( "making api call..." );
        dataSource.runQuery( args ); }

    temporaryKeyInserted( event, result ) {
        const dataSource = DataSourceFactory.getInstance();
        let nextFunction = 'verifyTemporaryKey';
        jQuery( document ).one( nextFunction, result.thisObject[ nextFunction ] );
         let args = {
             query: "select security_object from wp_mcba_users where email='" + result.thisObject.passwordManager.email + "'",
             trigger: nextFunction,
             thisObject: result.thisObject
        }
        console.log( "making api call..." );
        dataSource.runQuery( args ); }
    
    verifyTemporaryKey( event, result ) {
        console.log( "verifyTemporaryKey() function called..." );
        console.table( result.data );
        if ( result.data.length != 0 ) {
            const securityObject = JSON.parse( result.data[ 0 ].security_object );
            if ( securityObject.key_value == result.thisObject.temporary_security_key ) {
                result.thisObject.status = "key verified.";
            } else {
                result.thisObject.status = "invalid key."; }
        } else {
            result.thisObject.status = "invalid key."; }
        result.thisObject.passwordManager.securityObjectReady( result.thisObject ); } // call back the password manager
}
