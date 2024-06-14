class OnOffSwitch {
    constructor( element_class, config ) {
            this.$element = jQuery( element_class );
            this.config = config;
            this.on = false;
            if ( config.chat_system_enabled == "1" ) {  
                this.on = true;
                this.checked = "checked"; }
            this.$element.off().on( 'change', function () { this.toggle(); }.bind( this ));  
            this.html = `
                <label class="on-off-switch">
                <input type="checkbox" ${ this.checked }>
                <span class="slider round"></span>
                </label>`; }

    toggle() {
        const chatOnOffManager = new ChatOnOffManager();
        if ( this.on ) {
            this.on = false;
            jQuery( ".slider" ).css( "background-color", "#CCCCCC" );
            jQuery( ".system-enabled-configuration-row-label" ).html( "System Disabled" );
            jQuery( ".conversation_list" ).css( "display", "none" );
            jQuery( "#chat-box" ).css(          "display", "none" );
            jQuery( "#chat-color-configuration-color-picker" ).prop( "disabled", true );
            chatOnOffManager.setSystemStatus( "0" ); 
        } else {
            this.on = true;
            jQuery( ".slider" ).css( "background-color", "#16cc89" );
            jQuery( ".system-enabled-configuration-row-label" ).html( "System Enabled" );
            jQuery( ".conversation_list" ).css( "display", "block" );
            jQuery( "#chat-box" ).css(          "display", "block" );
            jQuery( "#chat-color-configuration-color-picker" ).prop( "disabled", false );
            chatOnOffManager.setSystemStatus( "1" );
            initChatBot(); }}

    draw() {
        this.$element.html( this.html );
        if ( this.on ) jQuery( ".slider" ).css( "background-color", "#16cc89" );
        jQuery( ".system-enabled-configuration-row-label" ).html( this.on ? "System Enabled" : "System Disabled" );
        jQuery( "#chat-color-configuration-color-picker" ).prop( "disabled", this.on ? false : true ); }
}
