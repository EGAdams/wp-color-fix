/** class DatabaseSync */
class DatabaseSync {
    constructor() {
        this.dataSource = DataSourceFactory.getInstance(); 
        this.DELAY = 5000;
        this.STARTED = false; }

    restart( newConversationId ) {
        clearInterval( this.interval );
        this.STARTED = false;
        this.conversationId = newConversationId;
        this.start(); }

    start() {
        if( this.STARTED ) {
            console.log( "*** WARNING: database sync already started. ***" );
            return; }
        this.STARTED = true;
        console.log( "starting database synchronizer..." );
        let userConversationInfoQuery   =  "select * from wp_mcba_chat_messages, wp_mcba_users ";
        userConversationInfoQuery       += "where wp_mcba_chat_messages.sender_id = wp_mcba_users.ID or ";
        userConversationInfoQuery       += "wp_mcba_chat_messages.sender_id = wp_mcba_users.email ";
        userConversationInfoQuery       += "and wp_mcba_chat_messages.conversation_id='";
        userConversationInfoQuery       += this.conversationId + "'"; 
        // console.log( "query: " + userConversationInfoQuery );
        let databaseSyncObject = this;
        this.interval = setInterval( function () {
            let nextFunction = "gotMessages";
            jQuery( document ).one( nextFunction, databaseSyncObject[ nextFunction ] );
            let args = {
                query: userConversationInfoQuery,
                trigger: nextFunction,
                thisObject: databaseSyncObject
            }   
            databaseSyncObject.dataSource.runQuery( args );
        }, databaseSyncObject.DELAY );
        
        // if the call button is drawn before this, it will cause blank chatbot message screens intermittently.
        console.log( "database sync started.  triggering event to draw phone icon..." );  
        jQuery( "#staticcallbutton" ).trigger( "database_sync_started", {}); } // event was set on staticcallbutton earlier.
    
    populateAdminDash() {
        let userConversationInfoQuery   =  "select * from wp_mcba_chat_messages, wp_mcba_users ";
        userConversationInfoQuery       += "where wp_mcba_chat_messages.sender_id = wp_mcba_users.ID or ";
        userConversationInfoQuery       += "wp_mcba_chat_messages.sender_id = wp_mcba_users.email";
        // console.log( "query: " + userConversationInfoQuery );
        let databaseSyncObject = this;
        let nextFunction = "gotMessages";
        jQuery( document ).one( nextFunction, databaseSyncObject[ nextFunction ] );
        let args = {
            query: userConversationInfoQuery,
            trigger: nextFunction,
            thisObject: databaseSyncObject
        }   
        databaseSyncObject.dataSource.runQuery( args );
    }

    gotMessages( _event, results ) { /* console.log( "entering got messages..." ); */
        for ( let data in results.data ) {  
            let dataArg = new DataArg( results.data[ data ]);
            let message = new Message( dataArg );
            if ( !keys.includes( dataArg.key )) { 
                keys.push( dataArg.key ); }
            messageProcessor.processMessage( message, messageManager ); }}

    setConversationId( newId ) { this.conversationId = newId; }
}
