/** @class VerifyChatId */
class VerifyChatId {
    constructor( chatIdToVerifyArg, callingObjectArg, callbackMethodArg ) {
        this.chatIdToVerify = chatIdToVerifyArg;
        this.callingObject = callingObjectArg;
        this.callbackMethod = callbackMethodArg;
        this.logger = LoggerFactory.createLogger( "VerifyChatId" ); 
        this.logger.logUpdate( "logger created." );}
    
    
    run() {
        this.logger.logUpdate( "setting next function to " + 
                               this.callingObject.constructor.name + "." + this.callbackMethod + "()" );
        jQuery( document ).one( this.callbackMethod, this.callingObject[ this.callbackMethod ] );
        let args = {
            query: "select * from wp_mcba_chat_conversations where conversation_id='" + this.chatIdToVerify + "'",
            trigger: this.callbackMethod,
            thisObject: this  }
        this.logger.logUpdate( "running query to verify chat id..." );
        this.callingObject.messageManager.dataSource.runQuery( args ); }
}