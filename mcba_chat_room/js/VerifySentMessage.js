/** @class VerifySentMessage */

class VerifySentMessage {
    constructor( sentMessage ) { 
        this.logUpdate = function( text_to_log ) { console.log( text_to_log ); }
        this.sentMessage = sentMessage; 
        this.dataSource = DataSourceFactory.getInstance(); }

    verifySentMessage( sentMessageResponse ) {
        this.logUpdate( "verifying sent message " + this.sentMessage + " ..." );
        this.logUpdate( "response: " + sentMessageResponse + " ..." );
        let nextFunction = "checkVerifySentMessageResult";
        jQuery( document ).on( nextFunction, this[ nextFunction ] );
        let queryArg = "select * from wp_mcba_chat_messages where conversation_id='" + this.sentMessage.conversation_id + "' ";
        queryArg += " and message='" + this.sentMessage.message + "' ";
        queryArg += " and sender_id='" + this.sentMessage.sender + "' ";
        let args = {
            query: queryArg,
            trigger: nextFunction,
            thisObject: this }
        this.logUpdate( "running query..." );
        this.dataSource.runQuery( args );
    }

    checkVerifySentMessageResult( event, results ) {  // the copilot wrote most of this
        results.thisObject.logUpdate( "Event: " + event.type );
        console.log( "checkVerifySentMessageResult called with results: " + results );
        if ( results.length == 0 ) {
            results.thisObject.logUpdate( "*** ERROR: no results found, message not verified... ***" );
        } else {
            setTimeout( function() {
                results.thisObject.logUpdate( "finished verifying sent message result. " );
            }.bind( results.thisObject ), 500 );    
        }
    }

}
