/*
 *
 * class EasyBox
 * 
 */

class EasyBox  {
    constructor( screen_id ) { this.screen = document.getElementById( screen_id ); }
    clearScreen() { this.screen.innerHTML = ""; }
    write( text ) {
        if ( !this.screen ) {
            console.log( "WARNING: message sent to uninitialized screen." );
            return;
        }
        this.screen.innerHTML += text + "<br>";
        jQuery( ".screen-area"  ).scrollTop( function() { return this.scrollHeight; });  
    }
    setScreen( newScreenId ) { this.screen = document.getElementById( newScreenId ); }
}
