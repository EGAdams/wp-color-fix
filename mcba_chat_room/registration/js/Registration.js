/** class Registration */
class Registration {
    constructor( signupObjectArg, chatBoxArg ) {
        console.log( "constructing Registration object..." );
        this.signupObject   = signupObjectArg;
        this.email          = signupObjectArg.email;
        this.chatBox        = chatBoxArg; 
        this.dataSource     = new DataSource(); 
        this.logger         = LoggerFactory.createLogger( "Registration" ); 
        this.logger.logUpdate( "logger created." );}

    register() {            
        if (( typeof this.dataSource.runQuery != "function" )) { alert ( "missing runQuery() method." ); return; }
        var secureHashAlgorithm = new SecureHashAlgorithm();
        this.password = secureHashAlgorithm.SHA512( this.signupObject.password );
        var nextFunction = "checkEmailUpdateResult";
        jQuery( document ).on( nextFunction, this[ nextFunction ]);
        var args = {
            query: "update wp_mcba_users set email='" + this.signupObject.email + "', password='" 
                    + this.password + "', uid='" + this.signupObject.email + "' where ID='" + this._getUserId() 
                    + "'",
            trigger: nextFunction,
            thisObject: this
        }
        this.dataSource.runQuery( args ); }

    checkEmailUpdateResult( _event, dataArg ) {
        if ( dataArg.data?.error ) {
            var duplicate_email = dataArg.data.error.match( /Duplicate entry '(\w+@\w+\.\w+)' for key 'email'/);
            if ( duplicate_email ) {
                alert( "We are sorry.  The email address " + duplicate_email[ 1 ] + " is already in use." );
                return;
            } else {
                alert( "*** ERROR: while inserting email address: " + dataArg.data.error + " ***" );
                return;
            }
        } else {  // no errors, continue...
            dataArg.thisObject.updateConversationTable( dataArg.thisObject.email ); }}
    
    updateConversationTable() {
        console.log( "updating conversation table with email: " + this.signupObject.email + "... " );
        var nextFunction = "checkConversationIdUpdateResult";
        jQuery( document ).on( nextFunction, this[ nextFunction ]);
        var args = {
            query: "update wp_mcba_chat_conversations set mcba_chat_system_id='" + this.signupObject.email 
                    + "' where user='" + this._getUserId() + "'",
            trigger: nextFunction,
            thisObject: this
        }
        this.dataSource.runQuery( args ); }

    checkConversationIdUpdateResult( _event, dataArg ) {
        if ( dataArg.data?.error ) {
            alert( "*** ERROR: while creating a conversation: " + dataArg.data.error + ".  Please contact the administrator. ***" );
        } else {  // no errors, continue...
            dataArg.thisObject.drawChatBox(); }}

    drawChatBox() {
        this.chatBox.draw( this.signupObject ); }

    _getUserId() {
        var this_id;
        if ( window[ "messageManager" ] && window[ "messageManager" ].identity.ID ) {
            this_id = window[ "messageManager" ].identity.ID;
            this.logger.logUpdate( "user_id=" + this_id + " found in messageManager.identity.ID.  finished finding id." );
            return this_id;
        } else {
            let cookie_id = document.cookie.match( /user_id=(\d+)/ );
            if ( cookie_id ) {
                this_id = cookie_id[ 1 ];
                this.logger.logUpdate( "user_id=" + this_id + " found in cookie.  finished finding id." );
                return this_id;
            } else { this.logger.logUpdate( "*** ERROR: invalid messageManager.identity.ID and cookie id.  returning null... ***" );
                     return null; }}}}
