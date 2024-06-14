/**  @class ChatRouter */
class ChatRouter {
    constructor( listmessageManagerArg ) {
        this.logUpdate = function( text_to_log ) { console.log( text_to_log ); }
        this.listmessageManager = listmessageManagerArg;
        this.conversations = {};
        this.activeGuest = null;
        this.terminal = new EasyBox();
        this.dataSource = DataSourceFactory.getInstance(); }

    route( message, messageManager ) {
		if ( message.isAdmin && message.outputText.includes( "Thank you for using our chat system" )) {
				// this.logUpdate( "This is a welcome message, bailing..." ); 
				return false; }
        if ( !messageManager.isAdmin && messageManager.mcba_chat_system_id != message.chat_id ) {
            return false;
        } else if ( !message.chat_id ) {
            let errorMessage = "*** ERROR: the message chat id is not defined. *** ";
            this.logUpdate( errorMessage );
            console.error( errorMessage );
            return false; }
        // guest is in memory.  add this message.
        if ( this.conversations.hasOwnProperty( message.chat_id )) {
            if ( !this.conversations[ message.chat_id ][ 0 ].addMessage( message )) { 
                return false; }
        } else {
            // guest is not in memory, remember them and the message
            this.logUpdate( "adding Guest with message chat id " + message.chat_id + "..." );
            this.conversations[ message.chat_id ] = new Array();
            this.conversations[ message.chat_id ].push( new Guest( message ));
            this.conversations[ message.chat_id ].keys = new Array();
            this.conversations[ message.chat_id ].keys.push( message.key );
            if ( !message.isAdmin ) { this.activeGuest = new Guest( message ); }
            // if this is admin, add the li element...
            if ( messageManager.isAdmin ) {
                this.listmessageManager.addGuest( this.conversations[ message.chat_id ], message.chat_id ); }}
        return true; }

    setScreen( newScreenId ) { this.terminal.screen = document.getElementById( newScreenId ); }
}
