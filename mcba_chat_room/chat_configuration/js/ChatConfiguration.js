/*
 * Chat configuration
 */
class ChatConfiguration {
    constructor( initChatBot ) {
        this.manager = new ChatOnOffManager(); // in the future, this will be a singleton named "ChatConfigManager"
        this.root_element = jQuery( "#chat-configuration-container" );
        this.addTitleRow();
        this.manager.getSystemStatus( this, "drawTable" );  // pulls entire configuration row.
        this.resumeInit = initChatBot; }

    drawTable( _event, result ) {
        if( result.data.error ) { throw Error( result.data.error ); }
        result.thisObject.config = {
            backgroundColor:     result.data[ 0 ][ 0 ],
            chat_system_enabled: result.data[ 1 ][ 0 ], 
            phone_number:        result.data[ 2 ][ 0 ] };
        result.thisObject.addColorConfigurationRow(); 
        result.thisObject.addPhoneIconColorRow();
        result.thisObject.addOnOffSwitchRow();
        result.thisObject.addTitleRow();
        result.thisObject.addPhoneNumberRow();
        if( result.thisObject.config.chat_system_enabled == "1" ) {
            result.thisObject.resumeInit(); }}

    addPhoneNumberRow() {
        let $phone_label  = jQuery( '<div>', { class: "chatbox-phone-number-label" }).appendTo( this.root_element );
        let $phone_number = jQuery( '<div>', { class: "chatbox-phone-number"       }).appendTo( this.root_element );
        $phone_label.html( "Phone Number" );
        $phone_number.html(  this.config.phone_number ).on( "click", function() {
            this.setInputAndBlur( this.config.phone_number );
        }.bind( this ));  
    }

    setTextAndClick( currentPhoneNumber ) {
        jQuery( '.chatbox-phone-number' ).html( `<div>${ currentPhoneNumber }</div>` ).on( "click", function() {
            this.setInputAndBlur( currentPhoneNumber );
        }.bind( this ));  
    }

    setInputAndBlur( currentPhoneNumber ) {   
        jQuery( '.chatbox-phone-number' ).html( `<input type="text">` ).off();
        jQuery( '.chatbox-phone-number' ).find( "input" ).on( 'keyup', function( e ) { 
            if ( e.which == 13 ) {
                e.preventDefault();
                this.savePhoneNumber();
                this.setTextAndClick( this.config.phone_number ); }}.bind( this ));
        jQuery( '.chatbox-phone-number' ).find( "input" ).val( currentPhoneNumber ).on( "blur", function() {
                this.savePhoneNumber();
                this.setTextAndClick( this.config.phone_number ); }.bind( this )); }

    savePhoneNumber() {
        const phoneNumberManager = new PhoneNumberManager();
        phoneNumberManager.setPhoneNumber( jQuery( '.chatbox-phone-number' ).find( "input" ).val()); 
        this.config.phone_number =  jQuery( '.chatbox-phone-number' ).find( "input" ).val(); }

    addTitleRow() {
        if ( jQuery( ".chat-color-configuration-title-row").length > 0 ) { return; }
        jQuery( '<div>', { class: "chat-color-configuration-title-row" }).appendTo( this.root_element )
        .html( `<span class="config-title">Chat Configurations</span>` ); }

    addColorConfigurationRow() {
        const colorManager = new ChatColorManager();
        jQuery( '<div>', { class: "chat-color-configuration-row-label" }).appendTo( this.root_element );
        jQuery( '<div>', { class: "chat-color-configuration-color-picker" }).appendTo( this.root_element );
        jQuery( ".chat-color-configuration-row-label" ).html( "Main Chat Color" );
        jQuery( ".chat-color-configuration-color-picker" ).html( 
            `<input type="color" id="chat-color-configuration-color-picker" value="#ffffff">`
        ).on( "change", function( _event ) { 
            colorManager.setChatMainColor( jQuery( "#chat-color-configuration-color-picker" ).val()); });
        colorManager.getChatMainColor( this, "setMainChatColor" ); }
    
    addPhoneIconColorRow() {
        const colorManager = new PhoneIconColorManager();
        jQuery( '<div>', { class: "phone-icon-color-configuration-row-label" }).appendTo( this.root_element );
        jQuery( '<div>', { class: "phone-icon-color-picker" }).appendTo( this.root_element );
        jQuery( ".phone-icon-color-configuration-row-label" ).html( "Phone Icon Color" );
        jQuery( ".phone-icon-color-picker" ).html( 
            `<input type="color" id="phone-icon-color-picker" value="#ffffff">`
        ).on( "change", function( _event ) { 
            colorManager.setPhoneIconColor( jQuery( "#phone-icon-color-picker" ).val()); });
        colorManager.getPhoneIconColor( this, "setPhoneIconColor" ); }
    
    setMainChatColor( _event, result ) { 
        jQuery( "#chat-color-configuration-color-picker" ).val( result.data[ 0 ][ 0 ] ); }

    setPhoneIconColor( _event, result ) { 
        jQuery( "#phone-icon-color-picker" ).val( result.data[ 3 ][ 0 ] ); }

    addOnOffSwitchRow() {
        if ( jQuery( ".system-enabled-configuration-row-label" ).length > 0 ) { return; }
        jQuery( '<div>', { class: "system-enabled-configuration-row-label" }).appendTo( this.root_element );
        jQuery( '<div>', { class: "on-off-switch" }).appendTo( this.root_element );
        const onOffSwitch = new OnOffSwitch( ".on-off-switch", this.config );
        onOffSwitch.draw(); }
}
