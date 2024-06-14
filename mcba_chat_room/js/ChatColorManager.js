/** @class ChatColorManager */
class ChatColorManager {
    constructor() { this.chatMainColor = ""; }

    getChatMainColor( callingObject, nextFunction ) {
        const dataSource = DataSourceFactory.getInstance();
        jQuery( "#chat-box" ).on( nextFunction, callingObject[ nextFunction ] );
         var args = {
             event_object: "#chat-box",
             query: "select configuration_value from wp_mcba_chat_configuration",
             trigger: nextFunction,
             thisObject: callingObject }             
        dataSource.runQuery( args ); }

    setChatMainColor( newColor ) {
        const dataSource = DataSourceFactory.getInstance();
        var nextFunction = 'checkChatMainColor';
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
         var args = {
             query: "update wp_mcba_chat_configuration set configuration_value='" + newColor + "' where configuration_name='chat_main_color'",
             trigger: nextFunction,
             thisObject: this           
        }
        dataSource.runQuery( args ); }

    checkChatMainColor( _event, result ) { result.thisObject.getChatMainColor( result.thisObject, 'verifyChatMainColor' ); }
    
    verifyChatMainColor( _event, results ) {
        if ( results.data.length == 0 ) {
            console.log( "*** ERROR no chat main color found ***" );
        } else {
            if( $( "#chat-color-configuration-color-picker" ).val() == results.data[ 0 ][ 0 ] ) {
                console.log( "configuration change successful" );
            } else {
                console.log( "*** ERROR configuration change failed ***" ); }    
        }}
}
