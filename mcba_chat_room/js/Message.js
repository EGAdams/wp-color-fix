/*
 *  Message class
 *
 *  the data and templates for sending and receiving
 * 
 */

class Message {
  
  constructor( dataArg ) {
      this.data = dataArg;

        // from
      this.first_name               = "";
      this.last_name                = "";
      this.sender_token             = "";
      this.sender_photo_url         = "";
      this.chat_id                  = "";
      this.mcba_id                  = "";
      this.sender_name              = "";
      this.source_machine           = "";
      this.from_guest_id            = "";

        // to
      this.recipient_token          = "";
      this.to_guest_id              = ""; 

      if ( dataArg.val().first_name      ) { this.first_name      = dataArg.val().first_name      ;}
      if ( dataArg.val().senderToken     ) { this.sender_token    = dataArg.val().senderToken     ;}
      if ( dataArg.val().sender_token    ) { this.sender_token    = dataArg.val().sender_token    ;}
      if ( dataArg.val().recipientToken  ) { this.recipient_token = dataArg.val().recipientToken  ;}  
      if ( dataArg.val().recipient_token ) { this.recipient_token = dataArg.val().recipient_token ;}  
      if ( dataArg.val().recipient       ) { this.recipient_token = dataArg.val().recipient       ;}  
      if ( dataArg.val().source_machine  ) { this.source_machine  = dataArg.val().source_machine  ;}  

      this.email      = dataArg.val().email ? dataArg.val().email : "";
      this.usersEmail = dataArg.val().usersEmail;
      this.name       = dataArg.val().name;
      this.chat_id    = dataArg.val().chat_id;
      if ( !this.chat_id || this.chat_id == "" ) {
          console.log( "chat_id is blank.  must be from Android.  setting chat_id to mcba_chat_system_id.  should be email... " );
          this.chat_id = dataArg.val().mcba_chat_system_id;
          if ( this.chat_id == "" ) {
              throw ( "*** ERROR: chat id not defined anywhere!  this system will not work without it. ***" );
          }
      }
      this.chat_win   = dataArg.val().chat_win;
      
      if( this.email.length == 0 ) {
          if ( this.usersEmail ) {
              this.email = this.usersEmail;
          } else {
              if ( this.chat_id ) {
                  this.email = this.chat_id;
              } else {
                  console.error( "*** ERROR: this.chat id is not set among other things.  the email will be invalid. ***" );
                  this.email = "invalid";
              }
          }
      }
      
      if ( dataArg.val().text )
        this.outputText = dataArg.val().text;
      else if ( dataArg.val().message ) {
        this.outputText = dataArg.val().message;
      }  else {
        console.error( "*** ERROR: no message defined. ***" );
        this.outputText = "No Message.";
      }

      if ( dataArg.val().mcba_id ) {
          this.mcba_id = dataArg.val().mcba_id;
      } else {
        console.error( "***ERROR: no mcba ID defined while constructing message. ***");
        this.mcba_id = "Not Defined!";
      }
      this.isAdmin    = dataArg.val().isAdmin;
      this.readstatus = dataArg.val().readstatus;
      this.key        = dataArg.key;
  }

  getReceiveText( chat_id ) {
    return `<div class="chatbot_receive_chat_row_container">
            <div class="chatbot_receive_chat_text">
            ${ this.outputText }
            </div>
        <div>&nbsp;&nbsp;${chat_id}</div>
        <div></div>
    </div>`;

  }

  getSendText( chat_id ) {
    return `<div class="chatbot_send_chat_row_container">
        <div>&nbsp;&nbsp;${chat_id}</div>
            <div class="chatbot_send_chat_text">
             ${ this.outputText }
            </div>
        <div></div>
        <div></div>
    </div>`;
  }
}
