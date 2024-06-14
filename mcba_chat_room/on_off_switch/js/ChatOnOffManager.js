/** @class ChatOnOffManager */
class ChatOnOffManager {
    constructor() { this.chatMainColor = ""; }

    getSystemStatus( callingObject, nextFunction ) {
        const dataSource = DataSourceFactory.getInstance();
        jQuery( document ).one( nextFunction, callingObject[ nextFunction ] );
         let args = {
             query: "select configuration_value from wp_mcba_chat_configuration",
             trigger: nextFunction,
             thisObject: callingObject }             
        dataSource.runQuery( args ); }

    setSystemStatus( enabled ) {
        const dataSource = DataSourceFactory.getInstance();
        let nextFunction = 'checkSystemStatus';
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
         let args = {
             query: "update wp_mcba_chat_configuration set configuration_value='" + enabled + "' where configuration_name='chat_system_enabled'",
             trigger: nextFunction,
             thisObject: this }
        dataSource.runQuery( args ); }

    checkSystemStatus( _event, result ) { result.thisObject.getSystemStatus( result.thisObject, 'verifySystemStatus' ); }
    
    verifySystemStatus( _event, results ) {
        if ( results.data.length == 0 ) {
            console.log( "*** ERROR no system enabled information found ***" );
        } else {
            if( $( "#chat-color-configuration-color-picker" ).val() == results.data[ 0 ][ 0 ]) {
                console.log( "configuration change successful" );
            } else {
                console.log( "*** ERROR configuration change failed ***" ); }}}
} // end class ChatOnOffManager
