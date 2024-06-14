/*
 * class PasswordChanger
 */
class PasswordChanger {
    constructor( changePasswordFormArg ) {
        console.log( "constructing PasswordChanger object..." );
        this.changePasswordForm = changePasswordFormArg;
        this.users_email        = changePasswordFormArg.users_email;
        this.dataSource         = DataSourceFactory.getInstance(); }

    changePassword( newPassword ) {            
        const secureHashAlgorithm = new SecureHashAlgorithm();
        var nextFunction = "checkQueryResult";
        jQuery( document ).on( nextFunction, this[ nextFunction ]);
        var args = {
            query: "update wp_mcba_users set password='" + secureHashAlgorithm.SHA512( newPassword ) + 
                   "' where email='" + this.users_email + "'",
            trigger: nextFunction,
            thisObject: this }
        this.dataSource.runQuery( args ); }

    checkQueryResult( _event, dataArg ) {
        if ( dataArg.data?.error ) {
            console.log( "*** ERROR: " + dataArg.data.error + " ***" );
        } else {  // no errors, continue...
            jQuery( '#chat-box' ).html( dataArg.thisObject.changePasswordForm.originalHtml );
            login(); 
            jQuery( '#chat_sign_up_username' ).find( 'input' ).val( dataArg.thisObject.users_email );
            jQuery( '#chat_sign_up_password' ).find( 'input' ).focus(); }}    
}
