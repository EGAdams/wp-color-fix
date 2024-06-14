/*
 * class Tester
 */

class Tester {
    constructor( testableObjectsArg ) {
        this.testableObjects = testableObjectsArg;
    }

    start() {
        testableObjects.forEach( specimen => {
            if ( specimen.length != 0 && !specimen.match( /^#/ )) {
                subject = new MonitoredObject();
                console.log( "\nbegin " + specimen + " test..." );
                subject.testMe();
                console.log( "end " + specimen + " test.\n" );
            }
        });
    }   
}

var testableObjects = [ 'MonitoredObject' ];
var tester = new Tester( testableObjects );
tester.start();

console.log( "end testing testable objects." );

module.exports = Tester;