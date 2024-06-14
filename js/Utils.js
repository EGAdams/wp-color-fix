/*
 *
 */
class Utils {
    static listAllEventListeners() {
        const allElements = Array.prototype.slice.call( document.querySelectorAll( '*' ) );
        allElements.push( document );
        allElements.push( window );

        const types = [];

        for ( let ev in window ) {
            if ( /^on/.test( ev ) ) types[ types.length ] = ev;
        }

        let elements = [];
        for (const element of allElements) {
            const currentElement = element;
            for (const type_element_index of types) {
                if ( typeof currentElement[ type_element_index ] === 'function' ) {
                    elements.push( {
                        "node": currentElement,
                        "type": type_element_index,
                        "func": currentElement[ type_element_index ].toString(),
                    });
                }
            }
        }

        return elements.sort( function ( a, b ) {
            return a.type.localeCompare( b.type );
        });
    }
}
