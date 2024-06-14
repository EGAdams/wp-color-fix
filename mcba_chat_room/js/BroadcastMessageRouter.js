/*
 *	BroadcastMessageRouter class
 */

class BroadcastMessageRouter {

     /*
      *  constructor
      */
    constructor( id, value ) {
        console.log( "constructing BroadcastMessageRouter..." );
        this.id = id;
        this.value = value || 'default value';

        jQuery.loadScript = function (url, callback) {
            jQuery.ajax({
                url: url,
                dataType: 'script',
                success: callback,
                async: true
            });
        }
    };

    /*
     * member functions
     */

    route( broadcastedPacket ) {

        console.log( "broadcasting packet: " + broadcastedPacket.data.sourceObject );
            // get the sending objects name and call it's processPacket( packetArg ) 
            // method with the passed in packet...

        var packetProcessor = broadcastedPacket.data.sourceObject.charAt(0).toLowerCase() + 
                              broadcastedPacket.data.sourceObject.slice( 1 );  
        if ( window[ packetProcessor ] ) {
            window[ packetProcessor ].processPacket( broadcastedPacket ); 
        } else {
            window[ packetProcessor ] = new window[ broadcastedPacket.data.sourceObject ]();

            if( !window[ packetProcessor ]) {            
                console.error( "*** WARNING: the " + broadcastedPacket.data.sourceObject 
                             + " object is trying to process a packet could not be constructed. ***");
            } else {
                window[ packetProcessor ].processPacket( broadcastedPacket ); 
            }                 
        }
    }

    putValue( valueArg ) { this.value = valueArg; }
    getValue() { return this.value; }
}
