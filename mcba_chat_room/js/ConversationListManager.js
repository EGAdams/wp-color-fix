/** @class ConversationListManager */
class ConversationListManager {
    constructor( id, value ) {
        this.object_id = id;
        this.value = value || 'default value';
        this.rootElement = jQuery( '#conversation_list_root_div' );
        this.ID_LENGTH = 20;
        this.guests = [];
        this.conversations = []
        this.unorderedlist = document.createElement( 'ul' );
        this.rootElement.append( this.unorderedlist ); }

    addGuest( guest, conversationId ) {
        if ( !conversationId ) {  console.error( "*** ERROR: no conversation id for list manager! *** " ); return; }
        if ( !this.conversations.includes( conversationId ) ) {
            let listItem = document.createElement( 'li' );
            if ( guest[ 0 ].messages[ 0 ].email.length > 0 ) {
                listItem.innerHTML = guest[ 0 ].messages[ 0 ].email;
            } else {
                let trimmed_conversationId = conversationId.substring( conversationId.length, conversationId.length - this.ID_LENGTH );
                listItem.innerHTML = trimmed_conversationId; }

            jQuery( listItem ).data( 'conversationId', conversationId );
            this.unorderedlist.appendChild( listItem );
            this.guests.push( guest );
            this.conversations.push( conversationId ); }}
}
