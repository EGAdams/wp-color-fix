/* Encryption class. */

class Encryption {

    /*
    *  constructor
     */
    constructor( id, value ) {
        this.id = id;
        this.value = value || 'default value';
    };

    /*
    * member functions
    */

    crazyEncrypt( text ) {
        var words = text.replace( /[\r\n]/g, '' ).toLowerCase().split( ' ' );
        var newWord = '';
        var newArr = [];

        words.map( function ( w ) {
            if ( w.length > 1 ) {
                w.split( '' ).map( function () {
                    var hash = Math.floor( Math.random() * w.length );
                    newWord += w[ hash ];
                    w = w.replace( w.charAt( hash ), '' );
                } );
                newArr.push( newWord );
                newWord = '';

            } else {
                newArr.push( w );
            }
        } );
        text = newArr.join( ' ' );
        return text;
    }

    // Normal encryption - first and last letter fixed 

    normalEncrypt( text ) {
        var words = text.replace( /[\r\n]/g, '' ).toLowerCase().split( ' ' );
        var newWord = '';
        var newArr = [];

        words.map( function ( w ) {
            if ( w.length > 1 ) {
                var lastIndex = w.length - 1;
                var lastLetter = w[ lastIndex ];

                //add the first letter
                newWord += w[ 0 ];
                w = w.slice( 1, lastIndex );

                //scramble only letters in between the first and last letter
                w.split( '' ).map( function ( x ) {
                    var hash = Math.floor( Math.random() * w.length );
                    newWord += w[ hash ];
                    w = w.replace( w.charAt( hash ), '' );
                } );

                //add the last letter
                newWord += lastLetter;
                newArr.push( newWord );
                newWord = '';
            } else {
                newArr.push( w );
            }
        } );
        text = newArr.join( ' ' );
        return text;
    }
}
