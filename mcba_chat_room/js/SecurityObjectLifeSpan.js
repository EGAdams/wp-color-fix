/*
 *	SecurityObjectLifeSpan class
 */
class SecurityObjectLifeSpan {
    constructor( securityObjectArg ) { this.security_object = securityObjectArg; }

    isExpired() {
        console.log( "calculating expiration status..." );
        const issue_date = this.security_object.issue_date;
        return ((( Date.now() - issue_date ) / 1000 ) > MCBA_CHAT_SECURITY_TOKEN_LIFE_SPAN ); }
}
