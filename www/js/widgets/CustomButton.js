/** CustomButton class */
function CustomButton( attrs ) {
    console.log( "just inside the CustomButton class..." )
    let self = this;
    if ( attrs.background != undefined ) {
        backgroundColor = attrs.background;
    } else { backgroundColor = "white";}
    let buttonImage = document.createElement( "img" );
    let image_string = attrs.img;
    if( attrs.img == "images/" ) {
        buttonImage.src = "";
    } else if ( image_string.includes( "undefined" )) {
        buttonImage.src = ""                            // if attrs.img contains "undefined"
    } else {
        buttonImage.src = attrs.img;
    } 
    buttonImage.alt = attrs.alt;
    buttonImage.css = { "margin-top": attrs[ "margin-top" ]};
    let anchor = new Anchor( attrs );
    this.element = anchor.getAnchor();
    this.element.append( buttonImage );

    console.log( "defining button text..." );
    let button_text = attrs.buttonText;
    if ( button_text != undefined ) {
        this.element.innerHTML = '<span' + ( attrs.font_family ? ' style="font-family:' + attrs.font_family + ';">' : ">" ) + button_text + '</span>';
    } else { this.element.innerHTML = "Custom Text";}

    console.log( "defining handle click event..." );
    this.handleClickEvent = function ( click_event ) {
        var href;
        // Get closest parent 'a' element
        var parentA = click_event.srcElement;
        while ( parentA.parentElement ) {
            if ( parentA.parentElement.tagName === 'A' ) {
            href = parentA.parentElement.href;
            break; }
            parentA = parentA.parentElement; }

        console.log( "setting message handlers for: " + href );
        if (!href) href = click_event.srcElement.href;
        if ( href.indexOf( "signoff" ) != -1 ) {
            console.log( "signoff button clicked..." );
            if ( window.webkit != undefined ) {
                window.webkit.messageHandlers.signoff.postMessage({ text: "signoff" });
            } else {
                console.log( "window.webkit.messageHandlers must be undefined.  This must be an Android device." )}
        } else if ( href.indexOf( "chat" ) != -1 ) {
        console.log( "chat button clicked..." );
        if ( window.webkit != undefined ) {
            window.webkit.messageHandlers.chat.postMessage({ text: "chat" });
        } else {
            console.log( "window.webkit.messageHandlers must be undefined.  This must be an Android device." )}
        } else if ( href.indexOf( "rewards" ) != -1 ) {
            console.log( "rewards button clicked..." );
            if ( window.webkit != undefined ) {
                window.webkit.messageHandlers.rewards.postMessage({ text: "rewards" });
            } else {
                console.log( "window.webkit.messageHandlers must be undefined.  This must be an Android device." )}
                
        } else if ( href.indexOf( "proxidemo" ) != -1 ) {
            console.log( "proxidemo button clicked..." );
            if ( window.webkit != undefined ) {
                window.webkit.messageHandlers.geo.postMessage({ text: "proxidemo" });
            } else {
                console.log( "window.webkit.messageHandlers must be undefined.  This must be an Android device." )}
        } else {
            console.log( "*** ERROR: Unknown button [" + click_event.attrs.action + "] clicked. ***" )}}
    
    console.log( "checking type of attrs.action... " );
    if ( typeof attrs.action !== 'undefined' ) {
        console.log( "attrs.action must be defined" );
        if ( attrs.action == "accept_background_location" ) {
            this.element.context.addEventListener( 'click', function () {
                console.log( "calling ask background permission..." );
                Callback.askBackgroundPermission();
            });
        } else {
            console.log( "warning: init logger needs to be defined here. " );
            // initLogger.logUpdate( "CustomButton: Add click event handler for button [" + attrs.action + "] here." );
            this.element.addEventListener( 'click', function ( click_event ) {
                self.handleClickEvent( click_event );
            });
        }
    } else {
        console.log( "attrs.action is undefined.  skipping click event handler." );
    }
    console.log( "defining width pointer..." );
    this.widthPointer = anchor.getWidthPointer();
    console.log( "done defining CustomButton class." );
}