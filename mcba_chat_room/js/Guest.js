/*
 *  class Guest
 */
class Guest {

    constructor( messageArg ) {
        this.terminal               = new EasyBox();
        if ( !messageArg ) {
            console.log( "Guest object being constructed without a message." );
            return;
        } 
        
        this.EMAIL_CHECK_DELAY      = 60000; // 60000 -- 1 minute
        this.messages               = [];
        this.keys                   = [];
        this.source_machine         = messageArg.source_machine;
        this.email                  = messageArg.usersEmail;
        this.sender_token           = messageArg.sender_token;
        this.recipient_token        = messageArg.recipient_token;
        this.sender_photo_url       = messageArg.sender_photo_url;
        this.conversation_id        = messageArg.conversation_id;
        this.sender_name            = messageArg.sender_name;
        this.mcba_id                = messageArg.mcba_id;
        this.isAdmin                = messageArg.isAdmin;           // not sure if we need this.  do guests have guests?
        this.registeredUserClass    = "false";
        this.terminal               = new EasyBox();
        
        if ( this.isAdmin == undefined ) { this.isAdmin = "false"; }

        if ( !messageArg ) {
            let warning = "*** WARNING: no message in constructor.  this object is needed for Guest object construction. ***";
            console.log( warning );
        } else {

                // this is not a test.  there is a messageArg, and it should have a source machine.

            if ( !messageArg.source_machine ) {
                throw( new Error( "*** ERROR: no source machine defined! ***" ));
            } else {
                this.source_machine = messageArg.source_machine;
            }    
            
            if ( messageArg.source_machine == "Android" || 
                 messageArg.source_machine.includes( "Wingtec" ) || 
                 messageArg.source_machine.includes( "Samsung" ) || 
                 messageArg.source_machine == "iPhone" ) {
                
                    // check and set guest email
    
                if ( messageArg.usersEmail == null || messageArg.usersEmail == undefined || messageArg.usersEmail.length == 0 ) {
                    if ( messageArg.email &&  messageArg.email.includes( "@" )) {
                        this.email = messageArg.email;
                    } else {                        
                        messageArg.usersEmail = " *** ERROR: guests with machines like " + messageArg.source_machine + 
                        " can not function without an email address! *** ";
                        console.error( messageArg.usersEmail );
                        return { 
                            "error": messageArg.usersEmail
                        };
                    }
                } else {
                    this.email = messageArg.usersEmail;  
                }

                    // check and set sender token

                if ( messageArg.sender_token == null || messageArg.sender_token == undefined || messageArg.sender_token.length == 0 ) { 
                    messageArg.sender_token = " *** ERROR: guests with machines like " + messageArg.source_machine + 
                    " may not function without a sender token! *** ";
                    console.error( "*** no sender token! [" + messageArg.sender_token + "]" );
                    return { 
                        "error": messageArg.sender_token
                    };
                    
                } else {
                    this.sender_token = messageArg.sender_token;
                }

                    // check and set recipient token 

                if ( messageArg.isAdmin == "0" || messageArg.isAdmin == "false" ) {
                    this.recipient_token = messageManager.identity.sender_token;
                } else {
                    this.recipient_token = messageArg.recipient_token;
                }
            }
    
                // check and set chat id
    
            if ( messageArg.chat_id == null || messageArg.chat_id == undefined || messageArg.chat_id.length == 0 ) {
                messageArg.chat_id = " *** ERROR: Guests can not function without a chat id! *** ";
                console.error( messageArg.chat_id );
                debugger;
                return {
                    "error": messageArg.chat_id
                }
            } else {
                this.chat_id = messageArg.chat_id;
            }

                // check and set name
    
            if ( messageArg.name == null || messageArg.name == undefined || messageArg.name.length == 0 ) {
                messageArg.name = " *** Warning: Guest being constructed without a name, setting to Guest... *** ";
                console.log( messageArg.name );
                messageArg.name = "Guest"
                
            } else {
                this.name = messageArg.name;
            }
            this.addMessage( messageArg );
        }
    }

    log( message ) {
        this.terminal_text = message; 
        this.channel.postMessage( this.packet()); // update monitor
    }

    addMessage( message ) {
        let msgScreen = document.getElementById( "messagesContainer" );
        if ( !msgScreen ){ return; }  // no screen? bye..
            // check for key to avoid duplicate messages

        if ( !this.keys.includes( message.key )) {
            this.messages.push( message );
            this.keys.push( message.key );
            return true;
        } else {
            return false;
        }
    }

    setScreen( newScreenId ) {
        this.terminal.screen = document.getElementById( newScreenId );
    }

    setSourceMachine( sourceMachineArg ) { this.source_machine = sourceMachineArg;}
    setEmail( emailArg ) {                 this.email          = emailArg        ;}

    testMe() {
        let errors = [];

        let Message = require( "./Message" );
        class DataArg {
            constructor() {}
            val() {
                return {
                    first_name: "",
                    senderToken: "",
                    recipientToken: "",
                    email:"jack@gmail.com",
                    usersEmail: "jack@gmail.com",
                    name: "",
                    chat_id:"testChatId01",
                    chat_win: "",
                    text:"this is probably a test named text.",
                    message:"this is probably a test named message",
                    isAdmin: "true",
                    readstatus: '0',
                    source_machine: "Android"
                };
            }
        }
        let dataArg = new DataArg();
        let message = new Message( dataArg );
        let guest = new Guest( message )
                
        if ( guest.source_machine != "Android" ) { errors.push(   "*** ERROR: source machine not set correctly! ***" ); }
        if ( guest.email != "jack@gmail.com" ) { errors.push( "*** ERROR: user email not set correctly! ***" ); }
        
        if ( errors.length == 0 ) {
            console.log( "Guest Object passed all tests." );
        } else {
            errors.forEach(error => {
                console.error( error );
            });
        }
    }
}
