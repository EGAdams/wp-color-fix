



class Tests {
    
    constructor( managerArg ) {
        this.dataSource = new DataSource();
        this.manager = managerArg;
    }

    start() {
        this.clickphone();
        var thisObject = this;
        setTimeout( function() {
            thisObject.writemessage( "test message" );
        }, 2000 );
    }

    clickphone() {
        jQuery( '#floatingphone' ).parent().closest( 'div' ).click();
    }

    writemessage( textToWrite ) {
        jQuery( '.input_text' ).click();
        //jQuery( '.input_text' ).html( textToWrite );
    }
    
    deleteConversations() {
        var nextFunction = "deletedConversations";
        jQuery( document ).on( nextFunction, this[ nextFunction ] );
        var args = {
            query: "delete from wp_mcba_chat_conversations",
            trigger: nextFunction,
            thisObject: this.manager
        }
        this.dataSource.runQuery( args );
    }
    
    deletedConversations( event, results ) {
        results.thisObject.log( "Event: " + event.type );
    }

    deleteMessages() {
        var nextFunction = "deletedMessages";
        jQuery( document ).on( nextFunction, this[ nextFunction ] );
        var args = {
            query: "delete from wp_mcba_chat_messages",
            trigger: nextFunction,
            thisObject: this.manager
        }
        this.dataSource.runQuery( args );
    }
    
    deletedMessages( event, results ) {
        results.thisObject.log( "Event: " + event.type );
    }

    deleteUsers() {
        var nextFunction = "deletedUsers";
        jQuery( document ).on( nextFunction, this[ nextFunction ] );
        var args = {
            query: "delete from wp_mcba_users where device='browser'",
            trigger: nextFunction,
            thisObject: this.manager
        }
        this.dataSource.runQuery( args );
    }
    
    deletedUsers( event, results ) {
        results.thisObject.log( "Event: " + event.type );
    }
}

