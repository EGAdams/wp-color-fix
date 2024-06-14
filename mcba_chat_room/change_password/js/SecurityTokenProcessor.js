/*
 *	SecurityTokenProcessor class
 */
class SecurityTokenProcessor {
    constructor( security_token ) { this.security_token = security_token; }

    processSecurityToken() {
        console.log( "validating security token: " + this.security_token );
        if ( this.security_token.length != MCBA_CHAT_SECURITY_TOKEN_LENGTH ) { 
            this.abort( "Suspicious contents." ); return; } // bail if length is not equal
        const queryArg = "select security_object, email from wp_mcba_users where security_object like '%" + this.security_token + "%'";
        const dataSource = DataSourceFactory.getInstance();
        jQuery( document ).one( 'checkResultData', this[ 'checkResultData' ] );
        const args = { query: queryArg, trigger: 'checkResultData', thisObject: this };
        dataSource.runQuery( args ); }

    checkResultData( event, result ) {
        if ( result.data.length != 0 ) {
            const security_object = JSON.parse( result.data[ 0 ][ 0 ]);
            const life_span = new SecurityObjectLifeSpan( security_object );
            if ( life_span.isExpired() ) { result.thisObject.abort( "Token expired."); return; } // bail if expired
            if ( security_object.key_value == result.thisObject.security_token ) {
                drawChangePassword( result.data[ 0 ][ 1 ]); // result.data[ 0 ][ 1 ] is the email
            } else {
                result.thisObject.abort( "Unauthorized." );
            }
        } else {
            result.thisObject.abort( "Suspicious contents." );
        }}

    abort( reason ) {
        alert( "*** ERROR: Invalid security object token: " + reason + " ***" );
        messageManager.identity = new AnonymousIdentity(); }   
}
