/** @class MonitorLed */
class MonitorLed {
    classObject;
    ledText;
    RUNNING_COLOR;
    PASS_COLOR;
    FAIL_COLOR;
    constructor() {
        this.classObject = new MonitorLedClassObject();
        this.ledText = "ready.";
        this.RUNNING_COLOR = "lightyellow";
        this.PASS_COLOR = "lightgreen";
        this.FAIL_COLOR = "#fb6666"; // lightred is not understood by CSS.  Whaaa... ??
    }
    setFail() {
        this.setLedBackgroundColor( this.FAIL_COLOR );
        this.setLedTextColor( "white" );
    }
    setPass() {
        this.setLedBackgroundColor( this.PASS_COLOR );
        this.setLedTextColor( "black" );
    }
    setLedBackgroundColor( newColor ) { this.classObject.background_color = newColor; }
    setLedTextColor( newColor ) { this.classObject.color = newColor; }
    setLedText( newText ) { this.ledText = newText; }
}
