/*
 * class DataArg
 */
class DataArg {
    
    constructor( dataArg ){

        // from
        this.chat_id                = dataArg.conversation_id;
        this.chat_win               = dataArg.conversation_id;
        this.conversation_id        = dataArg.conversation_id;
        this.date                   = dataArg.time;
        this.email                  = dataArg.email;
        this.from_email             = dataArg.email;
        this.from_name              = dataArg.first_name;
        this.isAdmin                = dataArg.isAdmin;
        this.mcba_id                = dataArg.ID;
        this.name                   = dataArg.first_name;
        this.readstatus             = dataArg.readstatus;
        this.sender                 = dataArg.sender_id;
        this.source_machine         = dataArg.device;
        this.text                   = dataArg.message;
        this.message_id             = dataArg.message_id;
        this.sender_id              = dataArg.sender_id;
        this.sender_token           = dataArg.pushid;
    
        // to
        this.to_guest_id            = ""; 
        this.key                    = dataArg.message_id; 
    }
    
    val() { return this; }
}
